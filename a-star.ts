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

    //% block="path from $start to $end"
    //% start.shadow=mapgettile
    //% end.shadow=mapgettile
    //% group="Tiles" weight=10
    export function aStar(start: tiles.Location, end: tiles.Location) {
        const tm = game.currentScene().tileMap;

        if (isWall(start, tm) || isWall(end, tm)) {
            return undefined;
        }

        const consideredTiles = new Heap<PrioritizedLocation>(
            (a, b) => (a.cost + a.extraCost) - (b.cost + b.extraCost)
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
            } else if (lData.lastCost > cost) {
                lData.lastCost = cost;
                lData.parent = parent;
            } else {
                return;
            }

            consideredTiles.push(
                new PrioritizedLocation(
                    l,
                    cost,
                    tileLocationHeuristic(l, end)
                )
            );
        }
        updateOrFillLocation(start, null, 0);

        while (consideredTiles.length !== 0) {
            const currLocation = consideredTiles.pop();

            if (currLocation.loc.x === end.x && currLocation.loc.y === end.y) {
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

            const leftIsWall = isWall(left, tm);
            const rightIsWall = isWall(right, tm);
            const topIsWall = isWall(top, tm);
            const bottomIsWall = isWall(bottom, tm);

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

            // TODO: account for extra transition time for diagonals;
            const neighborCost = currLocation.cost + 1;
            for (const node of neighbors) {
                updateOrFillLocation(node, dataForCurrLocation, neighborCost);
            }
            if (corners.length) {
                const costToMoveToCorner = 2 / (Math.sqrt(2));
                const cornerCost = currLocation.cost + costToMoveToCorner;
                for (const corner of corners) {
                    updateOrFillLocation(corner, dataForCurrLocation, cornerCost);
                }
            }
        }

        const endCol = encountedLocations[locationCol(end)];
        const endDataNode = endCol && endCol[locationRow(end)];

        // no path found
        if (!endDataNode)
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

        return Math.sqrt(
            (startCol - endCol) ** 2
            + (startRow - endRow) ** 2
        );
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
}