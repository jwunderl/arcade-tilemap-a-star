namespace scene {
    const PATH_FOLLOW_KEY = "A_STAR_PATH_FOLLOW";
    const PATH_COMPLETION_KEY = "A_STAR_PATH_COMPLETION_HANDLER";

    class PathFollowingSprite {
        public index: number;
        public onEndHandler: () => void;

        constructor (
            public sprite: Sprite,
            public path: tiles.Location[],
            public speed: number
        ) {
            this.index = 0;
        }
    }

    class PathCompletionEvent {
        constructor(
            public kind: number,
            public handler: (sprite: Sprite, location: tiles.Location) => void
        ) { }
    }

    function init() {
        if (!game.currentScene().data[PATH_FOLLOW_KEY]) {
            game.currentScene().data[PATH_FOLLOW_KEY] = [] as PathFollowingSprite[];
            game.currentScene().data[PATH_COMPLETION_KEY] = [] as PathCompletionEvent[];

            game.onUpdate(function () {
                const store = getPathFollowingSprites();
                const handlers = getPathCompletionEvents();

                for (let i = store.length - 1; i >= 0; i--)
                    // note we enumerate from the end so we can safely remove and push without changing
                    // the worklist
                {
                    const pfs = store[i]
                    const { sprite, index, path, speed } = pfs;
                    const target: tiles.Location = path[index];

                    const { x, y, vx, vy } = sprite;

                    const pastTargetHorizontally = !vx || (vx < 0 && x <= target.x) || (vx > 0 && x >= target.x);
                    const pastTargetVertically = !vy || (vy < 0 && y <= target.y) || (vy > 0 && y >= target.y);

                    if (pastTargetHorizontally && pastTargetVertically) {
                        // target next index
                        pfs.index++;
                        const newTarget = path[pfs.index];
                        if (!newTarget) {
                            sprite.setVelocity(0, 0);
                            target.place(sprite);
                            store.removeAt(i);
                            // explicit endCb overrides kind cb
                            if (pfs.onEndHandler) {
                                pfs.onEndHandler();
                            } else {
                                handlers.forEach(completionHandler => {
                                    if (completionHandler.kind === sprite.kind()) {
                                        completionHandler.handler(sprite, path[pfs.index - 1]);
                                    }
                                });
                            }
                        } else {
                            target.place(sprite);
                            setVelocityTowards(sprite, newTarget, speed);
                        }
                    }
                }
            });
        }
    }

    function setVelocityTowards(sprite: Sprite, target: tiles.Location, speed: number) {
        const dx = target.x - sprite.x;
        const dy = target.y - sprite.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        sprite.vx = (dx / dist) * speed;
        sprite.vy = (dy / dist) * speed;
    }

    // TODO: probably should have logic to bail when a tile that wasn't a wall
    //      is set to be a wall. Or just use velocity, and let enemy run into wall

    /**
     * Give a sprite a path to follow
     * @param sprite sprite to give a path to
     * @param path path to follow
     * @param speed speed at which to follow path eg: 50
     */
    //% block="sprite $sprite follow path $path || speed %speed"
    //% sprite.shadow="variables_get"
    //% sprite.defl="mySprite"
    //% path.shadow="variables_get"
    //% path.defl="locationTiles"
    //% help=github:arcade-tilemap-a-star/docs/follow-path
    //% group="Path Following" weight=9
    export function followPath(sprite: Sprite, path: tiles.Location[], speed: number = 50) {
        if (!sprite)
            return;
        if (!path || !path.length || !speed) {
            const pathFollowingSprites = getPathFollowingSprites();
            if (pathFollowingSprites) {
                for (let i = pathFollowingSprites.length - 1; i >= 0; i--) {
                    const pfs = pathFollowingSprites[i];
                    if (pfs.sprite === sprite) {
                        sprite.vx = 0;
                        sprite.vy = 0;
                        pathFollowingSprites.removeAt(i);
                    }
                }
            }
            return;
        }

        const tm = game.currentScene().tileMap;
        if (!tm)
            return;

        // are we in a wall?
        if (tm.isOnWall(sprite)) {
            // if so, find the closest path tile by distance and teleport there
            let nearestTile = path[0]
            let minDistSquared = 999999;
            for (let p of path) {
                const distSqrd = (p.x - sprite.x)**2 + (p.y - sprite.y)**2
                if (distSqrd < minDistSquared) {
                    nearestTile = p
                    minDistSquared = distSqrd
                }
            }
            nearestTile.place(sprite);
            const remainingPath = getRemainingPath(sprite, path);
            _followPath(sprite, remainingPath, speed);
            return
        }

        // if we're on the path already, just follow the subset of the remaining path
        const remainingPath = getRemainingPath(sprite, path);
        if (remainingPath) {
            _followPath(sprite, remainingPath, speed);
            return;
        }

        // otherwise, path with a-star (no heuristic and no onTileOf) to the path
        const currentLocation = locationOfSprite(sprite)
        const pathToNearest = generalAStar(tm, currentLocation, null, () => 0, tile => {
            for (let pathTile of path) {
                if (tile.col === pathTile.col && tile.row === pathTile.row) {
                    return true;
                }
            }
            return false;
        });

        _followPath(sprite, pathToNearest, speed, () => {
            // then follow the remaining of the path
            const remainingPath = getRemainingPath(sprite, path);
            _followPath(sprite, remainingPath, speed);
        })
    }

    /**
     * Returns true if the sprite is currently following a path,
     * and false otherwise
     * @param sprite sprite to check if following path
     */
    //% block="sprite $sprite is following a path"
    //% sprite.shadow="variables_get"
    //% sprite.defl="mySprite"
    //% help=github:arcade-tilemap-a-star/docs/sprite-is-following-path
    //% group="Path Following" weight=8
    export function spriteIsFollowingPath(sprite: Sprite): boolean {
        init();
        return getPathFollowingSprites().some(pfs => pfs.sprite === sprite);
    }

    /**
     * Returns an approximation between 0 and 100 of how much of the
     * percentage of the path that the given sprite is following has completed.
     * If the sprite is not currently following a path,
     * this returns 100 (as the sprite has trivially completed the empty path).
     */
    //% block="percent sprite $sprite path completion"
    //% sprite.shadow="variables_get"
    //% sprite.defl="mySprite"
    //% help=github:arcade-tilemap-a-star/docs/sprite-percent-path-completed
    //% group="Path Following" weight=7
    export function spritePercentPathCompleted(sprite: Sprite): number {
        init();
        const pfs = getPathFollowingSprites().find(pfs => pfs.sprite === sprite);
        // TODO: is this behavior useful, or should this return 0 or undefined?
        if (!pfs)
            return 100;
        return 100 - (100 * (pfs.path.length - pfs.index) / pfs.path.length);
    }

    /**
     * Event handler for when a sprite of the given kind completes a path
     */
    //% group="Overlaps"
    //% weight=100 draggableParameters="reporter"
    //% block="on $sprite of kind $kind completes path at $location"
    //% kind.shadow=spritekind
    //% help=github:arcade-tilemap-a-star/docs/on-path-completion
    //% group="Path Following" weight=6
    export function onPathCompletion(
        kind: number,
        handler: (sprite: Sprite, location: tiles.Location) => void
    ) {
        init();
        if (kind == null || !handler)
            return;
        getPathCompletionEvents().push(
            new PathCompletionEvent(kind, handler)
        );
    }

    export function teleportToAndFollowPath(sprite: Sprite, path: tiles.Location[], speed?: number) {
        _followPath(sprite, path, speed);
    }

    export function _followPath(sprite: Sprite, path: tiles.Location[], speed?: number, endCb?: () => void) {
        if (!sprite)
            return;

        init();
        const store = getPathFollowingSprites();
        const previousEl = store.find(el => el.sprite === sprite);

        const start = path && path[0];
        if (!start) {
            if (previousEl) {
                store.removeElement(previousEl);
            }
            return;
        }

        const pfs = previousEl || new PathFollowingSprite(
            sprite,
            path,
            speed || 50
        );
        if (previousEl) {
            if (speed)
                previousEl.speed = speed;
            previousEl.path = path;
            previousEl.index = 0;

            if (endCb) {
                previousEl.onEndHandler = endCb;
            }
        } else {
            pfs.onEndHandler = endCb;
            store.push(pfs);
        }

        setVelocityTowards(sprite, start, pfs.speed)
    }

    /**
     * Returns the index in the path which is closest to the current sprite by direct distance
     */
    export function getNearestPathIdx(sprite: Sprite, path: tiles.Location[]): number {
        let minDistSqrd = 99999
        let idx = 0;
        for (let i = 0; i < path.length; i++) {
            let t = path[i];
            let distSqrd = (sprite.x - t.x)**2 + (sprite.y - t.y)**2;
            if (distSqrd < minDistSqrd) {
                minDistSqrd = distSqrd;
                idx = i;
            }
        }
        return idx
    }

    function getPathFollowingSprites(): PathFollowingSprite[] {
        return game.currentScene().data[PATH_FOLLOW_KEY] as PathFollowingSprite[];
    }

    function getPathCompletionEvents(): PathCompletionEvent[] {
        return game.currentScene().data[PATH_COMPLETION_KEY] as PathCompletionEvent[];
    }

    function screenCoordinateToTile(value: number) {
        const tm = game.currentScene().tileMap;
        if (!tm) return value >> 4;
        return value >> tm.scale;
    }

    function locationOfSprite(s: Sprite): tiles.Location {
        return tiles.getTileLocation(screenCoordinateToTile(s.x), screenCoordinateToTile(s.y));
    }

    function getRemainingPath(sprite: Sprite, path: tiles.Location[]): tiles.Location[] | null {
        const currentLocation = locationOfSprite(sprite)
        for (let i = 0; i < path.length; i++) {
            const pathTile = path[i];
            if (currentLocation.x === pathTile.x && currentLocation.y === pathTile.y) {
                const remainingPath = i === 0 ? path : path.filter((_, j) => j >= i);
                return remainingPath;
            }
        }
        return null
    }
}