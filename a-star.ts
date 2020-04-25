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
        // we should either expose this or the fns in this; I'm guessing pxt-tilemaps already does?
        const tileMapData = (tm as any)._map;

        if (isWall(start, tileMapData) || isWall(end, tileMapData)) {
            return undefined;
        }

        const consideredTiles = new Heap<PrioritizedLocation>(
            (a, b) => (a.cost + a.extraCost) - (b.cost + b.extraCost)
        );
        const encountedLocations: LocationNode[][] = [[]];

        function updateOrFillLocation(l: tiles.Location, parent: LocationNode, cost: number) {
            const row = locationRow(l);
            const col = locationCol(l);
            if (row < 0 || col < 0 || row >= tileMapData.height || col >= tileMapData.width) {
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

            const neighbors = [
                tiles.getTileLocation(col - 1, row),
                tiles.getTileLocation(col + 1, row),
                tiles.getTileLocation(col, row - 1),
                tiles.getTileLocation(col, row + 1)
            ];

            const nextCost = currLocation.cost + 1;
            for (const node of neighbors.filter(l => !isWall(l, tileMapData))) {
                updateOrFillLocation(node, dataForCurrLocation, nextCost);
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

    function isWall(l: tiles.Location, data: tiles.TileMapData) {
        const r = locationRow(l);
        const c = locationCol(l);
        return data.isWall(c, r);
    }
}