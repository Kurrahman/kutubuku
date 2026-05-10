import { GameObjects, Physics, Math } from "phaser";
import { EventBus } from "../EventBus";
import { Tile } from "./Tile";

const gridSize = 64;
const gridColor = 0xfca103;
const outlineColor = 0xcc8202;
export class Board extends GameObjects.Container {
    floors: Physics.Arcade.StaticGroup;
    spawners: GameObjects.Ellipse[];
    board: Tile[][] = [[], [], [], [], [], [], []];

    addBoardGrid(scene: Phaser.Scene) {
        for (let i = 0; i < 7; i += 1) {
            this.add(
                new GameObjects.Grid(
                    scene,
                    i * gridSize,
                    0,
                    1 * gridSize,
                    (7 + (i % 2)) * gridSize,
                    gridSize,
                    gridSize,
                    gridColor,
                    1,
                    outlineColor,
                ),
            );
        }
    }

    addBoardFloors(scene: Phaser.Scene) {
        let xPos = this.getBounds().left + gridSize / 2;
        let yPos = this.getBounds().bottom - 16;
        let width = this.getBounds().width / 7;
        this.floors = scene.physics.add.staticGroup();
        for (let i = 0; i < 7; i += 1) {
            this.floors
                .create(xPos, yPos + ((i % 2) * gridSize) / 2)
                .setVisible(false);
            xPos += width;
        }
    }

    addSpawner(scene: Phaser.Scene) {
        let xPos = 0;
        let yPos = -this.getBounds().height / 2;
        console.log(this.getBounds());
        let width = this.getBounds().width / 7;
        this.spawners = [];
        for (let i = 0; i < 7; i += 1) {
            let spawner = new GameObjects.Ellipse(
                scene,
                xPos,
                yPos - ((i % 2) * gridSize) / 2,
                gridSize / 2,
                gridSize / 2,
                0xff0000,
            ).setInteractive();
            spawner.addListener("pointerdown", () => {
                this.addTile(
                    i % 7,
                    String.fromCharCode(Math.RND.integerInRange(65, 90)),
                );
            });
            this.spawners.push(spawner);
            this.add(spawner);
            xPos += width;
        }
    }

    constructor(scene: Phaser.Scene, position: { x: number; y: number }) {
        // draw board and floors
        super(scene, position.x, position.y);
        this.addBoardGrid(scene);
        this.addBoardFloors(scene);
        this.addSpawner(scene);
        scene.add.existing(this);

        // add listeners
        EventBus.on("tile-removed", () => {
            this.removeTile();
        });
    }

    addTile(columnIndex: number, letter: string, scoreMultiplier = 1) {
        if (this.board[columnIndex].length >= 7 + (columnIndex % 2)) return;
        const tile = new Tile(
            this.scene,
            {
                x: gridSize * columnIndex,
                y: -this.getBounds().height / 2,
            },
            letter,
            scoreMultiplier,
        ).setInteractive();
        this.scene.physics.add.collider(tile, this.floors);
        this.scene.physics.add.collider(
            tile,
            this.board[columnIndex],
            (body1, body2) => {
                if (body1 instanceof Physics.Arcade.Body) {
                    this.stopTileOnCollision(body1);
                }
                if (body2 instanceof Physics.Arcade.Body) {
                    this.stopTileOnCollision(body2);
                }
            },
        );
        this.add(tile);
        this.board[columnIndex].push(tile);
    }

    removeTile() {
        // remove tile
        this.board.forEach((column) => {
            let index = 0;
            while (index < column.length) {
                if (column[index].isDestroyed) {
                    column.splice(index, 1);
                } else {
                    index++;
                }
            }
        });

        // make all tiles fall
        this.board.forEach((column) => {
            column.forEach((tile) => {
                tile.fall();
            });
        });
    }

    stopTileOnCollision(body: Physics.Arcade.Body) {
        body.stop();
    }
}

