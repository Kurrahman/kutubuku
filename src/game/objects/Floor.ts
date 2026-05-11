import { GameObjects } from "phaser";

export class Floor extends GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, position: { x: number; y: number }) {
        super(scene, position.x, position.y, 64, 64, 0x000000);
        scene.matter.add.gameObject(this, {
            isStatic: true,
        });
    }
}

