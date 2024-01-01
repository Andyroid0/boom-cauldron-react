import Dungeon, { Room } from "@mikewesthad/dungeon";
import {
  Cameras,
  GameObjects,
  Scene,
  Tilemaps,
  Types,
  // Math as PMath,
} from "phaser";
import * as dat from "dat.gui";
import EasyStar from "easystarjs";
import EnemyManager from "../../managers/EnemyManager";

import useStateStore from "../../context/useStateStore";

import { TILES } from "./tiles.data";

const { debug, showCamGUI } = useStateStore.getState();

class DungeonScene extends Scene {
  activeRoom: Room | null = null;
  dungeon: Dungeon | null = null;
  map: Tilemaps.Tilemap | null = null;
  player: GameObjects.Graphics | null = null;
  enemy: GameObjects.Graphics | null = null;
  cursors: Types.Input.Keyboard.CursorKeys | undefined;
  cam: Cameras.Scene2D.Camera | null = null;
  layer: Tilemaps.TilemapLayer | null = null;
  layer2: Tilemaps.TilemapLayer | null = null;
  lastMoveTime = 0;
  // eslint-disable-next-line @babel/new-cap
  easystar: EasyStar.js = new EasyStar.js();
  paused: boolean = useStateStore.getState().paused;

  constructor() {
    super("dungeon");
    const handleEvent = (event: MessageEvent) => {
      if (event.data === "toggle-pause") {
        this.paused = !this.paused;
      }
    };
    window.addEventListener("message", handleEvent);
  }

  preload() {
    this.load.image("tiles", "img/tilemap_packed.png");
  }

  create() {
    this.input.keyboard?.on("keydown-ENTER", () =>
      window.postMessage("toggle-pause"),
    );
    //  40,000 tile test
    this.dungeon = new Dungeon({
      width: 200,
      height: 200,
      rooms: {
        width: { min: 7, max: 20, onlyOdd: true },
        height: { min: 7, max: 20, onlyOdd: true },
      },
    });

    // Creating a blank tilemap with dimensions matching the dungeon
    const tileMapConfig: Types.Tilemaps.TilemapConfig = {
      tileWidth: 16,
      tileHeight: 16,
      width: this.dungeon.width,
      height: this.dungeon.height,
    };
    this.map = this.make.tilemap(tileMapConfig);

    const tileset: Tilemaps.Tileset = this.map.addTilesetImage(
      "tiles",
      "tiles",
      16,
      16,
      0,
      0,
      0,
      { x: 0, y: 0 },
    ) as Tilemaps.Tileset;

    this.layer = this.map.createBlankLayer("Layer 1", tileset);
    // this.layer2 = this.map.createBlankLayer("Layer 2", tileset);

    if (!this.layer) {
      console.error("layer is null or undefined.");
      return;
    }

    if (!debug) {
      this.layer.setScale(3);
    }

    // Fill with black tiles
    this.layer.fill(48);

    // Use the array of rooms generated to place tiles in the map
    this.dungeon.rooms.forEach((room) => {
      if (!this.map || !this.layer) return;
      const x = room.x;
      const y = room.y;
      const width = room.width;
      const height = room.height;
      const cx = Math.floor(x + width / 2);
      const cy = Math.floor(y + height / 2);
      const left = x;
      const right = x + (width - 1);
      const top = y;
      const bottom = y + (height - 1);

      // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
      // See "Weighted Randomize" example for more information on how to use weightedRandomize.
      this.map.weightedRandomize(TILES.FLOOR, x, y, width, height);

      // Place the room corners tiles
      this.map.putTileAt(TILES.TOP_LEFT_WALL, left, top);
      this.map.putTileAt(TILES.TOP_RIGHT_WALL, right, top);
      this.map.putTileAt(TILES.BOTTOM_RIGHT_WALL, right, bottom);
      this.map.putTileAt(TILES.BOTTOM_LEFT_WALL, left, bottom);

      // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
      this.map.weightedRandomize(TILES.TOP_WALL, left + 1, top, width - 2, 1);
      this.map.weightedRandomize(
        TILES.BOTTOM_WALL,
        left + 1,
        bottom,
        width - 2,
        1,
      );
      this.map.weightedRandomize(TILES.LEFT_WALL, left, top + 1, 1, height - 2);
      this.map.weightedRandomize(
        TILES.RIGHT_WALL,
        right,
        top + 1,
        1,
        height - 2,
      );

      // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the rooms location
      const doors = room.getDoorLocations();

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < doors.length; i++) {
        this.map.putTileAt(0, x + doors[i].x, y + doors[i].y);
      }

      // Place some random stuff in rooms occasionally
      const rand = Math.random();
      if (rand <= 0.25) {
        // Chest
        this.layer2?.putTileAt(89, cx, cy);
      } else if (rand <= 0.3) {
        // Stairs
        this.layer2?.putTileAt(85, cx, cy);
      }
      // else if (rand <= 0.4) {
      //   // Trap door
      //   this.layer.putTileAt(167, cx, cy);
      // }
      // else if (rand <= 0.6) {
      //   if (room.height >= 9) {
      //     // We have room for 4 towers
      //     this.layer.putTilesAt([[186], [205]], cx - 1, cy + 1);

      //     this.layer.putTilesAt([[186], [205]], cx + 1, cy + 1);

      //     this.layer.putTilesAt([[186], [205]], cx - 1, cy - 2);

      //     this.layer.putTilesAt([[186], [205]], cx + 1, cy - 2);
      //   } else {
      //     this.layer.putTilesAt([[186], [205]], cx - 1, cy - 1);

      //     this.layer.putTilesAt([[186], [205]], cx + 1, cy - 1);
      //   }
      // }
    }, this);

