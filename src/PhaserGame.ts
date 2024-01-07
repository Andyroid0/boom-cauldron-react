import Phaser from "phaser";

import Bootstrap from "./scenes/Bootstrap";
import Game from "./scenes/Game";
import DungeonScene from "./scenes/Dungeon/DungeonScene";

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
    default: "matter",
    matter: {
      gravity: { y: 0 },
      debug: {
        showBody: false,
        showStaticBody: false,
      },
    },
  },
  scene: [Bootstrap, Game, DungeonScene],
  pixelArt: true,
};
// eslint-disable-next-line import/no-anonymous-default-export
export default new Phaser.Game(config);
