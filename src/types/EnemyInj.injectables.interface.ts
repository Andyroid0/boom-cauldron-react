import { Scene } from "phaser";

import EnemyDeps from "./EnemyDeps.dependencies.class";

export default interface EnemyInj {
  options: unknown;
  multiplier: number;
  scene: Scene;
  dependencies: EnemyDeps;
}
