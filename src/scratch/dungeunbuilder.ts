import Dungeon, { Room } from "@mikewesthad/dungeon";
import { Cameras, GameObjects, Scene, Tilemaps, Types } from "phaser";
import * as dat from "dat.gui";

//  Toggle this to disable the room hiding / layer scale, so you can see the extent of the map easily!
const debug = false;
// Tile index mapping to make the code more readable
const TILES = {
  TOP_LEFT_WALL: 1,
  TOP_RIGHT_WALL: 3,
  BOTTOM_RIGHT_WALL: 27,
  BOTTOM_LEFT_WALL: 25,
  TOP_WALL: [
    { index: 2, weight: 4 },
    // { index: 57, weight: 1 },
    // { index: 58, weight: 1 },
    // { index: 59, weight: 1 },
  ],
  LEFT_WALL: [
    { index: 13, weight: 4 },
    // { index: 76, weight: 1 },
    // { index: 95, weight: 1 },
    // { index: 114, weight: 1 },
  ],
  RIGHT_WALL: [
    { index: 15, weight: 4 },
    // { index: 77, weight: 1 },
    // { index: 96, weight: 1 },
    // { index: 115, weight: 1 },
  ],
  BOTTOM_WALL: [
    { index: 26, weight: 4 },
    // { index: 78, weight: 1 },
    // { index: 79, weight: 1 },
    // { index: 80, weight: 1 },
  ],
  FLOOR: [
    { index: 48, weight: 20 },
    { index: 49, weight: 1 },
    // { index: 8, weight: 1 },
    // { index: 26, weight: 1 },
  ],
};
class DungeonScene extends Scene {
  activeRoom: Room | null = null;
  dungeon: Dungeon | null = null;
  map: Tilemaps.Tilemap | null = null;
  player: GameObjects.Graphics | null = null;
  cursors: Types.Input.Keyboard.CursorKeys | undefined;
  cam: Cameras.Scene2D.Camera | null = null;
  layer: Tilemaps.TilemapLayer | null = null;
  lastMoveTime = 0;

  constructor() {
    super("dungeon");
  }

  preload() {
    // Credits! Michele "Buch" Bucelli (tilset artist) & Abram Connelly (tileset sponser)
    // https://opengameart.org/content/top-down-dungeon-tileset
    this.load.image("tiles", "img/tilemap_packed.png");
  }

  create() {
    // Note: Dungeon is not a Phaser element - it's from the custom script embedded at the bottom :)
    // It generates a simple set of connected rectangular rooms that then we can turn into a tilemap

    //  2,500 tile test
    // dungeon = new Dungeon({
    //     width: 50,
    //     height: 50,
    //     rooms: {
    //         width: { min: 7, max: 15, onlyOdd: true },
    //         height: { min: 7, max: 15, onlyOdd: true }
    //     }
    // });

    //  40,000 tile test
    this.dungeon = new Dungeon({
      width: 200,
      height: 200,
      rooms: {
        width: { min: 7, max: 20, onlyOdd: true },
        height: { min: 7, max: 20, onlyOdd: true },
      },
    });

    //  250,000 tile test!
    // dungeon = new Dungeon({
    //     width: 500,
    //     height: 500,
    //     rooms: {
    //         width: { min: 7, max: 20, onlyOdd: true },
    //         height: { min: 7, max: 20, onlyOdd: true }
    //     }
    // });

    //  1,000,000 tile test! - Warning, takes a few seconds to generate the dungeon :)
    // dungeon = new Dungeon({
    //     width: 1000,
    //     height: 1000,
    //     rooms: {
    //         width: { min: 7, max: 20, onlyOdd: true },
    //         height: { min: 7, max: 20, onlyOdd: true }
    //     }
    // });

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
      // if (rand <= 0.25) {
      //   // Chest
      //   this.layer.putTileAt(166, cx, cy);
      // } else if (rand <= 0.3) {
      //   // Stairs
      //   this.layer.putTileAt(81, cx, cy);
      // } else if (rand <= 0.4) {
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

    // Not exactly correct for the tileset since there are more possible floor tiles, but this will
    // do for the example.
    this.layer.setCollisionByExclusion([0, 48, 49]);

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

    this.player.x = this.map.tileToWorldX(playerRoom.x + 1) as number;
    this.player.y = this.map.tileToWorldY(playerRoom.y + 1) as number;

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

    const help = this.add.text(16, 16, "Arrows keys to move", {
      fontSize: "18px",
      padding: { x: 10, y: 5 },
      backgroundColor: "#ffffff",
      // fill: "#000000",
    });

    help.setScrollFactor(0);

    const gui = new dat.GUI();

    gui.addFolder("Camera");
    gui.add(this.cam, "scrollX").listen();
    gui.add(this.cam, "scrollY").listen();
    gui.add(this.cam, "zoom", 0.1, 4).step(0.1);
    // gui.add(this.cam, "rotation").step(0.01);
    gui.add(this.layer, "skipCull").listen();
    gui.add(this.layer, "cullPaddingX").step(1);
    gui.add(this.layer, "cullPaddingY").step(1);
    gui.add(this.layer, "tilesDrawn").listen();
    gui.add(this.layer, "tilesTotal").listen();
  }

  update(time: number, delta: number) {
    // Maybe set a loading screen here?
    if (!this.map || !this.player || !this.dungeon || !this.cam) return;

    this.updatePlayerMovement(time);

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
      // this.easeRoomAlpha(this.activeRoom, 0.1, this.map);
      // if (this.getRoomAlpha(this.activeRoom, this.layer) <= 0) {
      //   this.activeRoom = room;
      // }
    }

    this.activeRoom = room;

    // Smooth follow the player
    const smoothFactor = 0.9;

    this.cam.scrollX =
      smoothFactor * this.cam.scrollX +
      (1 - smoothFactor) * (this.player.x - this.cam.width * 0.5);
    this.cam.scrollY =
      smoothFactor * this.cam.scrollY +
      (1 - smoothFactor) * (this.player.y - this.cam.height * 0.5);
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
}

// const config = {
//   type: Phaser.AUTO,
//   width: 800,
//   height: 600,
//   backgroundColor: "#2a2a55",
//   parent: "phaser-example",
//   pixelArt: true,
//   roundPixels: false,
//   scene: Example,
// };

// const game = new Phaser.Game(config);

export default DungeonScene;
