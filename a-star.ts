

namespace tiles {
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

    function aStar(start: tiles.Location, end: tiles.Location) {
        const consideredTiles = new Heap<PrioritizedLocation>(
            (a, b) => (a.cost + a.extraCost) - (b.cost + b.extraCost)
        );
        const encountedLocations: LocationNode[][] = [[]];

        function updateOrFillLocation(l: tiles.Location, parent: LocationNode, cost: number) {
            const row = locationRow(l);
            const col = locationCol(l);
            const rowData = (encountedLocations[row] || (encountedLocations[row] = []));
            const lData = rowData[col];

            if (!lData) {
                rowData[col] = new LocationNode(
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
                    start,
                    cost,
                    tileLocationHeuristic(l, end)
                )
            );
        }
        updateOrFillLocation(start, null, 0);

        while (consideredTiles.length !== 0) {
            const currLocation = consideredTiles.pop();
            const row = locationRow(currLocation.loc);
            const col = locationRow(currLocation.loc);
            const dataForCurrLocation = encountedLocations[row][col];

            if (currLocation.loc.x === end.x && currLocation.loc.y === end.y) {
                break;
            } else if (dataForCurrLocation && dataForCurrLocation.visited) {
                continue;
            }

            dataForCurrLocation.visited = true;

            const neighbors = [
                tiles.getTileLocation(row - 1, col),
                tiles.getTileLocation(row + 1, col),
                tiles.getTileLocation(row, col - 1),
                tiles.getTileLocation(row, col + 1)
            ];

            const nextCost = currLocation.cost + 1;

            for (const node of neighbors) {
                updateOrFillLocation(node, dataForCurrLocation, nextCost);
            }
        }

        const endRow = encountedLocations[locationRow(end)];
        const endDataNode = endRow && endRow[locationCol(end)];

        // no path found
        if (!endDataNode)
            return undefined;

        let curr = endDataNode;

        // otherwise trace back path to end
        const output = [];

        while (curr) {
            output.push(curr.l);
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
    function locationRow(tiles: tiles.Location): number {
        return (tiles as any)._row;
    }

    function locationCol(tiles: tiles.Location): number {
        return (tiles as any)._col;
    }
}