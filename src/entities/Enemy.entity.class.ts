import { Physics, Types } from "phaser";
import Color from "color";

import EntityID from "../types/EntityID.properties.class";
import EntityStat from "../types/EntityStat.properties.class";
import EnemyInjectable from "../types/EnemyInj.injectables.interface";
import EnemyDeps from "../types/EnemyDeps.dependencies.class";
import EntityService from "../services/EntityService";
import MessageService from "../services/MessageService";
import MoveState from "../types/MoveState";
import MovementService from "../services/MovementService";

interface Enemy extends EntityID, EntityStat, EnemyDeps {}
class Enemy extends Physics.Matter.Sprite implements Enemy {
  lastMoveTime = 0;
  lastAttackTime = 0;
  health = 0;
  speed = 1;
  moveState: MoveState = "idle";

  constructor(inj: EnemyInjectable) {
    const label = EntityService.generateID();
    const bodyOptions: Types.Physics.Matter.MatterBodyConfig = {
      label,
      shape: "circle",
    };
    super(inj.world, 0, 0, "enemy", 0, bodyOptions);
    this.setFixedRotation();
    this.id = label;
    this.multiplier = inj.multiplier;
    this.player = inj.dependencies.player;
    this.map = inj.dependencies.map;
    this.easyStar = inj.dependencies.easyStar;
    this.scene = inj.scene;
    this.layer = inj.dependencies.layer;
    this.health = inj.health;
    this.scene.add.existing(this);
  }

  attack(dmg: number) {
    this.player?.takeDamage(dmg);
  }

  takeDamage(dmg: number) {
    this.health -= dmg;
    // run damage anim or flash
    this.tintFill = true;
    const originalTint = this.tint;
    const tweenConfig: Types.Tweens.TweenBuilderConfig = {
      targets: this.tint,
      value: Color("#ffffff").rgbNumber().valueOf(),
      duration: 120,
      ease: "Linear",
      repeat: 0,
      yoyo: true,
      onComplete: () => {
        this.tint = originalTint;
        this.tintFill = false;
      },
      onUpdate: (tween, target) => {
        this.setTintFill(tween.getValue());
      },
    };
    this.scene.tweens.add(tweenConfig);
    if (this.health <= 0) {
      this.handleDeath();
    }
  }

  handleDeath() {
    // play death animation
    MessageService.sendWithID({ type: "enemy-death", id: this.id as string });
    this.destroy(true);
  }

  update(time: number) {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    if (!this.map || !this.layer || !this.player) return;

    // const attackDelay = 400;

    // if (
    //   time > this.lastAttackTime + attackDelay &&
    //   thisX === playerX &&
    //   thisY === playerY
    // ) {
    //   // TODO: handle this with collision.
    //   this.attack(1);
    //   this.lastAttackTime = time;
    // }

    const repeatMoveDelay = 200;
    if (time > this.lastMoveTime + repeatMoveDelay) {
      const thisX = this.map.worldToTileX(this.x, true) as number;
      const thisY = this.map.worldToTileY(this.y, true) as number;
      const playerX = this.map.worldToTileX(this.player.x, true) as number;
      const playerY = this.map.worldToTileY(this.player.y, true) as number;

      this.easyStar!.findPath(thisX, thisY, playerX, playerY, (path) => {
        if (!path) return;
        const coord = this.map?.tileToWorldXY(path[1].x, path[1].y);
        if (!coord) return;
        const moveState = MovementService.pathFindingCompass(
          path[1].x,
          path[1].y,
          thisX,
          thisY,
        );
        const velocity = this.getVelocity();
        const calculatedVelocity = MovementService.calculateVelocity(
          moveState,
          { x: velocity.x ?? 0, y: velocity.y ?? 0 },
          this.speed,
        );
        this.setVelocity(calculatedVelocity.x, calculatedVelocity.y);
      });
      this.easyStar!.calculate();
      this.lastMoveTime = time;
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
