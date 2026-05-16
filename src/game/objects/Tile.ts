import { GameObjects, Math } from "phaser";
import { EventBus } from "../EventBus";
import { Dictionary } from "../Dictionary";
import { TileScore } from "../constants/tileScore";

const tileSize = 64;

export class Tile extends GameObjects.Container {
    static letterBucket: string[] = [];
    letter: string = "";
    scoreMultiplier: number;
    score: number;
    selected: boolean = false;

    constructor(
        scene: Phaser.Scene,
        position: { x: number; y: number },
        scoreMultiplier = 1,
    ) {
        super(scene, position.x, position.y, [
            new GameObjects.Rectangle(
                scene,
                0,
                0,
                tileSize,
                tileSize,
                0xf5ad42,
            ).setStrokeStyle(2, 0x000000),
        ]);
        if (Tile.letterBucket.length < 1) Tile.prepareLookup();
        this.assignLetter();
        this.scoreMultiplier = scoreMultiplier;

        this.scene.add.existing(this);

        this.setSize(tileSize, tileSize);
        this.setInteractive();

        this.on("pointerdown", () => {
            if (this.body?.velocity.y && this.body.velocity.y > 0.1) {
                // ignore inputs on moving tiles
                return;
            }
            if (this.selected) {
                EventBus.emit("tile-unselected", this);
            } else {
                EventBus.emit("tile-selected", this);
            }
        });
    }

    static prepareLookup() {
        for (let i = 97; i <= 122; i++) {
            const weight = Dictionary.getLetterDistribution(
                String.fromCharCode(i),
            );
            if (weight) {
                for (let j = 0; j < weight; j++) {
                    Tile.letterBucket.push(String.fromCharCode(i));
                }
            }
        }
    }

    addedToScene() {
        super.addedToScene();
    }

    removedFromScene() {
        super.removedFromScene();
    }

    generateRandomLetter(): string {
        return Math.RND.pick(Tile.letterBucket);
    }

    assignLetter() {
        this.letter = this.generateRandomLetter();
        this.score = TileScore[this.letter];
        this.add(
            new GameObjects.Text(this.scene, -16, -28, this.letter, {
                fontFamily: "Consolas",
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
            }),
        );
    }

    getAdjacentTiles(): Tile[] {
        const bodies = this.scene.matter.world
            .getAllBodies()
            .filter((body) => body.gameObject != this && !body.isStatic);

        const neighbors = this.scene.matter.query.region(bodies, {
            max: {
                x: this.getBounds().right,
                y: this.getBounds().bottom,
            },
            min: {
                x: this.getBounds().left,
                y: this.getBounds().top,
            },
        });
        return neighbors.map((body) => body.gameObject as Tile);
    }

    setTileColor(color: number) {
        const tileBase = this.list.find(
            (child) => child instanceof GameObjects.Rectangle,
        );
        if (tileBase) {
            tileBase.setFillStyle(color);
        }
    }

    setSelected(selected: boolean) {
        this.selected = selected;
        this.setTileColor(selected ? 0x00ff00 : 0xf5ad42);
    }
}

