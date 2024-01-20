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
import CoolDownManager from "../managers/CoolDownManager";

interface Enemy extends EntityID, EntityStat, EnemyDeps {}
class Enemy extends Physics.Matter.Sprite implements Enemy {
  lastMoveTime = 0;
  lastAttackTime = 0;
  health = 0;
  speed = 1;
  damage = 1;
  moveState: MoveState = "idle";
  previousPlayerPosition: PMath.Vector2 | undefined;
  coolDownManager: CoolDownManager = new CoolDownManager(300);
  pathFindingOffset = 0;

  constructor(inj: EnemyInjectable) {
    const label = EntityService.generateID();
    super(inj.world, 0, 0, "enemy", 0);
    const bodyOptions: Types.Physics.Matter.MatterBodyConfig = {
      label,
      shape: "circle",
      render: {
        sprite: { xOffset: 0, yOffset: 0.3 },
      },
      frictionAir: 0.2,
    };
    const setBodyConfig: Types.Physics.Matter.MatterSetBodyConfig = {
      type: "circle",
      radius: 16,
    };
    this.setBody(setBodyConfig, bodyOptions);
    this.setFixedRotation();
    this.setOnCollideActive(
      (data: Types.Physics.Matter.MatterCollisionData) => {
        if (this.coolDownManager.state === "cool") {
          this.handleCollide(data, this.damage);
          this.coolDownManager.setAction();
        }
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
    this.pathFindingOffset = inj.pathFindingOffset ?? 0;
  }

  attack(dmg: number) {
    this.player?.takeDamage(dmg);
  }

  handleCollide(
    data: Types.Physics.Matter.MatterCollisionData,
    amount: number,
  ) {
    if (this.player?.id === data.bodyA.label) {
      MessageService.enemyAttackPlayer(data.bodyA.label, amount);
      // play projectile collision animation here.
    }
  }

  takeDamage(dmg: number) {
    this.health -= dmg;
    const originalTint = this.tint;
    this.tintFill = true;
    this.setTintFill(Color("#ffffff").rgbNumber().valueOf());
    // run damage anim or flash
    const tweenConfig: Types.Tweens.TweenBuilderConfig = {
      targets: this,
      alpha: 0.2,
      duration: 100,
      ease: "Linear",
      repeat: 1,
      yoyo: true,
    };
    this.scene.tweens.add(tweenConfig);
    setTimeout(() => {
      this.setTintFill(originalTint);
      this.tintFill = false;
      this.alpha = 1;
    }, 200);

    if (this.health <= 0) {
      this.handleDeath();
    }
  }

  handleDeath() {
    // play death animation
    MessageService.enemyDeath(this.id as string);
    this.destroy(true);
  }

  update(time: number) {
    this.roundPositions();
    this.coolDownManager.update(time);
    this.handleMovement(time);
  }

  roundPositions() {
    if (this.x && this.y) {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
    }
  }

  handleMovement(time: number) {
    if (!this.map || !this.layer || !this.player) return;

    // if (time > this.lastMoveTime + repeatMoveDelay) {
    const thisX = Math.round(this.map.worldToTileX(this.x) as number);
    const thisY = Math.round(this.map.worldToTileY(this.y) as number);
    const playerX = Math.round(
      this.map.worldToTileX(this.player.body?.position.x as number) as number,
    );
    const playerY = Math.round(
      this.map.worldToTileY(this.player.body?.position.y as number) as number,
    );

    if (Math.abs(thisX - playerX) <= 1 && Math.abs(thisY - playerY) <= 1) {
      // BEELINE TO PLAYER
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
    } else if (
      this.previousPlayerPosition !==
      new PMath.Vector2(this.player?.body?.position)
    ) {
      // USE PATHFINDING
      this.easyStar!.findPath(thisX, thisY, playerX, playerY, (path) => {
        if (!path || !path.length || !this.body?.position) return;

        const destination = this.map?.tileToWorldXY(
          path[1].x,
          path[1].y,
        ) as PMath.Vector2;

        const moveState = MovementService.pathFindingCompass(
          destination.x,
          destination.y,
          this.x - this.pathFindingOffset,
          this.y - this.pathFindingOffset,
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
    }

    this.lastMoveTime = time;
    this.previousPlayerPosition = new PMath.Vector2(
      this.player?.body?.position,
    );
  }
}

export default Enemy;
