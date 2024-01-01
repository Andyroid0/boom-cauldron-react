import { Tilemaps } from "phaser";
import EasyStar from "easystarjs";

import Player from "../entities/Player.entity.class";

import EnemyType from "./EnemyType.type";

class EnemyDeps {
  player: Player | undefined;
  map: Tilemaps.Tilemap | undefined;
  easyStar: EasyStar.js | undefined;
  etype: EnemyType | undefined;
}
export default EnemyDeps;
