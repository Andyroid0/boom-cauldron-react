import { Physics, Scene, Tilemaps } from "phaser";
import InputManager from "../managers/InputManager";

export default interface PlayerDependencies {
  map: Tilemaps.Tilemap;
  layer: Tilemaps.TilemapLayer;
  world: Physics.Matter.World;
  inputManager: InputManager;
  scene: Scene;
}
