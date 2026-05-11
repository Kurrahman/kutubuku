import { GameObjects, Physics } from "phaser";
import { Game } from "../constants/game";

export class Board extends GameObjects.Container {
    floors: Physics.Matter.Image[];

    addBoardGrid(scene: Phaser.Scene) {
        for (let i = 0; i < Game.GAME_COLUMNS; i += 1) {
            this.add(
                new GameObjects.Grid(
                    scene,
                    i * Game.GAME_GRID_SIZE,
                    0,
                    1 * Game.GAME_GRID_SIZE,
                    (Game.GAME_ROWS + (i % 2)) * Game.GAME_GRID_SIZE,
                    Game.GAME_GRID_SIZE,
                    Game.GAME_GRID_SIZE,
                    Game.GAME_GRID_COLOR,
                    1,
                    Game.GAME_GRID_OUTLINE_COLOR,
                ),
            );
        }
    }

    constructor(scene: Phaser.Scene, position: { x: number; y: number }) {
        // draw board and floors
        super(scene, position.x, position.y);
        this.addBoardGrid(scene);
        scene.add.existing(this);
        const bounds = this.getBounds();
        scene.matter.world.setBounds(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height,
        );
    }
}

