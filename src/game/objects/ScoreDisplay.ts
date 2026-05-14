import { GameObjects } from "phaser";
import { EventBus } from "../EventBus";

export class ScoreDisplay extends GameObjects.Text {
    score: number = 0;
    constructor(
        scene: Phaser.Scene,
        position: { x: number; y: number },
        text: number = 0,
        style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: "Consolas",
            fontSize: 32,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
        },
    ) {
        super(scene, position.x, position.y, text.toString(), style);
        EventBus.on("word-submitted", (addedScore: number) => {
            this.addScore(addedScore);
        });
    }

    setWord(word: string) {
        this.setText(word);
    }

    setScore(score: number) {
        this.score = score;
        this.setText(score.toString());
    }

    addScore(score: number) {
        this.score += score;
        this.setText(this.score.toString());
    }
}

