import { Input, Scene, Types } from "phaser";

import useStateStore from "../context/useStateStore";
import MessageService from "../services/MessageService";

class InputManager {
  scene: Scene;
  cursors: Types.Input.Keyboard.CursorKeys | undefined;
  fireUp: Input.Keyboard.Key;
  fireDown: Input.Keyboard.Key;
  fireLeft: Input.Keyboard.Key;
  fireRight: Input.Keyboard.Key;

  constructor(scene: Scene) {
    this.scene = scene;
    this.cursors = scene.input.keyboard?.createCursorKeys();
    scene.input.on("pointerdown", this.handlePointerDown, this);
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
    if (this.cursors.left.isDown && !useStateStore.getState().left) {
      MessageService.send("toggle-left");
    } else if (this.cursors.right.isDown && !useStateStore.getState().right) {
      MessageService.send("toggle-right");
    } else if (this.cursors.up.isDown && !useStateStore.getState().up) {
      MessageService.send("toggle-up");
    } else if (this.cursors.down.isDown && !useStateStore.getState().down) {
      MessageService.send("toggle-down");
    } else if (this.cursors.left.isUp && useStateStore.getState().left) {
      MessageService.send("toggle-left");
    } else if (this.cursors.right.isUp && useStateStore.getState().right) {
      MessageService.send("toggle-right");
    } else if (this.cursors.up.isUp && useStateStore.getState().up) {
      MessageService.send("toggle-up");
    } else if (this.cursors.down.isUp && useStateStore.getState().down) {
      MessageService.send("toggle-down");
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

  handlePointerDown(pointer: Input.Pointer) {
    console.log("Pointer down at:", pointer.x, pointer.y);
    // new CustomEvent()
  }
}

export default InputManager;
