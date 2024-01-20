import { Input, Scene, Types } from "phaser";

import MessageService from "../services/MessageService";
import GameState from "../types/GameState.class";

class InputManager {
  scene: Scene;
  cursors: Types.Input.Keyboard.CursorKeys | undefined;
  state: GameState;

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

  constructor(scene: Scene, state: GameState) {
    this.scene = scene;
    this.state = state;
    this.cursors = scene.input.keyboard?.createCursorKeys();
    const togglePause = () => {
      this.state.paused = !this.state.paused;
    };
    MessageService.listenForPause(togglePause);
    scene.input.keyboard?.on("keydown-ENTER", () => {
      MessageService.pause();
      togglePause();
    });
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
      MessageService.fire("player1-fire-up", 1);
    } else if (Input.Keyboard.JustDown(this.fireDown)) {
      MessageService.fire("player1-fire-down", 1);
    } else if (Input.Keyboard.JustDown(this.fireLeft)) {
      MessageService.fire("player1-fire-left", 1);
    } else if (Input.Keyboard.JustDown(this.fireRight)) {
      MessageService.fire("player1-fire-right", 1);
    }
  }
}

export default InputManager;
