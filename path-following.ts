namespace scene {
    const PATH_FOLLOW_KEY = "A_STAR_PATH_FOLLOW";

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

    function init() {
        if (!game.currentScene().data[PATH_FOLLOW_KEY]) {
            game.currentScene().data[PATH_FOLLOW_KEY] = [] as PathFollowingSprite[];

            game.onUpdate(function () {
                const store: PathFollowingSprite[] = game.currentScene().data[PATH_FOLLOW_KEY];
                const toRemove: PathFollowingSprite[] = [];

                for (const pfs of store) {
                    const { sprite, index, path, speed } = pfs;
                    const target = path[index];

                    const { x, y, vx, vy } = sprite;
                    const pastTargetHorizontally = !vx || (vx < 0 && x <= target.x) || (vx > 0 && x >= target.x);
                    const pastTargetVertically = !vy || (vy < 0 && y <= target.y) || (vy > 0 && y >= target.y);

                    if (pastTargetVertically && pastTargetHorizontally) {
                        // target next index
                        pfs.index++;
                        const newTarget = path[pfs.index];
                        if (!newTarget) {
                            sprite.setVelocity(0, 0);
                            target.place(sprite);
                            toRemove.push(pfs);
                            if (pfs.onEndHandler) {
                                pfs.onEndHandler();
                            }
                        } else {
                            target.place(sprite);

                            const angle = Math.atan2(
                                newTarget.y - y,
                                newTarget.x - x
                            );

                            sprite.setVelocity(
                                Math.cos(angle) * speed,
                                Math.sin(angle) * speed
                            );
                        }
                    }
                }

                for (const el of toRemove) {
                    store.removeElement(el);
                }
            });
        }
    }

    // TODO: probably should have logic to bail when a tile that wasn't a wall
    //      is set to be a wall. Or just use velocity, and let enemy run into wall 
    // TODO: maybe logic for if path === previous path, or if we want to be fancy
    //      path  === remainder of previous path. that might be nice for if we recalculate
    //      optimal path mid path;if it's the same do nothing, otherwise start movement
    // TODO: maybe something better than just placing on tile when sprite position
    //      is not he same as tile position

    /**
     * @param sprite sprite to give a path to
     * @param path path to follow
     * @param speed speed at which to follow path eg: 50
     */
    //% block="sprite $sprite follow path $path || speed %speed"
    //% sprite.shadow="variables_get"
    //% sprite.defl="mySprite"
    //% path.shadow="variables_get"
    //% path.defl="locationTiles"
    //% group="Tiles" weight=9
    export function followPath(sprite: Sprite, path: tiles.Location[], speed?: number) {
        _followPath(sprite, path, speed);
    }

    export function _followPath(sprite: Sprite, path: tiles.Location[], speed?: number, endCb?: () => void) {
        if (!sprite)
            return;

        init();
        const store = game.currentScene().data[PATH_FOLLOW_KEY] as PathFollowingSprite[];
        const previousEl = store.find(el => el.sprite === sprite);

        if (previousEl) {
            if (speed) {
                previousEl.speed = speed;
            }

            const start = path && path[0];
            if (!start) {
                store.removeElement(previousEl);
                return;
            }

            start.place(sprite);
            previousEl.path = path;
            previousEl.index = 0;

            if (previousEl.onEndHandler)
                previousEl.onEndHandler = endCb;
        } else if (path) {
            const start = path[0];

            if (start) {
                sprite.setVelocity(0, 0);
                const pfs = new PathFollowingSprite(
                    sprite,
                    path,
                    speed || 50
                );
                pfs.onEndHandler = endCb;
                store.push(pfs);
                start.place(sprite);
            }
        }
    }
}