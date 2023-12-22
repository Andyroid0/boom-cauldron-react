import Phaser from "phaser";

import Bootstrap from "./scenes/Bootstrap";
import Game from "./scenes/Game";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#282c34",
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [Bootstrap, Game],
  pixelArt: true,
};
// eslint-disable-next-line import/no-anonymous-default-export
export default new Phaser.Game(config);
