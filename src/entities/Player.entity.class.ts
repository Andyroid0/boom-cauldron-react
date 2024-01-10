import { GameObjects, Scene, Tilemaps, Types } from "phaser";

import EntityID from "../types/EntityID.properties.class";
import EntityStat from "../types/EntityStat.properties.class";
import PlayerDeps from "../types/PlayerDeps.dependencies.class";
import TileTools from "../utils/TileTools";
import useStateStore from "../context/useStateStore";
import GameOverScreen from "../screens/GameOverScreen";

interface Player extends EntityID, EntityStat, PlayerDeps {}
class Player extends GameObjects.Graphics implements Player {
  lastMoveTime = 0;
  health = 10;

  constructor(
    map: Tilemaps.Tilemap,
    scene: Scene,
    layer: Tilemaps.TilemapLayer,
  ) {
    super(scene);
    this.map = map;
    this.scene = scene;
    this.layer = layer;

    this.fillStyle(0xedca40, 1);
    this.fillRect(
      0,
      0,
      this.map.tileWidth * this.layer.scaleX,
      this.map.tileHeight * this.layer.scaleY,
    );
    scene.add.existing(this);
    useStateStore.getState().setPlayerHealth(this.health);
  }

  public attack(dmg = 1) {
    // check area to see what the tile contains
    // enemy.takeDamage(damage);
  }

  public takeDamage(dmg = 1) {
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
