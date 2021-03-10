namespace scene {
    class PrioritizedLocation {
        constructor(
            public loc: tiles.Location,
            public cost: number,
            // cost from heuristic
            public extraCost: number
        ) { }
    }

    class LocationNode {
        public visited: boolean;

        constructor(
            public l: tiles.Location,
            public parent: LocationNode,
            public lastCost: number
        ) {
            this.visited = false;
        }
    }

    /**
     * Find the shortest path between start and end that does not contain walls and optionally limited to a pathable tile.
     */
    //% block="path from $start to $end||on tiles of $onTilesOf"
    //% start.shadow=mapgettile
    //% end.shadow=mapgettile
    //% onTilesOf.shadow=tileset_tile_picker
    //% onTilesOf.decompileIndirectFixedInstances=true
    //% group="Path Following" weight=10
    export function aStar(start: tiles.Location, end: tiles.Location, onTilesOf: Image = null) {
        const tm = game.currentScene().tileMap;
        if (!tm || !start || !end || !isWalkable(end, onTilesOf, tm))
            return undefined;

        return generalAStar(tm, start, onTilesOf,
            t => tileLocationHeuristic(t, end),
            l => l.x === end.x && l.y === end.y);
    }

    export function aStarToAnyOfType(start: tiles.Location, tile: Image, onTilesOf: Image) {
        const tm = game.currentScene().tileMap;
        if (!tm || !start)
            return undefined;
        const endIndex = tm.getImageType(tile);
        const potentialEndPoints = tm.getTilesByType(endIndex);

        if (!potentialEndPoints || potentialEndPoints.length === 0)
            return undefined;

        return generalAStar(tm, start, onTilesOf,
            t => 0,
            l => {
                return endIndex === tm.getTileIndex((l as any)._col, (l as any)._row)
            });
    }

    export function generalAStar(tm: tiles.TileMap, start: tiles.Location, onTilesOf: Image,
        heuristic: (tile: tiles.Location) => number,
        isEnd: (tile: tiles.Location) => boolean): tiles.Location[] {

        if (!isWalkable(start, onTilesOf, tm)) {
            return undefined;
        }

        const consideredTiles = new Heap<PrioritizedLocation>(
            (a, b) => (a.cost ** 2 + a.extraCost) - (b.cost ** 2 + b.extraCost)
        );
        const encountedLocations: LocationNode[][] = [[]];

        function updateOrFillLocation(l: tiles.Location, parent: LocationNode, cost: number) {
            const row = locationRow(l);
            const col = locationCol(l);

            if (tm.isObstacle(col, row)) {
                return;
            }

            const colData = (encountedLocations[col] || (encountedLocations[col] = []));
            const lData = colData[row];

            if (!lData) {
                colData[row] = new LocationNode(
                    l,
                    parent,
                    cost
                );
            } else if (!lData.visited && lData.lastCost > cost) {
                lData.lastCost = cost;
                lData.parent = parent;
            } else {
                return;
            }

            let h = heuristic(l);
            // need to store extra cost on location node too, and keep that up to date
            // if (h > parent.extraCost) {

            // }

            consideredTiles.push(
                new PrioritizedLocation(
                    l,
                    cost,
                    h
                )
            );
        }
        updateOrFillLocation(start, null, 0);

        let end: tiles.Location = null;
        while (consideredTiles.length !== 0) {
            const currLocation = consideredTiles.pop();

            if (isEnd(currLocation.loc)) {
                end = currLocation.loc;
                break;
            }

            const row = locationRow(currLocation.loc);
            const col = locationCol(currLocation.loc);

            const dataForCurrLocation = encountedLocations[col][row];

            if (dataForCurrLocation && dataForCurrLocation.visited) {
                continue;
            }

            dataForCurrLocation.visited = true;

            const neighbors: tiles.Location[] = [];
            const corners: tiles.Location[] = [];

            const left = tiles.getTileLocation(col - 1, row);
            const right = tiles.getTileLocation(col + 1, row);
            const top = tiles.getTileLocation(col, row - 1);
            const bottom = tiles.getTileLocation(col, row + 1);

            const leftIsWall = !isWalkable(left, onTilesOf, tm);
            const rightIsWall = !isWalkable(right, onTilesOf, tm);
            const topIsWall = !isWalkable(top, onTilesOf, tm);
            const bottomIsWall = !isWalkable(bottom, onTilesOf, tm);

            if (!leftIsWall) {
                neighbors.push(left);
                if (!topIsWall) {
                    const topLeft = tiles.getTileLocation(col - 1, row - 1);
                    if (!isWall(topLeft, tm)) corners.push(topLeft);
                }
                if (!bottomIsWall) {
                    const bottomLeft = tiles.getTileLocation(col - 1, row + 1);
                    if (!isWall(bottomLeft, tm)) corners.push(bottomLeft);
                }
            }

            if (!rightIsWall) {
                neighbors.push(right);
                if (!topIsWall) {
                    const topRight = tiles.getTileLocation(col + 1, row - 1);
                    if (!isWall(topRight, tm)) corners.push(topRight);
                }
                if (!bottomIsWall) {
                    const bottomRight = tiles.getTileLocation(col + 1, row + 1);
                    if (!isWall(bottomRight, tm)) corners.push(bottomRight);
                }
            }

            if (!topIsWall) neighbors.push(top);
            if (!bottomIsWall) neighbors.push(bottom);

            const neighborCost = currLocation.cost + 1;
            for (const node of neighbors) {
                updateOrFillLocation(node, dataForCurrLocation, neighborCost);
            }
            if (corners.length) {
                // 2 / Math.sqrt(2)
                const costToMoveToCorner = 1.414213562373095;
                const cornerCost = currLocation.cost + costToMoveToCorner;
                for (const corner of corners) {
                    updateOrFillLocation(corner, dataForCurrLocation, cornerCost);
                }
            }
        }

        const endCol = end && encountedLocations[locationCol(end)];
        const endDataNode = endCol && endCol[locationRow(end)];

        // no path found
        if (!end || !endDataNode)
            return undefined;

        let curr = endDataNode;

        // otherwise trace back path to end
        const output = [];

        while (curr) {
            output.unshift(curr.l);
            curr = curr.parent;
        }

        return output;
    }

    function tileLocationHeuristic(tile: tiles.Location, target: tiles.Location) {
        const startCol = locationCol(tile);
        const startRow = locationRow(tile);
        const endCol = locationCol(target);
        const endRow = locationRow(target);

        return ((startCol - endCol) ** 2
            + (startRow - endRow) ** 2)
    }

    // TODO: these should probably be exposed on tiles.Location;
    // no reason for them to be hidden
    function locationRow(l: tiles.Location): number {
        return l.y >> 4;
    }

    function locationCol(l: tiles.Location): number {
        return l.x >> 4;
    }

    function isWall(l: tiles.Location, tm: tiles.TileMap) {
        const r = locationRow(l);
        const c = locationCol(l);
        return tm.isObstacle(c, r);
    }

    function isWalkable(l: tiles.Location, onTilesOf: Image, tm: tiles.TileMap): boolean {
        if (isWall(l, tm)) return false;
        if (!onTilesOf) return true;
        const img = tm.getTileImage(tm.getTileIndex(l.col, l.row))
        return img.equals(onTilesOf);
    }
}