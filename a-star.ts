

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
        constructor(public parent: tiles.Location) {
            this.visited = false;
        }
    }

    function aStar(start: tiles.Location, end: tiles.Location) {
        const consideredTiles = new Heap<PrioritizedLocation>(
            (a, b) => (a.cost + a.extraCost) - (b.cost + b.extraCost)
        );

        const encountedLocations: LocationNode[][] = [[]];
        consideredTiles.push(new PrioritizedLocation(start, 0, 0));

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

            // const outgoingEdges = input[currLocation];

            // // todo make outgoing edges the keys of outgoing edges, not the map itself
            // for (const node in outgoingEdges) {
            //     if (!evaluatedNodes[node]) {
            //         evaluatedNodes[node] = {
            //             cameFrom: currNode,
            //             visited: false
            //         };
            //     }
            //     consideredTiles.push(node);
            // }
        }
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