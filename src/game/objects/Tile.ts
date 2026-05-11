import { GameObjects, Math } from "phaser";
import { EventBus } from "../EventBus";

const letterScoreDict: Record<string, number> = Object.freeze({
    a: 1,
    b: 3,
    c: 3,
    d: 2,
    e: 1,
    f: 4,
    g: 2,
    h: 4,
    i: 1,
    j: 8,
    k: 5,
    l: 1,
    m: 3,
    n: 1,
    o: 1,
    p: 3,
    q: 10,
    r: 1,
    s: 1,
    t: 1,
    u: 1,
    v: 4,
    w: 4,
    x: 8,
    y: 4,
    z: 10,
});

const tileSize = 64;
const fallSpeed = 1000;

export class Tile extends GameObjects.Container {
    letter: string = "";
    scoreMultiplier: number;
    score: number;

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
            ),
        ]);
        this.assignLetter();
        this.scoreMultiplier = scoreMultiplier;

        this.scene.add.existing(this);

        this.setSize(tileSize, tileSize);
        this.setInteractive();

        this.on("pointerdown", () => {
            this.destroy();
            EventBus.emit("tile-removed", this);
        });

        this.on("pointerover", () => {
            const adjacentTiles = this.getAdjacentTiles();
            for (const tile of adjacentTiles) {
                // debugging needs
                tile.setTileColor(0x000000);
            }
        });

        this.on("pointerout", () => {
            const adjacentTiles = this.getAdjacentTiles();
            for (const tile of adjacentTiles) {
                // debugging needs
                tile.setTileColor(0xf5ad42);
            }
        });
    }

    addedToScene() {
        super.addedToScene();
    }

    removedFromScene() {
        super.removedFromScene();
    }

    generateRandomLetter(): string {
        return String.fromCharCode(
            Math.RND.integerInRange(65, 90),
        ).toUpperCase();
    }

    assignLetter() {
        this.letter = this.generateRandomLetter();
        this.score = letterScoreDict[this.letter];
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
}

