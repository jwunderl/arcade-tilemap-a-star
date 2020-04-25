namespace myTiles {
    //% blockIdentity=images._tile
    export const tile0 = img`
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
    `
}
game.consoleOverlay.setVisible(true, 2)
tiles.setTilemap(tiles.createTilemap(
    hex`0a0008000300000000000000030303030003000000000300030303030300000003000003030003030000030300000303030003000003000000030303030003030000030303030303030300030300000303030303`,
    img`
        . 2 2 2 2 2 2 2 . .
        . . 2 . 2 2 2 2 . 2
        . . . . . 2 2 2 . 2
        2 . . 2 . . 2 2 . .
        2 2 . . . 2 . 2 2 .
        2 2 2 . . . . 2 . .
        2 2 . . . . . . . .
        2 . . 2 2 . . . . .
    `,
    [myTiles.tile0, sprites.castle.tilePath7, sprites.castle.tilePath4, sprites.castle.tileGrass2],
    TileScale.Sixteen
))


controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    const res = tiles.aStar(tiles.getTileLocation(0, 0), tiles.getTileLocation(9, 0));
    for (const l of (res || [])) {
        tiles.setTileAt(l, sprites.castle.tilePath4)
        pause(100)
    }
});
