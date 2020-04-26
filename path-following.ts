namespace scene {
    const PATH_FOLLOW_KEY = "A_STAR_PATH_FOLLOW";

    class PathFollowingSprite {
        public index: number;

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

                    if (!target) {
                        toRemove.push(pfs);
                        continue;
                    }

                    const { x, y, vx, vy } = sprite;
                    const pastTargetHorizontally = !vx || (vx < 0 && x <= target.x) || (vx > 0 && x >= target.x);
                    const pastTargetVertically = !vy || (vy < 0 && y <= target.y) || (vy > 0 && y >= target.y);

                    if (pastTargetVertically && pastTargetHorizontally) {
                        // target next index
                        pfs.index++;
                        const newTarget = path[pfs.index];

                        if (!newTarget) {
                            toRemove.push(pfs);
                        } else {
                            const angle = Math.atan2(x - newTarget.x, y - newTarget.y);
                            sprite.setVelocity(
                                Math.cos(angle) * speed,
                                Math.sin(angle) * speed
                            );
                        }
                    }
                }

                if (toRemove.length) {
                    game.currentScene().data[PATH_FOLLOW_KEY] = store.filter(el => toRemove.indexOf(el) !== -1);
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
    export function followPath(sprite: Sprite, path: tiles.Location[], speed?: number) {
        if (!sprite)
            return;

        init();
        const store = game.currentScene().data[PATH_FOLLOW_KEY] as PathFollowingSprite[];
        const previousEl = store.find(el => el.sprite === sprite);

        if (previousEl) {
            if (speed !== null && speed !== undefined) {
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
        } else if (path) {
            const start = path[0];

            if (start) {
                sprite.setVelocity(0, 0);
                game.currentScene().data[PATH_FOLLOW_KEY].push(
                    new PathFollowingSprite(
                        sprite,
                        path,
                        speed
                    )
                )
                start.place(sprite);
            }
        }
    }
}