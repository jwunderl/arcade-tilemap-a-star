# on Path Completion

Set code to run when a sprite of the given kind has finished following it's path.

```sig
scene.onPathCompletion(null, null)
```

## Parameters

* **kind**: A kind of sprite to register an event for.
* **handler**: The code to run when a sprite finishes it's path.
>* **sprite**: The sprite that has completed it's Path.
>* **location**: The location at which the sprite has completed it's path.

## Example

Creates an event so  when an enemy finishes it's path, the game end

```blocks
scene.onPathCompletion(SpriteKind.Enemy, function (sprite, location) {
	game.over(false);
})
```

Creates an event so that a food sprite is destroyed and the location becomes a wall
when a path is completed.

```blocks
scene.onPathCompletion(SpriteKind.Food, function (sprite, location) {
	sprite.destroy(effects.trail, 500)
	tiles.setWallAt(location, true)
})
```

```package
arcade-tilemap-a-star=github:jwunderl/arcade-tilemap-a-star
```