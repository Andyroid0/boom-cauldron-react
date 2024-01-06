import { Tilemaps } from "phaser";

export default class TileTools {
  public static isTileOpenAt(
    worldX: number,
    worldY: number,
    map: Tilemaps.Tilemap,
  ) {
    // nonNull = true, don't return null for empty tiles. This means null will be returned only for
    // tiles outside of the bounds of the map.
    const tile = map.getTileAtWorldXY(worldX, worldY, true);

    if (tile && !tile.collides) {
      return true;
    } else {
      return false;
    }
  }
}
