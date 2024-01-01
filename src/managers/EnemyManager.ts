import EasyStar from "easystarjs";

import EnemyDeps from "../types/EnemyDeps.dependencies.class";
import Enemy from "../entities/Enemy.entity.class";
import EnemyInj from "../types/EnemyInj.injectables.interface";

interface EnemyManager extends EnemyDeps {}
class EnemyManager implements EnemyManager {
  pool: Enemy[] = [];

  constructor() {
    this.easyStar = new EasyStar.js();
  }

  create(inj: EnemyInj) {
    // this.pool.push(new Enemy())
  }
}

export default EnemyManager;
