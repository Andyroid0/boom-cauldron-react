import EasyStar from "easystarjs";
import { Physics, Scene, Tilemaps } from "phaser";
import { Room } from "@mikewesthad/dungeon";

import Player from "../entities/Player.entity.class";
import EnemyDeps from "../types/EnemyDeps.dependencies.class";
import Enemy from "../entities/Enemy.entity.class";
import EnemyType from "../types/EnemyType.type";
import MessageServiceWithOrigin from "../types/MessageServiceWithOriginIDAmount.interface";
import MessageServiceWithID from "../types/MessageServiceWithID.interface";

interface EnemyManager extends EnemyDeps {}
class EnemyManager implements EnemyManager {
  pool: Enemy[] = [];
  scene!: Scene;
  player!: Player;
  world: Physics.Matter.World;

  constructor(
    map: Tilemaps.Tilemap,
    scene: Scene,
    layer: Tilemaps.TilemapLayer,
    player: Player,
    world: Physics.Matter.World,
  ) {
    this.easyStar = new EasyStar.js();
    this.scene = scene;
    this.map = map;
    this.layer = layer;
    this.player = player;
    this.world = world;

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

    const handleProjectileEvent = (
      event: MessageEvent<MessageServiceWithOrigin & MessageServiceWithID>,
    ) => {
      if (
        event.data.type === "projectile-collision"
        // event.data.origin === "player"
      ) {
        const enemy = this.pool.find((enemy) => enemy.id === event.data.id);
        enemy?.takeDamage(event.data.amount);
      } else if (event.data.type === "enemy-death") {
        const index = this.pool.findIndex(
          (enemy) => enemy.id === event.data.id,
        );
        this.pool.splice(index, 1);
      }
    };

    window.addEventListener("message", handleProjectileEvent);
  }

  create(room: Room, coordX: number, coordY: number, type: EnemyType) {
    if (!this.map) return;
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
      world: this.world,
      health: 10,
    });
    this.pool.push(enemy);
    enemy.x = this.map.tileToWorldX(room.x + coordX) as number;
    enemy.y = this.map.tileToWorldY(room.y + coordY) as number;
  }
}

export default EnemyManager;
