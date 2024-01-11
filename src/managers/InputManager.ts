import { Input, Scene, Types } from "phaser";

import MessageService from "../services/MessageService";

class InputManager {
  scene: Scene;
  cursors: Types.Input.Keyboard.CursorKeys | undefined;
  fireUp: Input.Keyboard.Key;
  fireDown: Input.Keyboard.Key;
  fireLeft: Input.Keyboard.Key;
  fireRight: Input.Keyboard.Key;

  left = false;
  right = false;
  up = false;
  down = false;

  upLeft = false;
  upRight = false;
  downLeft = false;
  downRight = false;

  constructor(scene: Scene) {
    this.scene = scene;
    this.cursors = scene.input.keyboard?.createCursorKeys();
    scene.input.keyboard?.on("keydown-ENTER", () =>
      window.postMessage("toggle-pause"),
    );
    this.fireUp = this.scene.input.keyboard?.addKey(
      Input.Keyboard.KeyCodes.W,
    ) as Input.Keyboard.Key;
    this.fireDown = this.scene.input.keyboard?.addKey(
      Input.Keyboard.KeyCodes.S,
    ) as Input.Keyboard.Key;
    this.fireLeft = this.scene.input.keyboard?.addKey(
      Input.Keyboard.KeyCodes.A,
    ) as Input.Keyboard.Key;
    this.fireRight = this.scene.input.keyboard?.addKey(
      Input.Keyboard.KeyCodes.D,
    ) as Input.Keyboard.Key;
  }

  update() {
    if (!this.cursors || !this.scene) return;
    // interact with using the Message Service.
    if (this.cursors.left.isDown && !this.left) {
      this.left = true;
    } else if (this.cursors.right.isDown && !this.right) {
      this.right = true;
    } else if (this.cursors.up.isDown && !this.up) {
      this.up = true;
    } else if (this.cursors.down.isDown && !this.down) {
      this.down = true;
    } else if (this.cursors.left.isUp && this.left) {
      this.left = false;
    } else if (this.cursors.right.isUp && this.right) {
      this.right = false;
    } else if (this.cursors.up.isUp && this.up) {
      this.up = false;
    } else if (this.cursors.down.isUp && this.down) {
      this.down = false;
    }

    if (Input.Keyboard.JustDown(this.fireUp)) {
      MessageService.sendWithAmount({ type: "player1-fire-up", amount: 1 });
    } else if (Input.Keyboard.JustDown(this.fireDown)) {
      MessageService.sendWithAmount({ type: "player1-fire-down", amount: 1 });
    } else if (Input.Keyboard.JustDown(this.fireLeft)) {
      MessageService.sendWithAmount({ type: "player1-fire-left", amount: 1 });
    } else if (Input.Keyboard.JustDown(this.fireRight)) {
      MessageService.sendWithAmount({ type: "player1-fire-right", amount: 1 });
    }
  }
}

export default InputManager;
