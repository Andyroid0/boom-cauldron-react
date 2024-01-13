import { Math as PMath, Physics, Types } from "phaser";
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
  damage = 1;
  moveState: MoveState = "idle";
  previousPlayerPosition: PMath.Vector2 | undefined;

  constructor(inj: EnemyInjectable) {
    const label = EntityService.generateID();
    super(inj.world, 0, 0, "enemy", 0);
    const bodyOptions: Types.Physics.Matter.MatterBodyConfig = {
      label,
      shape: "circle",
      render: {
        sprite: { xOffset: 0, yOffset: 0.3 },
      },
    };
    const setBodyConfig: Types.Physics.Matter.MatterSetBodyConfig = {
      type: "circle",
      radius: 16,
    };
    this.setBody(setBodyConfig, bodyOptions);
    this.setFixedRotation();
    this.setOnCollideActive(
      (data: Types.Physics.Matter.MatterCollisionData) => {
        this.handleCollide(data, this.damage);
      },
    );
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

  handleCollide(
    data: Types.Physics.Matter.MatterCollisionData,
    amount: number,
  ) {
    if (this.player?.id === data.bodyA.label) {
      MessageService.sendWithIDAmount({
        type: "enemy-attack",
        id: data.bodyA.label,
        amount,
      });
      // play projectile collision animation here.
    }
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
    this.handleMovement(time);
  }

  handleMovement(time: number) {
    if (!this.map || !this.layer || !this.player) return;
    const repeatMoveDelay = 200;
    if (
      this.previousPlayerPosition !==
      new PMath.Vector2(this.player?.body?.position)
    ) {
      // if (time > this.lastMoveTime + repeatMoveDelay) {
      const thisX = this.map.worldToTileX(this.x, true) as number;
      const thisY = this.map.worldToTileY(this.y, true) as number;
      const playerX = this.map.worldToTileX(
        this.player.body?.position.x as number,
        true,
      ) as number;
      const playerY = this.map.worldToTileY(
        this.player.body?.position.y as number,
        true,
      ) as number;

      if (Math.abs(thisX - playerX) <= 1 || Math.abs(thisY - playerY) <= 1) {
        const moveState = MovementService.pathFindingCompass(
          this.player.x,
          this.player.y,
          this.x,
          this.y,
        );
        const velocity = this.getVelocity();
        const calculatedVelocity = MovementService.calculateVelocity(
          moveState,
          { x: velocity.x ?? 0, y: velocity.y ?? 0 },
          this.speed,
        );
        this.setVelocity(calculatedVelocity.x, calculatedVelocity.y);
      } else {
        this.easyStar!.findPath(thisX, thisY, playerX, playerY, (path) => {
          // const coord = path.length
          //   ? this.map?.tileToWorldXY(path[1].x, path[1].y)
          //   : new PMath.Vector2({ x: this.player?.x, y: this.player?.y });
          const coord = path[1]
            ? this.map?.tileToWorldXY(path[1].x, path[1].y)
            : new PMath.Vector2({ x: this.player?.x, y: this.player?.y });
          if (!coord) return;
          const moveState = MovementService.pathFindingCompass(
            playerX,
            playerY,
            thisX,
            thisY,
          );
          // const moveState = path.length
          //   ? MovementService.pathFindingCompass(playerX, playerY, thisX, thisY)
          //   : MovementService.pathFindingCompass(
          //       this.player?.x as number,
          //       this.player?.y as number,
          //       thisX,
          //       thisY,
          //     );
          const velocity = this.getVelocity();
          const calculatedVelocity = MovementService.calculateVelocity(
            moveState,
            { x: velocity.x ?? 0, y: velocity.y ?? 0 },
            this.speed,
          );
          this.setVelocity(calculatedVelocity.x, calculatedVelocity.y);
        });
        this.easyStar!.calculate();
      }

      this.lastMoveTime = time;
      this.previousPlayerPosition = new PMath.Vector2(
        this.player?.body?.position,
      );
    }
  }
}

export default Enemy;
