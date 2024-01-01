import { Scene, Tilemaps } from "phaser";

import Player from "../entities/Player.entity.class";

interface PlayerManager {}
class PlayerManager implements PlayerManager {
  pool: Player[] = [];
  map!: Tilemaps.Tilemap;
  scene!: Scene;
  layer!: Tilemaps.TilemapLayer;

  constructor(
    map: Tilemaps.Tilemap,
    scene: Scene,
    layer: Tilemaps.TilemapLayer,
  ) {
    this.scene = scene;
    this.map = map;
    this.layer = layer;
  }

  create() {
    this.pool.push(new Player(this.map, this.scene, this.layer));
  }
}

export default PlayerManager;
