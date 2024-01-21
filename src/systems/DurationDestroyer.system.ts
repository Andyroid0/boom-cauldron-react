import { Physics, Scene, Math } from "phaser";

export default class DurationDestroyer extends Scene {
  object!: Physics.Matter.Sprite;
  duration?: number;
  elapsed!: number;
  name!: string;

  constructor(scene: Scene, object: Physics.Matter.Sprite, duration?: number) {
    const name = `DurationDestroyer${Math.FloatBetween(-999, 999)}`;
    super(name);
    this.name = name;
    this.object = object;
    this.elapsed = 0;
    this.duration = duration;
    scene.scene.add(name, this, true);
  }

  update(time: number, delta: number): void {
    if (this.duration) {
      this.elapsed += delta;
      if (this.elapsed >= this.duration) {
        this.object.destroy();
        this.scene.remove(this);
      }
    }
  }
}