    const excludeFromCollision = [0, 48, 49];
    this.layer.setCollisionByExclusion(excludeFromCollision);

    // Hide all the rooms
    if (!debug) {
      this.layer.forEachTile((tile) => {
        tile.alpha = 0;
      });
    }

    // Place the player in the first room
    const playerRoom = this.dungeon.rooms[0];

    this.player = this.add
      .graphics({ fillStyle: { color: 0xedca40, alpha: 1 } })
      .fillRect(
        0,
        0,
        this.map.tileWidth * this.layer.scaleX,
        this.map.tileHeight * this.layer.scaleY,
      );

    this.enemy = this.add
      .graphics({ fillStyle: { color: 11141120, alpha: 1 } })
      .fillRect(
        0,
        0,
        this.map.tileWidth * this.layer.scaleX,
        this.map.tileHeight * this.layer.scaleY,
      );

    this.player.x = this.map.tileToWorldX(playerRoom.x + 1) as number;
    this.player.y = this.map.tileToWorldY(playerRoom.y + 1) as number;

    this.enemy.x = this.map.tileToWorldX(playerRoom.x + 3) as number;
    this.enemy.y = this.map.tileToWorldY(playerRoom.y + 3) as number;

    const easyStarGrid = (): number[][] => {
      const grid: number[][] = [];
      this.map!.layers[0].data.forEach((row) => {
        const newRow: number[] = [];
        row.forEach((tile) => {
          if (tile.collides) newRow.push(1);
          else newRow.push(0);
        });
        grid.push(newRow);
      });
      return grid;
    };
    
    this.easystar.setGrid(easyStarGrid());
    this.easystar.setAcceptableTiles([0]);
    // this.easystar.findPath(
    //   this.map.worldToTileX(this.enemy.x) as number,
    //   this.map.worldToTileY(this.enemy.y) as number,
    //   this.map.worldToTileX(this.player.x) as number,
    //   this.map.worldToTileY(this.player.y) as number,
    //   (path) => {
    //     if (path) this.enemy?.moveTo(path[0].x, path[0].y);
    //   },
    // );
    // this.easystar.calculate();

    if (!debug) {
      // Make the starting room visible
      this.setRoomAlpha(playerRoom, 1, this.map);
    }

    // Scroll to the player
    this.cam = this.cameras.main;

