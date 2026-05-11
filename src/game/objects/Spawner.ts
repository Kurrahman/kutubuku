import { GameObjects } from "phaser";
import { EventBus } from "../EventBus";
import { Game } from "../constants/game";

export class Spawner extends GameObjects.Rectangle {
    columnIndex: number;
    position: { x: number; y: number };
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
        this.position = position;
        this.setInteractive();
        this.addListener("pointerdown", () => {
            EventBus.emit("tile-added", position);
        });
        this.scene.matter.world.on("collisionend", () => {
            if (this.hasEmptySpot()) {
                EventBus.emit("tile-added", position);
            }
        });
    }

    hasEmptySpot(): boolean {
        const bodies = this.scene.matter.world
            .getAllBodies()
            .filter(
                (body) =>
                    !body.isStatic &&
                    body.bounds.max.x === this.getBounds().right,
            );
        const neighbors = this.scene.matter.query.region(bodies, {
            max: {
                x: this.getBounds().centerX + 5,
                y: this.getBounds().centerY + Game.GAME_GRID_SIZE,
            },
            min: {
                x: this.getBounds().centerX - 5,
                y: this.getBounds().top,
            },
        });
        return neighbors.length === 0;
    }
}

