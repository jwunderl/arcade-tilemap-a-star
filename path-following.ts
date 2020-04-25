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
                const store = game.currentScene().data[PATH_FOLLOW_KEY] as PathFollowingSprite[];
                // foreach following sprite
                // continually move linearly from index to index + 1
                // if index + 1 === store.length, remove that one at the end
            });
        }
    }

    // TODO: probably should have logic to bail when a tile that wasn't a wall
    //      is set to be a wall.
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

            if (!path) {
                store.removeElement(previousEl);
                return;
            }

            const start = path[0];
            start && start.place(sprite);

            previousEl.path = path;
            previousEl.index = 0;
        } else if (path) {
            game.currentScene().data[PATH_FOLLOW_KEY].push(
                new PathFollowingSprite(
                    sprite,
                    path,
                    speed
                )
            )
            const start = path[0];
            start && start.place(sprite);
        }
    }
}