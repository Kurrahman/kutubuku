import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

import { Board } from "../objects/Board";
import { Spawner } from "../objects/Spawner";
import { Game } from "../constants/game";
import { Floor } from "../objects/Floor";
import { Tile } from "../objects/Tile";
export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;
    board: Board;
    spawners: Spawner[];
    floors: Floor[];
    flag: boolean = false;

    constructor() {
        super("MainMenu");
    }

    setUpScene() {
        this.background = this.add.image(0, 10, "background").setOrigin(0, 0);
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
    }

    placeSpawners(position: { x: number; y: number }) {
        this.spawners = [];
        for (let i = 0; i < Game.GAME_COLUMNS; i += 1) {
            const posX = position.x + i * Game.GAME_GRID_SIZE;
            const posY =
                this.board.getBounds().top -
                ((i % 2) * Game.GAME_GRID_SIZE) / 2 +
                32;
            let spawner = new Spawner(
                this,
                {
                    x: posX,
                    y: posY,
                },
                i,
            );
            this.spawners.push(spawner);
            this.add.existing(spawner);
            this.matter.add.gameObject(spawner, {
                isSensor: true,
                isStatic: true,
            });

            // this.matter.world.on("collisionend", (event, bodyA, bodyB) => {
            //     console.log(event, bodyA, bodyB);
            //     if (this.flag) return;
            //     this.spawnTile({ x: posX, y: posY });
            //     this.flag = true;
            // });
        }
    }

    placeFloors(position: { x: number; y: number }) {
        let xPos = position.x;
        let yPos = this.board.getBounds().bottom;
        let width = Game.GAME_GRID_SIZE;
        this.floors = [];
        for (let i = 0; i < Game.GAME_COLUMNS; i += 1) {
            let floor = new Floor(this, {
                x: xPos,
                y: yPos + ((i % 2) * Game.GAME_GRID_SIZE) / 2,
            });
            this.add.existing(floor);
            this.floors.push(floor);
            this.matter.add.gameObject(floor, {
                isStatic: true,
                collisionGroup: 1,
            });
            xPos += width;
        }
    }

    drawBoard(position: { x: number; y: number }) {
        this.board = new Board(this, position);
    }

    spawnTile(position: { x: number; y: number }) {
        const tile = new Tile(this, position);
        this.add.existing(tile);
        this.matter.add.gameObject(tile, {
            slop: 0,
            restitution: 0,
            friction: 0,
            bounce: 0,
            density: 999,
        });
    }

    create() {
        const boardPosition = {
            x: 512,
            y: 400,
        };
        this.setUpScene();
        this.drawBoard(boardPosition);
        this.placeSpawners(boardPosition);
        this.placeFloors(boardPosition);
        EventBus.emit("current-scene-ready", this);

        EventBus.on("tile-added", (position: { x: number; y: number }) => {
            this.spawnTile(position);
        });
    }

    changeScene() {
        this.scene.start("Game");
    }
}

