import { Physics, Scene, Tilemaps } from "phaser";
import EasyStar from "easystarjs";

import Player from "../actors/Player.actor.class";

import EnemyType from "./EnemyType.type";

interface EnemyDependencies {
  player: Player | undefined;
  map: Tilemaps.Tilemap | undefined;
  easyStar: EasyStar.js | undefined;
  etype: EnemyType | undefined;
  layer: Tilemaps.TilemapLayer | undefined;
  options: unknown;
  multiplier: number;
  scene: Scene;
  world: Physics.Matter.World;
  health: number;
  pathFindingOffset?: number;
}
export default EnemyDependencies;
