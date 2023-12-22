import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {}

  preload() {
    this.load.image("bush", "img/bush_1.png");
  }

  create() {
    const img = this.add.image(80, 80, "bush");
    img.scale = 20;
  }

  update() {}
}
