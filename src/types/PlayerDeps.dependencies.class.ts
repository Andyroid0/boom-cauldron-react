import { Physics, Tilemaps } from "phaser";

class PlayerDeps {
  map: Tilemaps.Tilemap | undefined;
  layer: Tilemaps.TilemapLayer | undefined;
  world: Physics.Matter.World | undefined;
}
export default PlayerDeps;
