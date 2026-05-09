import { GameObjects, Physics } from "phaser";
import { EventBus } from "../EventBus";
import { Tile } from "./Tile";

const gridSize = 64;
const gridColor = 0xfca103;
const outlineColor = 0xcc8202;
export class Board extends GameObjects.Container {
    columnsBbox: Phaser.Geom.Rectangle[];
    columns: GameObjects.Grid[];
    floors: Physics.Arcade.StaticGroup;
    board: Tile[][] = [[], [], [], [], [], [], []];
    constructor(scene: Phaser.Scene, position: { x: number; y: number }) {
        // prepare columns
        let columns = [];
        for (let i = 0; i < 7; i += 1) {
            columns.push(
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

        // draw board
        super(scene, position.x, position.y, columns);
        this.columns = columns;
        this.columnsBbox = columns.map((column) => column.getBounds());
        this.floors = scene.physics.add.staticGroup();
        this.columnsBbox.forEach((bbox: Phaser.Geom.Rectangle) => {
            this.floors
                .create(bbox.centerX, bbox.bottom + 16)
                .setVisible(false);
        });
        scene.add.existing(this);

        // add listeners
        EventBus.on("tile-removed", () => {
            this.removeTile();
        });
    }

    addTile(columnIndex: number, letter: string, scoreMultiplier = 1) {
        const column = this.columnsBbox[columnIndex];
        const tile = new Tile(
            this.scene,
            {
                x: gridSize * columnIndex,
                y: -column.height / 2,
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

