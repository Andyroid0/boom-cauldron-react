import { Scene, Tilemaps, Types, Physics } from "phaser";

import MessageService from "../services/MessageService";
import MessageServiceOrigin from "../types/MessageServiceOrigin.type";

import DurationDestroyer from "./DurationDestroyer";
// import useStateStore from "../context/useStateStore";

class Projectile extends Physics.Matter.Sprite {
  startData: {
    startPosition: { x: number; y: number };
    velocity: { x: number; y: number };
  };

  damage: number;
  origin: MessageServiceOrigin = "player";

  constructor(
    origin: MessageServiceOrigin,
    map: Tilemaps.Tilemap,
    scene: Scene,
    world: Physics.Matter.World,
    data: {
      startPosition: { x: number; y: number };
      velocity: { x: number; y: number };
    },
    layer: Tilemaps.TilemapLayer,
    damage: number,
    duration?: number,
    label?: string,
  ) {
    const bodyOptions: Types.Physics.Matter.MatterBodyConfig = { label };
    super(
      world,
      data.startPosition.x,
      data.startPosition.y,
      "projectile",
      0,
      bodyOptions,
    );
    this.origin = origin;
    this.damage = damage;
    console.log("Projectile damage at creation: ", this.damage);
    this.startData = data;
    scene.add.existing(this);
    world.add(this);
    this.setScale(6);
    this.setVelocity(this.startData.velocity.x, this.startData.velocity.y);
    this.setFriction(0, 0);
    this.setOnCollide(this.handleCollide);
    new DurationDestroyer(scene, this, duration);
  }

  handleCollide(data: Types.Physics.Matter.MatterCollisionData) {
    if (data.bodyA.label !== "wall" && data.bodyA.label !== "item") {
      MessageService.sendWithOriginIDAmount({
        type: "projectile-collision",
        origin: "player",
        id: data.bodyA.label,
        amount: 1,
      });
    }
  }
}
export default Projectile;
