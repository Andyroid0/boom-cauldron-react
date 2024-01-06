import { Scene, Tilemaps, Types } from "phaser";
import Dungeon from "@mikewesthad/dungeon";

import { TILES } from "../data/tiles.data";

class MapManager {
  createBlankTileMap(dungeon: Dungeon, scene: Scene): Tilemaps.Tilemap {
    const tileMapConfig: Types.Tilemaps.TilemapConfig = {
      tileWidth: 16,
      tileHeight: 16,
      width: dungeon.width,
      height: dungeon.height,
    };

    return scene.make.tilemap(tileMapConfig);
  }

  createTileset(map: Tilemaps.Tilemap): Tilemaps.Tileset {
    const tileset: Tilemaps.Tileset = map.addTilesetImage(
      "tiles",
      "tiles",
      16,
      16,
      0,
      0,
      0,
      { x: 0, y: 0 },
    ) as Tilemaps.Tileset;

    return tileset;
  }

  createBlankLayer(
    tileset: Tilemaps.Tileset,
    map: Tilemaps.Tilemap,
  ): Tilemaps.TilemapLayer {
    return map.createBlankLayer("Layer 1", tileset) as Tilemaps.TilemapLayer;
  }

  populateTilesPerRoom(
    dungeon: Dungeon,
    map: Tilemaps.Tilemap,
    layer: Tilemaps.TilemapLayer,
    scene: Scene,
    debug?: boolean,
  ) {
    // Use the array of rooms generated to place tiles in the map
    dungeon.rooms.forEach((room) => {
      if (!map || !layer) return;
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
      map.weightedRandomize(TILES.FLOOR, x, y, width, height);

      // Place the room corners tiles
      map.putTileAt(TILES.TOP_LEFT_WALL, left, top);
      map.putTileAt(TILES.TOP_RIGHT_WALL, right, top);
      map.putTileAt(TILES.BOTTOM_RIGHT_WALL, right, bottom);
      map.putTileAt(TILES.BOTTOM_LEFT_WALL, left, bottom);

      // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
      map.weightedRandomize(TILES.TOP_WALL, left + 1, top, width - 2, 1);
      map.weightedRandomize(TILES.BOTTOM_WALL, left + 1, bottom, width - 2, 1);
      map.weightedRandomize(TILES.LEFT_WALL, left, top + 1, 1, height - 2);
      map.weightedRandomize(TILES.RIGHT_WALL, right, top + 1, 1, height - 2);

      // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the rooms location
      const doors = room.getDoorLocations();
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < doors.length; i++) {
        map.putTileAt(0, x + doors[i].x, y + doors[i].y);
      }
      // Place some random stuff in rooms occasionally
      const rand = Math.random();
      if (rand <= 0.25) {
        // Chest
        layer?.putTileAt(89, cx, cy);
      } else if (rand <= 0.3) {
        // Stairs
        layer?.putTileAt(85, cx, cy);
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
    }, scene);
  }
}

export default MapManager;
