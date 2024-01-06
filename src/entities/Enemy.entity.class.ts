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
  lastAttackTime = 0;

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
    const thisX = this.map.worldToTileX(this.x) as number;
    const thisY = this.map.worldToTileY(this.y) as number;
    const playerX = this.map.worldToTileX(this.player.x) as number;
    const playerY = this.map.worldToTileY(this.player.y) as number;
    const attackDelay = 400;

    if (
      time > this.lastAttackTime + attackDelay &&
      thisX === playerX &&
      thisY === playerY
    ) {
      this.attack();
      this.lastAttackTime = time;
    }

    const repeatMoveDelay = 600;
    if (time > this.lastMoveTime + repeatMoveDelay) {
      if (!this.scene.tweens.isTweening(this)) {
        this.easyStar!.findPath(thisX, thisY, playerX, playerY, (path) => {
          if (path) {
            if (path[0] === path[1]) {
              // sitting on player / collision
              // this.attack();
              return;
            }
            const coord = this.map?.tileToWorldXY(path[1].x, path[1].y);
            if (!coord) return;
            if (
              this.map &&
              !TileTools.isTileOpenAt(coord.x, coord.y, this.map)
            ) {
              return;
            }
            const tweenConfig: Types.Tweens.TweenBuilderConfig = {
              targets: this,
              y: coord.y,
              x: coord.x,
              duration: 100,
              ease: "Linear",
              repeat: 0,
              yoyo: false,
            };
            this.scene.tweens.add(tweenConfig);
            this.lastMoveTime = time;
          }
        });
        this.easyStar!.calculate();
      }
    }
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
