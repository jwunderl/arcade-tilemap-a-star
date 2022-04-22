//+array+SimpleLocation sim:7.5%, meowbit:10.5% ms comparing with origin
namespace scene {
    class PrioritizedLocation {
        constructor(
            public loc: SimpleLocation,
            public cost: number,
            public totalCost: number  //cost+heuristic
        ) { }
    }

    class LocationNode {
        public visited: boolean;

        constructor(
            public l: SimpleLocation,
            public parent: LocationNode,
            public lastCost: number
        ) {
            this.visited = false;
        }
    }

    class SimpleLocation {
        constructor(public col: number, public row: number) { }
    }

    /**
     * Find the shortest path between start and end that does not contain walls and optionally limited to a pathable tile.
     */
    //% block="path from $start to $end||on tiles of $onTilesOf"
    //% start.shadow=mapgettile
    //% end.shadow=mapgettile
    //% onTilesOf.shadow=tileset_tile_picker
    //% onTilesOf.decompileIndirectFixedInstances=true
    //% help=github:arcade-tilemap-a-star/docs/a-star
    //% group="Path Following" weight=10
    export function aStar(start: tiles.Location, end: tiles.Location, onTilesOf: Image = null) {
        const tm = game.currentScene().tileMap;
        if (!tm || !start || !end)
            return undefined;

        const end1 = new SimpleLocation(end.col, end.row)
        const start1 = new SimpleLocation(start.col, start.row)
        if (!isWalkable(end1, onTilesOf, tm))
            return undefined;

        return generalAStar(tm, start1, onTilesOf,
            t => tileLocationHeuristic(t, end1),
            l => l.col == end1.col && l.row == end1.row);
    }

    export function aStarToAnyOfType(start: tiles.Location, tile: Image, onTilesOf: Image) {
        const tm = game.currentScene().tileMap;
        if (!tm || !start)
            return undefined;
        const start1 = new SimpleLocation(start.col, start.row)
        const endIndex = tm.getImageType(tile);
        const potentialEndPoints = tm.getTilesByType(endIndex);

        if (!potentialEndPoints || potentialEndPoints.length === 0)
            return undefined;

        return generalAStar(tm, start1, onTilesOf,
            t => 0,
            l => {
                return endIndex === tm.getTileIndex((l as any)._col, (l as any)._row)
            });
    }

