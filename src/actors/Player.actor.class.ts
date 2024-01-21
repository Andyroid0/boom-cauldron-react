import { Math as PMath, Physics, Tilemaps, Types } from "phaser";
import useStateStore from "../context/useStateStore";
import EntityService from "../services/EntityService";
import InputManager from "../managers/InputManager";
import MessageService from "../services/MessageService";
import Projectile from "./Projectile.actor";
import PlayerDependencies from "../types/PlayerDependencies.interface";

interface Player {}
class Player extends Physics.Matter.Sprite implements Player {
  id: string | undefined;
  lastMoveTime = 0;
  health = 10;
  multiplier = 1;
  map: Tilemaps.Tilemap | undefined;
  layer: Tilemaps.TilemapLayer | undefined;
  speed = 5;
  inputManager: InputManager;

  constructor(deps: PlayerDependencies) {
    const label = EntityService.generateID();

    super(deps.world, 0, 0, "hero", 0);
    const bodyOptions: Types.Physics.Matter.MatterBodyConfig = {
      label,
      shape: "circle",
      frictionAir: 0.2,
      render: {
        sprite: { xOffset: 0, yOffset: 0.2 },
      },
    };
    const setBodyConfig: Types.Physics.Matter.MatterSetBodyConfig = {
      type: "circle",
      radius: 16,
    };

    this.setBody(setBodyConfig, bodyOptions);
    this.setFixedRotation();
    this.id = label;
    this.map = deps.map;
    this.scene = deps.scene;
    this.layer = deps.layer;
    this.world = deps.world;
    this.inputManager = deps.inputManager;

    deps.scene.add.existing(this);
    useStateStore.getState().setPlayerHealth(this.health);
    MessageService.listenForPlayerFire((data) => {
      if (data.type === "player1-fire-up") {
        const dmg = 1;
        this.attack(
          dmg,
          new PMath.Vector2({ x: 0, y: -3 }),
          this.getTopCenter(),
        );
      }
      if (data.type === "player1-fire-down") {
        const dmg = 1;
        this.attack(
          dmg,
          new PMath.Vector2({ x: 0, y: 3 }),
          this.getBottomCenter(),
        );
      }
      if (data.type === "player1-fire-left") {
        const dmg = 1;
        this.attack(
          dmg,
          new PMath.Vector2({ x: -3, y: 0 }),
          this.getLeftCenter(),
        );
      }
      if (data.type === "player1-fire-right") {
        const dmg = 1;
        this.attack(
          dmg,
          new PMath.Vector2({ x: 3, y: 0 }),
          this.getRightCenter(),
        );
      }
    });
  }

  public attack(dmg: number, dir: PMath.Vector2, position: PMath.Vector2) {
    if (!this.map || !this.layer || !this.world) return;
    new Projectile(
      "player",
      this.map,
      this.scene,
      this.world,
      {
        startPosition: position,
        velocity: { x: dir.x, y: dir.y },
      },
      this.layer,
      1,
      3000,
    );
  }

  public takeDamage(dmg: number) {
    this.health -= dmg;
    useStateStore.getState().setPlayerHealth(this.health);
  }

  public update(time: number) {
    if (this.health <= 0) {
      this.destroy();
    }
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    if (!this.map || !this.layer) return;
    const repeatMoveDelay = 160;

    if (time > this.lastMoveTime + repeatMoveDelay) {
      if (this.inputManager.down) {
        this.setVelocityY(this.speed);
      } else if (this.inputManager.up) {
        this.setVelocityY(-this.speed);
      }
      if (this.inputManager.left) {
        this.setVelocityX(-this.speed);
      } else if (this.inputManager.right) {
        this.setVelocityX(this.speed);
      }
    }
  }
}
export default Player;
