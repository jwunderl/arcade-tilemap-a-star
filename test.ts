
game.consoleOverlay.setVisible(true, 2)
tiles.setTilemap(tilemap`level`)

let mySprite: Sprite = sprites.create(img`
    . . . . . f f 4 4 f f . . . . .
    . . . . f 5 4 5 5 4 5 f . . . .
    . . . f e 4 5 5 5 5 4 e f . . .
    . . f b 3 e 4 4 4 4 e 3 b f . .
    . . f 3 3 3 3 3 3 3 3 3 3 f . .
    . f 3 3 e b 3 e e 3 b e 3 3 f .
    . f 3 3 f f e e e e f f 3 3 f .
    . f b b f b f e e f b f b b f .
    . f b b e 1 f 4 4 f 1 e b b f .
    f f b b f 4 4 4 4 4 4 f b b f f
    f b b f f f e e e e f f f b b f
    . f e e f b d d d d b f e e f .
    . . e 4 c d d d d d d c 4 e . .
    . . e f b d b d b d b b f e . .
    . . . f f 1 d 1 d 1 d f f . . .
    . . . . . f f b b f f . . . . .
`)
controller.moveSprite(mySprite)
scene.cameraFollowSprite(mySprite)

let flag = false;
controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    const res = scene.aStar(tiles.getTileLocation(0, 11), tiles.getTileLocation(0, 3), sprites.castle.tilePath5);
    const enemy = sprites.create(img`
        . . . . . . . . . . . . . . . .
        . . . . . . 6 6 6 6 . . . . . .
        . . . . 6 6 6 5 5 6 6 6 . . . .
        . . . 7 7 7 7 6 6 6 6 6 6 . . .
        . . 6 7 7 7 7 8 8 8 1 1 6 6 . .
        . . 7 7 7 7 7 8 8 8 1 1 5 6 . .
        . 6 7 7 7 7 8 8 8 8 8 5 5 6 6 .
        . 6 7 7 7 8 8 8 6 6 6 6 5 6 6 .
        . 6 6 7 7 8 8 6 6 6 6 6 6 6 6 .
        . 6 8 7 7 8 8 6 6 6 6 6 6 6 6 .
        . . 6 8 7 7 8 6 6 6 6 6 8 6 . .
        . . 6 8 8 7 8 8 6 6 6 8 6 6 . .
        . . . 6 8 8 8 8 8 8 8 8 6 . . .
        . . . . 6 6 8 8 8 8 6 6 . . . .
        . . . . . . 6 6 6 6 . . . . . .
        . . . . . . . . . . . . . . . .
    `, SpriteKind.Enemy)
    enemy.setPosition(mySprite.x, mySprite.y)
    scene.followPath(enemy, res)
});
mySprite.setFlag(SpriteFlag.BounceOnWall, false)
scene.onPathCompletion(SpriteKind.Enemy, function (sprite: Sprite, location: tiles.Location) {
    sprite.destroy(effects.ashes);
});

controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
    const pfs = sprites.allOfKind(SpriteKind.Enemy);
    pfs.forEach(s => {
        scene.followPath(s, null);
        s.vx = 0;
        s.vy = 0;
    });
});

const dbg = true;
game.onUpdate(() => {
    if (dbg) {
        sprites.allOfKind(SpriteKind.Enemy)
            .forEach(s => s.say(Math.round(scene.spritePercentPathCompleted(s)).toString()));
    }
});
