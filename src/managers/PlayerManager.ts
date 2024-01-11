import { Physics, Scene, Tilemaps } from "phaser";
import { Room } from "@mikewesthad/dungeon";

import Player from "../entities/Player.entity.class";
import PlayerDeps from "../types/PlayerDeps.dependencies.class";

import InputManager from "./InputManager";

interface PlayerManager extends PlayerDeps {}
class PlayerManager implements PlayerManager {
  pool: Player[] = [];
  scene!: Scene;
  inputManager: InputManager;
  constructor(
    map: Tilemaps.Tilemap,
    scene: Scene,
    layer: Tilemaps.TilemapLayer,
    world: Physics.Matter.World,
    inputManager: InputManager,
  ) {
    this.scene = scene;
    this.map = map;
    this.layer = layer;
    this.world = world;
    this.inputManager = inputManager;
  }

  create(room: Room, coordX: number, coordY: number) {
    if (!this.map || !this.layer || !this.world) return;
    const player = new Player(
      this.map,
      this.scene,
      this.layer,
      this.world,
      this.inputManager,
    );
    this.pool.push(player);
    player.x = this.map.tileToWorldX(room.x + coordX) as number;
    player.y = this.map.tileToWorldY(room.y + coordY) as number;
    return player;
  }

  player1() {
    return this.pool[0];
  }
}

export default PlayerManager;
