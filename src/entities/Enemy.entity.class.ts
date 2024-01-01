import { GameObjects } from "phaser";

import EntityID from "../types/EntityID.properties.class";
import EntityStat from "../types/EntityStat.properties.class";
import EnemyInjectable from "../types/EnemyInj.injectables.interface";
import EnemyDeps from "../types/EnemyDeps.dependencies.class";
import EntityService from "../services/EntityService";

interface Enemy extends EntityID, EntityStat, EnemyDeps, GameObjects.Graphics {}
class Enemy implements Enemy {
  constructor(inj: EnemyInjectable) {
    this.id = EntityService.generateID();
    this.multiplier = inj.multiplier;
    this.player = inj.dependencies.player;
    this.map = inj.dependencies.map;
    this.easyStar = inj.dependencies.easyStar;
    this.scene = inj.scene;
  }

  attack() {
    this.player?.takeDamage();
  }

  update() {}

  findPath() {
    if (!this.player)
      throw new Error(`Player undefined within Enemy ID: ${this.id}.`);
    if (!this.map)
      throw new Error(`Map undefined within Enemy ID: ${this.id}.`);
    if (!this.easyStar)
      throw new Error(`EasyStar undefined within Enemy ID: ${this.id}.`);

    this.easyStar.findPath(
      this.map.worldToTileX(this.x) as number,
      this.map.worldToTileY(this.y) as number,
      this.map.worldToTileX(this.player.x) as number,
      this.map.worldToTileY(this.player.y) as number,
      (path) => {
        // eslint-disable-next-line no-alert
        if (path === null) alert("Path was not found.");
        else {
          // eslint-disable-next-line no-alert
          alert(`Path was found. The first Point is ${path[0].x} ${path[0].y}`);
        }
      },
    );
    this.easyStar.calculate();
  }
}

export default Enemy;
