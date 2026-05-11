import { GameObjects } from "phaser";
import { EventBus } from "../EventBus";
import { Game } from "../constants/game";

export class Spawner extends GameObjects.Rectangle {
    columnIndex: number;
    constructor(
        scene: Phaser.Scene,
        position: { x: number; y: number },
        columnIndex: number,
    ) {
        super(
            scene,
            position.x,
            position.y,
            Game.GAME_GRID_SIZE,
            Game.GAME_GRID_SIZE,
            0xff0000,
        );
        this.columnIndex = columnIndex % Game.GAME_COLUMNS;
        this.setInteractive();
        this.addListener("pointerdown", () => {
            EventBus.emit("tile-added", position);
        });
    }
}

