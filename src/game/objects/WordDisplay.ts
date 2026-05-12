import { GameObjects } from "phaser";
import { Tile } from "./Tile";

export class WordDisplay extends GameObjects.Container {
    text: GameObjects.Text;
    constructor(scene: Phaser.Scene, position: { x: number; y: number }) {
        super(scene, position.x, position.y);
        this.add(
            new GameObjects.Rectangle(
                scene,
                0,
                0,
                250,
                64,
                0xffffff,
            ).setStrokeStyle(8, 0x000000),
        );
        this.text = new GameObjects.Text(scene, 0, 0, "", {
            fontFamily: "Consolas",
            fontSize: 32,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
            align: "center",
        }).setOrigin(0.5);
        this.add(this.text);
    }

    setWord(word: string) {
        this.text.setText(word);
    }

    setWordFromTiles(tiles: Tile[]) {
        const word = tiles.map((tile) => tile.letter).join("");
        this.setWord(word);
    }
}

