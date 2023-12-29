import { Input, Scene, Types } from "phaser";

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
    if (this.cursors.left.isDown) {
      console.log("Left arrow key pressed");
    } else if (this.cursors.right.isDown) {
      console.log("Right arrow key pressed");
    } else if (this.cursors.up.isDown) {
      console.log("Up arrow key pressed");
    } else if (this.cursors.down.isDown) {
      console.log("Down arrow key pressed");
    }
  }

  handlePointerDown(pointer: Input.Pointer) {
    console.log("Pointer down at:", pointer.x, pointer.y);
    // new CustomEvent()
  }
}

export default InputManager;
