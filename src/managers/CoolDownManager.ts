import CoolDownState from "../types/CoolDownState.type";

export default class CoolDownManager {
  state: CoolDownState = "cool";
  coolDownTime: number;
  lastActionTime = 0;
  time = 0;

  constructor(coolDownTime: number) {
    this.coolDownTime = coolDownTime;
  }

  update(time: number) {
    this.time = time;
    if (this.state === "cool") return;
    if (time > this.lastActionTime + this.coolDownTime) {
      this.state = "cool";
    }
  }

  setOverHeated() {
    this.state = "overheated";
  }

  setCool() {
    this.state = "cool";
  }

  setAction() {
    this.state = "overheated";
    this.lastActionTime = this.time;
  }
}
