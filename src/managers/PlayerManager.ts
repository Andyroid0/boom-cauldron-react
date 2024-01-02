import { Scene, Tilemaps } from "phaser";
import { Room } from "@mikewesthad/dungeon";

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

  create(room: Room, coordX: number, coordY: number) {
    const player = new Player(this.map, this.scene, this.layer);
    this.pool.push(player);
    player.x = this.map.tileToWorldX(room.x + coordX) as number;
    player.y = this.map.tileToWorldY(room.y + coordY) as number;
  }

  player1() {
    return this.pool[0];
  }
}

export default PlayerManager;
