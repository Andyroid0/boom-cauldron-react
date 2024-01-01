import { GameObjects, Scene, Tilemaps } from "phaser";

import EntityID from "../types/EntityID.properties.class";
import EntityStat from "../types/EntityStat.properties.class";
import PlayerDeps from "../types/PlayerDeps.dependencies.class";

interface Player extends EntityID, EntityStat, PlayerDeps {}
class Player extends GameObjects.Graphics implements Player {
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
  }

  public attack() {
    const damage = 10;
    // check area to see what the tile contains
    // enemy.takeDamage(damage);
  }

  public takeDamage() {}
}
export default Player;
