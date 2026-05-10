import { GameObjects, Physics } from "phaser";
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
    letter: string;
    scoreMultiplier: number;
    score: number;

    constructor(
        scene: Phaser.Scene,
        position: { x: number; y: number },
        letter: string,
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
            new GameObjects.Text(scene, -16, -28, letter.toUpperCase(), {
                fontFamily: "Consolas",
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
            }),
        ]);
        this.letter = letter;
        this.scoreMultiplier = scoreMultiplier;
        this.score = letterScoreDict[letter];

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        if (this.body instanceof Physics.Arcade.Body) {
            this.body.pushable = false;
            this.body.setVelocityY(fallSpeed);
        }

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

    fall() {
        if (this.body instanceof Physics.Arcade.Body) {
            this.body.setVelocityY(fallSpeed);
        }
    }

    getAdjacentTiles(): Tile[] {
        const bodies = this.scene.physics
            .overlapCirc(
                this.getBounds().centerX,
                this.getBounds().centerY,
                tileSize,
                true,
                false,
            )
            .filter((body) => body.gameObject != this);
        return bodies.map((body) => body.gameObject as Tile);
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