    this.cam.setBounds(
      0,
      0,
      this.layer.width * this.layer.scaleX,
      this.layer.height * this.layer.scaleY,
    );
    this.cam.scrollX = this.player.x - this.cam.width * 0.5;
    this.cam.scrollY = this.player.y - this.cam.height * 0.5;

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else console.warn("Keyboard isn't present.");

    // const textStyle: Types.GameObjects.Text.TextStyle = {
    //   fontSize: "18px",
    //   padding: { x: 10, y: 5 },
    //   color: "#ffffff",
    //   backgroundColor: "#000000",
    //   fontFamily: "Mana",
    // };

    // const help = this.add.text(16, 16, "Arrows keys to move", textStyle);

    // help.setScrollFactor(0);

    if (showCamGUI) {
      const gui = new dat.GUI();

      gui.addFolder("Camera");
      gui.add(this.cam, "scrollX").listen();
      gui.add(this.cam, "scrollY").listen();
      gui.add(this.cam, "zoom", 0.1, 4).step(0.1);
      gui.add(this.layer, "skipCull").listen();
      gui.add(this.layer, "cullPaddingX").step(1);
      gui.add(this.layer, "cullPaddingY").step(1);
      gui.add(this.layer, "tilesDrawn").listen();
      gui.add(this.layer, "tilesTotal").listen();
    }

