# a star

Get an array of tiles that form a path from **start** to **end**
that does not contain walls (and optionally is restrict to a given type of tile).

```sig
scene.aStar(null, null)
```

## Parameters

* **start**: A tile location to start at
* **end**: A tile location to end at
* **onTilesOf** (optional): a type of tile to restrict movement to, for example water or dirt.

## Returns

* an array of tile locations that form a path from **start** to **end**

## Example

Creates a path from the top left corner of the screen to the bottom right corner of the screen (`myPath`).
Prints out how many tiles are in that path.

```blocks
let myPath = scene.aStar(tiles.getTileLocation(0, 0), tiles.getTileLocation(9, 7))
console.log(myPath.length)
```

```package
arcade-tilemap-a-star=github:jwunderl/arcade-tilemap-a-star
```