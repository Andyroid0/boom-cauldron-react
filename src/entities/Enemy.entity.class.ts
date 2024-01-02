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

  update() {
    // if (!this.map || !this.layer || !this.player || !this.enemy) return;
    // if (!this.tweens.isTweening(this.enemy)) {
    //   this.easystar.findPath(
    //     this.map.worldToTileX(this.enemy.x) as number,
    //     this.map.worldToTileY(this.enemy.y) as number,
    //     this.map.worldToTileX(this.player.x) as number,
    //     this.map.worldToTileY(this.player.y) as number,
    //     (path) => {
    //       if (path) {
    //         const tweenConfig: Types.Tweens.TweenBuilderConfig = {
    //           targets: this.enemy,
    //           y: path[0].y,
    //           x: path[0].x,
    //           duration: 100,
    //           ease: "Linear",
    //           repeat: 0,
    //           yoyo: false,
    //         };
    //         this.tweens.add(tweenConfig);
    //       }
    //       // else console.log("no path found");
    //     },
    //   );
    //   this.easystar.calculate();
    // }
    // const th = this.map.tileHeight * this.layer.scaleY;
    // const tw = this.map.tileWidth * this.layer.scaleX;
    // const repeatMoveDelay = 160;
    // if (time > this.enemyLastMoveTime + repeatMoveDelay) {
    //   if (this.isTileOpenAt(this.enemy.x, this.enemy.y + th, this.map)) {
    //     const tweenConfig: Types.Tweens.TweenBuilderConfig = {
    //       targets: this.enemy,
    //       y: this.player.y + tw,
    //       x: this.player.x + tw,
    //       duration: 100,
    //       ease: "Linear",
    //       repeat: 0,
    //       yoyo: false,
    //       onComplete: () => {
    //         if (!this.map || !this.layer || !this.player || !this.enemy) return;
    //         this.easystar.findPath(
    //           this.map.worldToTileX(this.enemy.x) as number,
    //           this.map.worldToTileY(this.enemy.y) as number,
    //           this.map.worldToTileX(this.player.x) as number,
    //           this.map.worldToTileY(this.player.y) as number,
    //           (path) => {
    //             if (path) {
    //               const tweenConfig: Types.Tweens.TweenBuilderConfig = {
    //                 targets: this.enemy,
    //                 y: path[0].y,
    //                 x: path[0].x,
    //                 duration: 100,
    //                 ease: "Linear",
    //                 repeat: 0,
    //                 yoyo: false,
    //               };
    //               this.tweens.add(tweenConfig);
    //             }
    //             // else console.log("no path found");
    //           },
    //         );
    //         this.easystar.calculate();
    //       },
    //     };
    //     this.tweens.add(tweenConfig);
    //     this.lastMoveTime = time;
    //   }
    // }
  }

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