    this.cam.startFollow(this.player, true, 0.1, 0.1);
  }

  update(time: number, delta: number) {
    if (this.paused) return;

    // Maybe set a loading screen here?
    if (!this.map || !this.player || !this.dungeon || !this.cam) return;

    this.updatePlayerMovement(time);
    this.updateEnemyMovement(time);

    const playerTileX: number = this.map.worldToTileX(this.player.x) as number;
    const playerTileY: number = this.map.worldToTileY(this.player.y) as number;

    // Another helper method from the dungeon - dungeon XY (in tiles) -> room
    const room = this.dungeon.getRoomAt(playerTileX, playerTileY);

    // If the player has entered a new room, make it visible and dim the last room
    if (!debug && room && this.activeRoom && this.layer && this.map) {
      if (this.activeRoom !== room) {
        this.setRoomAlpha(room, 1, this.map);
        const duration = 120;
        const tweenConfig: Types.Tweens.TweenBuilderConfig = {
          targets: this.layer.getTilesWithin(
            this.activeRoom.x,
            this.activeRoom.y,
            this.activeRoom.width,
            this.activeRoom.height,
          ),
          alpha: 0,
          duration,
          ease: "EaseOut",
          repeat: 0,
          yoyo: false,
          onUpdate: (tween, target) => {
            const newAlpha = tween.getValue();
            target.alpha = newAlpha;
          },
        };
        this.tweens.add(tweenConfig);
      }
    }

    this.activeRoom = room;
  }

  // Helpers functions
  setRoomAlpha(room: Room, easeAlpha: number, map: Tilemaps.Tilemap) {
    map.forEachTile(
      (tile) => {
        tile.alpha = easeAlpha;
      },
      this,
      room.x,
      room.y,
      room.width,
      room.height,
    );
  }

  getRoomAlpha(room: Room, layer: Tilemaps.TilemapLayer) {
    const tiles = layer.getTilesWithin(room.x, room.y, room.width, room.height);
    return tiles[0].alpha;
  }

  isTileOpenAt(worldX: number, worldY: number, map: Tilemaps.Tilemap) {
    // nonNull = true, don't return null for empty tiles. This means null will be returned only for
    // tiles outside of the bounds of the map.
    const tile = map.getTileAtWorldXY(worldX, worldY, true);

    if (tile && !tile.collides) {
      return true;
    } else {
      return false;
    }
  }

  updatePlayerMovement(time: number) {
    if (!this.map || !this.layer || !this.player || !this.cursors) return;

    const tw = this.map.tileWidth * this.layer.scaleX;
    const th = this.map.tileHeight * this.layer.scaleY;
    const repeatMoveDelay = 160;

    if (time > this.lastMoveTime + repeatMoveDelay) {
      if (this.cursors.down.isDown) {
        if (this.isTileOpenAt(this.player.x, this.player.y + th, this.map)) {
          const tweenConfig: Types.Tweens.TweenBuilderConfig = {
            targets: this.player,
            y: this.player.y + th,
            duration: 100,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
          };
          this.tweens.add(tweenConfig);
          this.lastMoveTime = time;
        }
      } else if (this.cursors.up.isDown) {
        if (this.isTileOpenAt(this.player.x, this.player.y - th, this.map)) {
          const tweenConfig: Types.Tweens.TweenBuilderConfig = {
            targets: this.player,
            y: this.player.y - th,
            duration: 100,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
          };
          this.tweens.add(tweenConfig);
          this.lastMoveTime = time;
        }
      }

      if (this.cursors.left.isDown) {
        if (this.isTileOpenAt(this.player.x - tw, this.player.y, this.map)) {
          const tweenConfig: Types.Tweens.TweenBuilderConfig = {
            targets: this.player,
            x: this.player.x - tw,
            duration: 100,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
          };
          this.tweens.add(tweenConfig);
          this.lastMoveTime = time;
        }
      } else if (this.cursors.right.isDown) {
        if (this.isTileOpenAt(this.player.x + tw, this.player.y, this.map)) {
          const tweenConfig: Types.Tweens.TweenBuilderConfig = {
            targets: this.player,
            x: this.player.x + tw,
            duration: 100,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
          };
          this.tweens.add(tweenConfig);
          this.lastMoveTime = time;
        }
      }
    }
  }

  updateEnemyMovement(time: number) {
    if (!this.map || !this.layer || !this.player || !this.enemy) return;

    if (!this.tweens.isTweening(this.enemy)) {
      this.easystar.findPath(
        this.map.worldToTileX(this.enemy.x) as number,
        this.map.worldToTileY(this.enemy.y) as number,
        this.map.worldToTileX(this.player.x) as number,
        this.map.worldToTileY(this.player.y) as number,
        (path) => {
          if (path) {
            const tweenConfig: Types.Tweens.TweenBuilderConfig = {
              targets: this.enemy,
              y: path[0].y,
              x: path[0].x,
              duration: 100,
              ease: "Linear",
              repeat: 0,
              yoyo: false,
            };
            this.tweens.add(tweenConfig);
          }
          // else console.log("no path found");
        },
      );
      this.easystar.calculate();
    }

    const th = this.map.tileHeight * this.layer.scaleY;
    const tw = this.map.tileWidth * this.layer.scaleX;
    const repeatMoveDelay = 160;

    if (time > this.lastMoveTime + repeatMoveDelay) {
      if (this.isTileOpenAt(this.enemy.x, this.enemy.y + th, this.map)) {
        const tweenConfig: Types.Tweens.TweenBuilderConfig = {
          targets: this.enemy,
          y: this.player.y + tw,
          x: this.player.x + tw,
          duration: 100,
          ease: "Linear",
          repeat: 0,
          yoyo: false,
          onComplete: () => {
            if (!this.map || !this.layer || !this.player || !this.enemy) return;
            this.easystar.findPath(
              this.map.worldToTileX(this.enemy.x) as number,
              this.map.worldToTileY(this.enemy.y) as number,
              this.map.worldToTileX(this.player.x) as number,
              this.map.worldToTileY(this.player.y) as number,
              (path) => {
                if (path) {
                  const tweenConfig: Types.Tweens.TweenBuilderConfig = {
                    targets: this.enemy,
                    y: path[0].y,
                    x: path[0].x,
                    duration: 100,
                    ease: "Linear",
                    repeat: 0,
                    yoyo: false,
                  };
                  this.tweens.add(tweenConfig);
                }
                // else console.log("no path found");
              },
            );
            this.easystar.calculate();
          },
        };
        this.tweens.add(tweenConfig);
        this.lastMoveTime = time;
      }
    }
  }
}

export default DungeonScene;