    export function generalAStar(tm: tiles.TileMap, start: SimpleLocation, onTilesOf: Image,
        heuristic: (tile: SimpleLocation) => number,
        isEnd: (tile: SimpleLocation) => boolean): tiles.Location[] {

        if (!isWalkable(start, onTilesOf, tm)) {
            return undefined;
        }

        //changed to array, sim:50%, Meowbit:98.5%
        const consideredTiles: Array<PrioritizedLocation> = []
        const encountedLocations: LocationNode[][] = [[]];

        function updateOrFillLocation(l: SimpleLocation, parent: LocationNode, cost: number) {
            const row = l.row;
            const col = l.col;


            const colData = (encountedLocations[col] || (encountedLocations[col] = []));
            const lData = colData[row];

            if (!lData) {
                colData[row] = new LocationNode(
                    l,
                    parent,
                    cost
                );
            } else if (lData.lastCost > cost) {//!lData.visited && 
                lData.lastCost = cost;
                lData.parent = parent;
            } else {
                return;
            }

            const newConsideredTile = new PrioritizedLocation(
                l,
                cost,
                cost + heuristic(l)
            )


            if (consideredTiles.length == 0) {
                consideredTiles.push(newConsideredTile)
                return
            }
            let i = consideredTiles.length - 1
            for (; i >= 0; i--) {  //seek&insert from end, last N are more possible hit
                if (newConsideredTile.totalCost < consideredTiles[i].totalCost) {
                    consideredTiles.insertAt(i + 1, newConsideredTile)
                    return;
                }
            }
            if (i < 0)
                consideredTiles.insertAt(0, newConsideredTile)
        }

        updateOrFillLocation(start, null, 0);

        let end: SimpleLocation = null;
        while (consideredTiles.length !== 0) {

            const currLocation = consideredTiles.pop();

            if (isEnd(currLocation.loc)) {
                end = currLocation.loc;
                break;
            }

            const row = currLocation.loc.row;
            const col = currLocation.loc.col;

            const neighborCost = currLocation.cost + 1000;
            const cornerCost = currLocation.cost + 1414//1.414213562373095;

            const dataForCurrLocation = encountedLocations[col][row];

            if (dataForCurrLocation && dataForCurrLocation.visited) {
                continue;
            }
            dataForCurrLocation.visited = true;

            const left = new SimpleLocation(col - 1, row);
            const right = new SimpleLocation(col + 1, row);
            const top = new SimpleLocation(col, row - 1);
            const bottom = new SimpleLocation(col, row + 1);

            let leftIsWall = false
            let rightIsWall = false
            let topIsWall = false
            let bottomIsWall = false

            if (onTilesOf) {
                leftIsWall = !isWalkable(left, onTilesOf, tm);
                rightIsWall = !isWalkable(right, onTilesOf, tm);
                topIsWall = !isWalkable(top, onTilesOf, tm);
                bottomIsWall = !isWalkable(bottom, onTilesOf, tm);
            } else {
                leftIsWall = tm.isObstacle(left.col, left.row);
                rightIsWall = tm.isObstacle(right.col, right.row);
                topIsWall = tm.isObstacle(top.col, top.row);
                bottomIsWall = tm.isObstacle(bottom.col, bottom.row);
            }
            if (!leftIsWall) {
                updateOrFillLocation(left, dataForCurrLocation, neighborCost);
                if (!topIsWall) {
                    const topLeft = new SimpleLocation(col - 1, row - 1);
                    if (!tm.isObstacle(topLeft.col, topLeft.row)) updateOrFillLocation(topLeft, dataForCurrLocation, cornerCost);
                }
                if (!bottomIsWall) {
                    const bottomLeft = new SimpleLocation(col - 1, row + 1);
                    if (!tm.isObstacle(bottomLeft.col, bottomLeft.row)) updateOrFillLocation(bottomLeft, dataForCurrLocation, cornerCost);
                }
            }

            if (!rightIsWall) {
                updateOrFillLocation(right, dataForCurrLocation, neighborCost);
                if (!topIsWall) {
                    const topRight = new SimpleLocation(col + 1, row - 1);
                    if (!tm.isObstacle(topRight.col, topRight.row)) updateOrFillLocation(topRight, dataForCurrLocation, cornerCost);
                }
                if (!bottomIsWall) {
                    const bottomRight = new SimpleLocation(col + 1, row + 1);
                    if (!tm.isObstacle(bottomRight.col, bottomRight.row)) updateOrFillLocation(bottomRight, dataForCurrLocation, cornerCost);
                }
            }

            if (!topIsWall) updateOrFillLocation(top, dataForCurrLocation, neighborCost);
            if (!bottomIsWall) updateOrFillLocation(bottom, dataForCurrLocation, neighborCost);
        }

        const endCol = end && encountedLocations[end.col];
        const endDataNode = endCol && endCol[end.row];

        // no path found
        if (!end || !endDataNode)
            return undefined;

        let curr = endDataNode;

        // otherwise trace back path to end
        const output: tiles.Location[] = [];

        while (curr) {
            output.unshift(new tiles.Location(curr.l.col, curr.l.row, tm));
            curr = curr.parent;
        }

        return output;
    }

    function tileLocationHeuristic(tile: SimpleLocation, target: SimpleLocation) {
        const xDist = Math.abs(target.col - tile.col)
        const yDist = Math.abs(target.row - tile.row)
        return Math.max(xDist, yDist) * 1000 + Math.min(xDist, yDist) * 414
    }

    function isWalkable(loc: SimpleLocation, onTilesOf: Image, tm: tiles.TileMap): boolean {
        if (tm.isObstacle(loc.col, loc.row)) return false;
        if (!onTilesOf) return true;
        const img = tm.getTileImage(tm.getTileIndex(loc.col, loc.row))
        return img.equals(onTilesOf);
    }
}
