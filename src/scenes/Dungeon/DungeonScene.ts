import Dungeon, { Room } from "@mikewesthad/dungeon";
import { Cameras, GameObjects, Scene, Tilemaps, Types } from "phaser";
import * as dat from "dat.gui";
import EasyStar from "easystarjs";

import PlayerManager from "../../managers/PlayerManager";
import useStateStore from "../../context/useStateStore";
import DungeonState from "../../types/DungeonState.class";
import MessageService from "../../services/MessageService";
import InputManager from "../../managers/InputManager";
import EnemyManager from "../../managers/EnemyManager";

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
  layer!: Tilemaps.TilemapLayer;
  layer2: Tilemaps.TilemapLayer | null = null;
  lastMoveTime = 0;
  enemyLastMoveTime = 0;
  easystar: EasyStar.js = new EasyStar.js();
  enemyManager: EnemyManager | undefined;
  playerManager: PlayerManager | undefined;
  messageService!: MessageService;
  state: DungeonState = new DungeonState();
  inputService!: InputManager;

  constructor() {
    super("dungeon");
    this.messageService = new MessageService(this.state);
  }

  preload() {
    this.load.image("tiles", "img/tilemap_packed.png");
  }

  create() {
    this.inputService = new InputManager(this);

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

    this.layer = this.map.createBlankLayer(
      "Layer 1",
      tileset,
    ) as Tilemaps.TilemapLayer;
    // this.layer2 = this.map.createBlankLayer("Layer 2", tileset);

    if (!debug) {
      this.layer.setScale(3);
      // this.layer2?.setScale(3);
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
        this.layer?.putTileAt(89, cx, cy);
      } else if (rand <= 0.3) {
        // Stairs
        this.layer?.putTileAt(85, cx, cy);
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

    // const easyStarGrid = (): number[][] => {
    //   const grid: number[][] = [];
    //   this.map!.layers[0].data.forEach((row) => {
    //     const newRow: number[] = [];
    //     row.forEach((tile) => {
    //       if (tile.collides) newRow.push(1);
    //       else newRow.push(0);
    //     });
    //     grid.push(newRow);
    //   });
    //   return grid;
    // };

    // this.easystar.setGrid(easyStarGrid());
    // this.easystar.setAcceptableTiles([0]);

    this.playerManager = new PlayerManager(this.map, this, this.layer);
    const player = this.playerManager.create(playerRoom, 1, 1);
    this.enemyManager = new EnemyManager(this.map, this, this.layer, player);

    this.enemyManager.create(playerRoom, 3, 3, "lab-bot");

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
    this.cam.scrollX = this.playerManager.pool[0].x - this.cam.width * 0.5;
    this.cam.scrollY = this.playerManager.pool[0].y - this.cam.height * 0.5;

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

    this.cam.startFollow(this.playerManager.player1(), true, 0.1, 0.1);
  }

  update(time: number, delta: number) {
    if (this.state.paused) return;

    this.inputService.update();
    // Maybe set a loading screen here?
    if (!this.map || !this.dungeon || !this.cam) return;

    this.playerManager?.pool.forEach((player) => {
      player.update(time);
    });
    this.enemyManager?.pool.forEach((enemy) => {
      enemy.update(time);
    });

    const playerTileX: number = this.map.worldToTileX(
      this.playerManager?.pool[0].x as number,
    ) as number;
    const playerTileY: number = this.map.worldToTileY(
      this.playerManager?.pool[0].y as number,
    ) as number;

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
}

export default DungeonScene;
