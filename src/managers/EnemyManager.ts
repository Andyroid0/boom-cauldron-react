import EasyStar from "easystarjs";
import { Scene, Tilemaps } from "phaser";
import { Room } from "@mikewesthad/dungeon";

import Player from "../entities/Player.entity.class";
import EnemyDeps from "../types/EnemyDeps.dependencies.class";
import Enemy from "../entities/Enemy.entity.class";
import EnemyType from "../types/EnemyType.type";

interface EnemyManager extends EnemyDeps {}
class EnemyManager implements EnemyManager {
  pool: Enemy[] = [];
  map!: Tilemaps.Tilemap;
  scene!: Scene;
  layer!: Tilemaps.TilemapLayer;
  player!: Player;

  constructor(
    map: Tilemaps.Tilemap,
    scene: Scene,
    layer: Tilemaps.TilemapLayer,
    player: Player,
  ) {
    this.easyStar = new EasyStar.js();
    this.scene = scene;
    this.map = map;
    this.layer = layer;
    this.player = player;

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

    this.easyStar.setGrid(easyStarGrid());
    this.easyStar.setAcceptableTiles([0]);
  }

  create(room: Room, coordX: number, coordY: number, type: EnemyType) {
    const enemy = new Enemy({
      dependencies: {
        map: this.map,
        easyStar: this.easyStar,
        player: this.player,
        etype: type,
        layer: this.layer,
      },
      scene: this.scene,
      options: null,
      multiplier: 1,
    });
    this.pool.push(enemy);
    enemy.x = this.map.tileToWorldX(room.x + coordX) as number;
    enemy.y = this.map.tileToWorldY(room.y + coordY) as number;
  }
}

export default EnemyManager;
