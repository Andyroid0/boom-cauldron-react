import { GameObjects, Types } from "phaser";

import EntityID from "../types/EntityID.properties.class";
import EntityStat from "../types/EntityStat.properties.class";
import EnemyInjectable from "../types/EnemyInj.injectables.interface";
import EnemyDeps from "../types/EnemyDeps.dependencies.class";
import EntityService from "../services/EntityService";
import TileTools from "../utils/TileTools";

interface Enemy extends EntityID, EntityStat, EnemyDeps {}
class Enemy extends GameObjects.Graphics implements Enemy {
  lastMoveTime = 0;

  constructor(inj: EnemyInjectable) {
    super(inj.scene);
    this.id = EntityService.generateID();
    this.multiplier = inj.multiplier;
    this.player = inj.dependencies.player;
    this.map = inj.dependencies.map;
    this.easyStar = inj.dependencies.easyStar;
    this.scene = inj.scene;
    this.layer = inj.dependencies.layer;

    this.fillStyle(11141120, 1);
    this.fillRect(
      0,
      0,
      this.map!.tileWidth * this.layer!.scaleX,
      this.map!.tileHeight * this.layer!.scaleY,
    );
    this.scene.add.existing(this);
  }

  attack() {
    this.player?.takeDamage();
  }

  update(time: number) {
    if (!this.map || !this.layer || !this.player) return;
    const th = this.map.tileHeight * this.layer.scaleY;
    const tw = this.map.tileWidth * this.layer.scaleX;
    const repeatMoveDelay = 600;
    if (time > this.lastMoveTime + repeatMoveDelay) {
      if (TileTools.isTileOpenAt(this.x, this.y + th, this.map)) {
        if (!this.scene.tweens.isTweening(this)) {
          this.easyStar!.findPath(
            this.map.worldToTileX(this.x) as number,
            this.map.worldToTileY(this.y) as number,
            this.map.worldToTileX(this.player.x) as number,
            this.map.worldToTileY(this.player.y) as number,
            (path) => {
              if (path) {
                const tweenConfig: Types.Tweens.TweenBuilderConfig = {
                  targets: this,
                  y: path[0].y,
                  x: path[0].x,
                  duration: 100,
                  ease: "Linear",
                  repeat: 0,
                  yoyo: false,
                };
                this.scene.tweens.add(tweenConfig);
                this.lastMoveTime = time;
              }
              // else console.log("no path found");
            },
          );
          this.easyStar!.calculate();
        }
      }
    }
    // const th = this.map.tileHeight * this.layer.scaleY;
    // const tw = this.map.tileWidth * this.layer.scaleX;
    // const repeatMoveDelay = 160;
    // if (time > this.lastMoveTime + repeatMoveDelay) {
    //   if (TileTools.isTileOpenAt(this.x, this.y + th, this.map)) {
    //     const tweenConfig: Types.Tweens.TweenBuilderConfig = {
    //       targets: this,
    //       y: this.player.y + tw,
    //       x: this.player.x + tw,
    //       duration: 100,
    //       ease: "Linear",
    //       repeat: 0,
    //       yoyo: false,
    //       onComplete: () => {
    //         if (!this.map || !this.layer || !this.player) return;
    //         this.easyStar!.findPath(
    //           this.map.worldToTileX(this.x) as number,
    //           this.map.worldToTileY(this.y) as number,
    //           this.map.worldToTileX(this.player.x) as number,
    //           this.map.worldToTileY(this.player.y) as number,
    //           (path) => {
    //             if (path) {
    //               const tweenConfig: Types.Tweens.TweenBuilderConfig = {
    //                 targets: this,
    //                 y: path[0].y,
    //                 x: path[0].x,
    //                 duration: 100,
    //                 ease: "Linear",
    //                 repeat: 0,
    //                 yoyo: false,
    //               };
    //               this.scene.tweens.add(tweenConfig);
    //             }
    //             // else console.log("no path found");
    //           },
    //         );
    //         this.easyStar!.calculate();
    //       },
    //     };
    //     this.scene.tweens.add(tweenConfig);
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
