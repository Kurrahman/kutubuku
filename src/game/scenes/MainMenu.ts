import { GameObjects, Math, Scene } from "phaser";

import { EventBus } from "../EventBus";

import { Board } from "../objects/Board";
export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    board: Board;

    constructor() {
        super("MainMenu");
    }

    dropNewTile(columnIndex: number) {
        this.board.addTile(
            columnIndex,
            String.fromCharCode(Math.RND.integerInRange(65, 90)),
        );
        console.log(this.board.board[columnIndex]);
    }

    create() {
        this.background = this.add.image(512, 384, "background");

        this.title = this.add
            .text(512, 50, "Kutu Buku", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.board = new Board(this, { x: 512, y: 400 });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Game");
    }
}

