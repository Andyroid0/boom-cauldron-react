import { Input, Scene, Types } from "phaser";

import useStateStore from "../context/useStateStore";
import MessageService from "../services/MessageService";

class InputManager {
  scene: Scene;
  cursors: Types.Input.Keyboard.CursorKeys | undefined;

  constructor(scene: Scene) {
    this.scene = scene;
    this.cursors = scene.input.keyboard?.createCursorKeys();
    scene.input.on("pointerdown", this.handlePointerDown, this);
  }

  update() {
    if (!this.cursors) return;
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
  }

  handlePointerDown(pointer: Input.Pointer) {
    console.log("Pointer down at:", pointer.x, pointer.y);
    // new CustomEvent()
  }
}

export default InputManager;
