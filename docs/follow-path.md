# follow Path

```sig
scene.followPath(null, null)
```

## Parameters

* **sprite**: The sprite that should follow the path
* **path**: An array of tile locations a path should follow
* **speed** (optional): A speed (in pixels per second) at which the sprite should follow the path.

## Example

```blocks
scene.setTilemap(tilemap`level1`)
let myPath = scene.aStar(tiles.getTileLocation(0, 0), tiles.getTileLocation(9, 7))
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
scene.followPath(mySprite, myPath)
```

```package
arcade-tilemap-a-star=github:jwunderl/arcade-tilemap-a-star
```

```jres
{
    "transparency16": {
        "data": "hwQQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
        "mimeType": "image/x-mkcd-f4",
        "tilemapTile": true
    },
    "tile1": {
        "data": "hwQQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
        "mimeType": "image/x-mkcd-f4",
        "tilemapTile": true
    },
    "tile2": {
        "data": "hwQQABAAAADbu7u7u7u7vdu7uxu9u7u927u7G7G7u728vbsbsbvby7y9uxuxu9vLvL2727G728u8vbu7u7vby7y9u7u7u9vLvL27u7u728u8vbsbvbvby7y9uxuxu9vLvL27G7G728u8vbsbsbvby7y9u9uxu9vLvL27u7u728u8vbu7u7vbyw==",
        "mimeType": "image/x-mkcd-f4",
        "tilemapTile": true,
        "displayName": "myTile"
    },
    "tile3": {
        "data": "hwQQABAAAAC7y8zMzMzMzN29u7u7u7u7u9vd3d3d3d27u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u9sREbvbERG7GxHRuxsR0bu7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7vb3d3d3d3d3b27u7u7u7u7y8zMzMzMzA==",
        "mimeType": "image/x-mkcd-f4",
        "tilemapTile": true,
        "displayName": "myTile0"
    },
    "tile4": {
        "data": "hwQQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
        "mimeType": "image/x-mkcd-f4",
        "tilemapTile": true,
        "displayName": "myTile1"
    },
    "level": {
        "id": "level",
        "mimeType": "application/mkcd-tilemap",
        "data": "MTAxMDAwMTAwMDAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAxMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAxMDEwMTAxMDEwMTAxMDEwMTAxMDEwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMTAxMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAxMDIwMjAyMDEwMTAyMDIwMjAyMDIwMjAyMDIwMjAyMDEwMjAyMDIwMjAxMDIwMjAyMDIwMjAyMDIwMjAyMDIwMTAyMDIwMjAyMDEwMjAyMDIwMjAyMDIwMTAxMDEwMTAxMDIwMjAyMDEwMTAyMDIwMjAyMDIwMjAyMDIwMTAyMDIwMjAyMDEwMTAyMDIwMjAyMDIwMjAyMDIwMjAxMDIwMjAyMDEwMTAyMDIwMjAyMDIwMTAxMDEwMTAxMDEwMTAxMDEwMTAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDIwMjAyMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMA==",
        "tileset": [
            "myTiles.transparency16",
            "sprites.castle.tilePath5",
            "sprites.castle.tileGrass1"
        ],
        "displayName": "level"
    },
    "level1": {
        "id": "level1",
        "mimeType": "application/mkcd-tilemap",
        "data": "MTAwYTAwMDgwMDA4MDcwNzA3MDcwNzA3MDcwNzA3MDQwNzA3MDcwNzA3MDcwNzA3MDcwMTAyMDIwMjAyMDUwNzA3MDcwNzA3MDcwNzA3MDcwNDA3MDcwNzA3MDcwNzA3MDcwNzAxMDIwMjAyMDUwNzA3MDcwNzA3MDcwNzA3MDcwNDA2MDIwMjAyMDIwMjAyMDIwMjAzMDcwNzA3MDcwNzA3MDcwNzA3MDcyMDIyMjIyMjIyMjAyMjIyMjIyMjAwMDAwMDIyMjIyMjIyMDIyMjIyMjIyMjAyMDAwMDIyMjIyMjIyMDIwMDAwMDAwMDAwMjIyMjIyMjIyMg==",
        "tileset": [
            "myTiles.transparency16",
            "sprites.vehicle.roadTurn3",
            "sprites.vehicle.roadHorizontal",
            "sprites.vehicle.roadTurn4",
            "sprites.vehicle.roadVertical",
            "sprites.vehicle.roadTurn2",
            "myTiles.tile2",
            "sprites.castle.tilePath5",
            "myTiles.tile3"
        ],
        "displayName": "level1"
    },
    "*": {
        "mimeType": "image/x-mkcd-f4",
        "dataEncoding": "base64",
        "namespace": "myTiles"
    }
}
```
