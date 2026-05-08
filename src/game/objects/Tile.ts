import { GameObjects } from "phaser";

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
            new GameObjects.Rectangle(scene, 0, 0, 64, 64, 0x00ff00),
            new GameObjects.Text(scene, -16, -32, letter, {
                fontFamily: "Times New Roman",
                fontSize: 50,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
            }),
        ]);
        this.letter = letter;
        this.scoreMultiplier = scoreMultiplier;
        this.score = letterScoreDict[letter];
        scene.add.existing(this);
    }

    addedToScene() {
        super.addedToScene();
    }

    removedFromScene() {
        super.removedFromScene();
    }
}

