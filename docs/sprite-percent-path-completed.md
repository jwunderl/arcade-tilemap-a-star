# sprite Percent Path Completed

Returns an approximation between 0 and 100 of how much of the percentage of the path
that the given sprite is following has completed.
If the sprite is not currently following a path,
this returns 100 (as the sprite has trivially completed the empty path).

```sig
scene.spritePercentPathCompleted(null)
```

## Parameters

* **sprite**: A sprite to get the path completion percentage of.

## Returns

* A percentage between 0 and 100 based on how much of a path the sprite has completed

## Example

Creates a sprite that will constantly say what percentage of it's current path it has completed.

```blocks
let mySprite = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . b 5 5 b . . . 
    . . . . . . b b b b b b . . . . 
    . . . . . b b 5 5 5 5 5 b . . . 
    . b b b b b 5 5 5 5 5 5 5 b . . 
    . b d 5 b 5 5 5 5 5 5 5 5 b . . 
    . . b 5 5 b 5 d 1 f 5 d 4 f . . 
    . . b d 5 5 b 1 f f 5 4 4 c . . 
    b b d b 5 5 5 d f b 4 4 4 4 b . 
    b d d c d 5 5 b 5 4 4 4 4 4 4 b 
    c d d d c c b 5 5 5 5 5 5 5 b . 
    c b d d d d d 5 5 5 5 5 5 5 b . 
    . c d d d d d d 5 5 5 5 5 d b . 
    . . c b d d d d d 5 5 5 b b . . 
    . . . c c c c c c c c b b . . . 
    `, SpriteKind.Player)
game.onUpdate(() => {
    mySprite.say(scene.spritePercentPathCompleted(mySprite))
})
```

```package
arcade-tilemap-a-star=github:jwunderl/arcade-tilemap-a-star
```