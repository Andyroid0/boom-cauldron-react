import { Scene } from "phaser";

export default class Bootstrap extends Scene {
  constructor() {
    super("bootstrap");
  }

  init() {}

  preload() {
    // This Loads my assets created with texture packer
    // this.load.multiatlas("tankers", "assets/tanker-game.json", "assets");
  }

  create() {
    this.createNewGame();
  }

  update() {}

  private createNewGame() {
    // this launches the game scene
    this.scene.launch("dungeon");
    // ("game");
  }
}
