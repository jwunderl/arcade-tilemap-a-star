// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level":
            case "level":return tiles.createTilemap(hex`1000100002020202020202020202020202020202020202020202020202020202020202020202020201020202020202020202020201010101010101010101010202020202020202020202020202020101020202020202020202020201020202010102020202020202020202010202020201020202020202020202020102020202010202020202020101010101020202010102020202020202020102020202010102020202020202020201020202010102020202020101010101010101010102020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202`, img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`, [myTiles.transparency16,sprites.castle.tilePath5,sprites.castle.tileGrass1], TileScale.Sixteen);
            case "level1":
            case "level1":return tiles.createTilemap(hex`0a0008000807070707070707070704070707070707070707010202020205070707070707070707040707070707070707070102020205070707070707070707040602020202020202020307070707070707070707`, img`
. 2 2 2 2 2 2 2 2 2 
. 2 2 2 2 2 2 2 2 2 
. . . . . . 2 2 2 2 
2 2 2 2 2 . 2 2 2 2 
2 2 2 2 2 . . . . . 
2 2 2 2 2 2 2 2 2 . 
. . . . . . . . . . 
2 2 2 2 2 2 2 2 2 2 
`, [myTiles.transparency16,sprites.vehicle.roadTurn3,sprites.vehicle.roadHorizontal,sprites.vehicle.roadTurn4,sprites.vehicle.roadVertical,sprites.vehicle.roadTurn2,myTiles.tile2,sprites.castle.tilePath5,myTiles.tile3], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "tile1":return tile1;
            case "myTile":
            case "tile2":return tile2;
            case "myTile0":
            case "tile3":return tile3;
            case "myTile1":
            case "tile4":return tile4;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
