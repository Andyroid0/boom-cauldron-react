import { Math, Physics, Scene, Tilemaps, Types } from "phaser";

import EntityID from "../types/EntityID.properties.class";
import EntityStat from "../types/EntityStat.properties.class";
import TileTools from "../utils/TileTools";
import useStateStore from "../context/useStateStore";
import MessageServiceWithAmount from "../types/MessageServiceWithAmount.interface";
import EntityService from "../services/EntityService";

import Projectile from "./Projectile.entity";

interface Player extends EntityID, EntityStat {}
class Player extends Physics.Matter.Sprite implements Player {
  lastMoveTime = 0;
  health = 10;
  map: Tilemaps.Tilemap | undefined;
  layer: Tilemaps.TilemapLayer | undefined;

  constructor(
    map: Tilemaps.Tilemap,
    scene: Scene,
    layer: Tilemaps.TilemapLayer,
    world: Physics.Matter.World,
  ) {
    const label = EntityService.generateID();
    const bodyOptions: Types.Physics.Matter.MatterBodyConfig = {
      render: { sprite: { xOffset: -0.2, yOffset: -0.2 } },
      label,
    };
    super(world, 0, 0, "hero", 0, bodyOptions);
    this.setFixedRotation();
    this.id = label;
    this.map = map;
    this.scene = scene;
    this.layer = layer;
    this.world = world;

    // this.fillStyle(0xedca40, 1);
    // this.fillRect(
    //   0,
    //   0,
    //   this.map.tileWidth * this.layer.scaleX,
    //   this.map.tileHeight * this.layer.scaleY,
    // );

    scene.add.existing(this);
    useStateStore.getState().setPlayerHealth(this.health);
    window.addEventListener(
      "message",
      (event: MessageEvent<MessageServiceWithAmount>) => {
        const offset = 48;
        if (event.data.type === "player1-fire-up") {
          const dmg = 1;
          this.attack(
            dmg,
            new Math.Vector2({ x: 0, y: -3 }),
            new Math.Vector2({ x: 0, y: -offset }),
          );
        }
        if (event.data.type === "player1-fire-down") {
          const dmg = 1;
          this.attack(
            dmg,
            new Math.Vector2({ x: 0, y: 3 }),
            new Math.Vector2({ x: 0, y: offset }),
          );
        }
        if (event.data.type === "player1-fire-left") {
          const dmg = 1;
          this.attack(
            dmg,
            new Math.Vector2({ x: -3, y: 0 }),
            new Math.Vector2({ x: -offset, y: 0 }),
          );
        }
        if (event.data.type === "player1-fire-right") {
          const dmg = 1;
          this.attack(
            dmg,
            new Math.Vector2({ x: 3, y: 0 }),
            new Math.Vector2({ x: offset, y: 0 }),
          );
        }
      },
    );
  }

  public attack(dmg: number, dir: Math.Vector2, offset: Math.Vector2) {
    // check area to see what the tile contains
    // enemy.takeDamage(damage);
    if (!this.map || !this.layer || !this.world) return;
    new Projectile(
      "player",
      this.map,
      this.scene,
      this.world,
      {
        startPosition: { x: this.x + offset.x, y: this.y + offset.y },
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
    if (!this.map || !this.layer) return;

    const tw = this.map.tileWidth * this.layer.scaleX;
    const th = this.map.tileHeight * this.layer.scaleY;
    const repeatMoveDelay = 160;

    if (time > this.lastMoveTime + repeatMoveDelay) {
      if (useStateStore.getState().down) {
        if (TileTools.isTileOpenAt(this.x, this.y + th, this.map)) {
          const tweenConfig: Types.Tweens.TweenBuilderConfig = {
            targets: this,
            y: this.y + th,
            duration: 100,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
          };
          this.scene.tweens.add(tweenConfig);
          this.lastMoveTime = time;
        }
      } else if (useStateStore.getState().up) {
        if (TileTools.isTileOpenAt(this.x, this.y - th, this.map)) {
          const tweenConfig: Types.Tweens.TweenBuilderConfig = {
            targets: this,
            y: this.y - th,
            duration: 100,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
          };
          this.scene.tweens.add(tweenConfig);
          this.lastMoveTime = time;
        }
      }

      if (useStateStore.getState().left) {
        if (TileTools.isTileOpenAt(this.x - tw, this.y, this.map)) {
          const tweenConfig: Types.Tweens.TweenBuilderConfig = {
            targets: this,
            x: this.x - tw,
            duration: 100,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
          };
          this.scene.tweens.add(tweenConfig);
          this.lastMoveTime = time;
        }
      } else if (useStateStore.getState().right) {
        if (TileTools.isTileOpenAt(this.x + tw, this.y, this.map)) {
          const tweenConfig: Types.Tweens.TweenBuilderConfig = {
            targets: this,
            x: this.x + tw,
            duration: 100,
            ease: "Linear",
            repeat: 0,
            yoyo: false,
          };
          this.scene.tweens.add(tweenConfig);
          this.lastMoveTime = time;
        }
      }
    }
  }
}
export default Player;
