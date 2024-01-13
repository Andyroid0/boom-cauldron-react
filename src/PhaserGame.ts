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
        showBody: true,
        showStaticBody: true,
      },
    },
  },
  scene: [Bootstrap, Game, DungeonScene],
  pixelArt: true,
  roundPixels: true,
};
// export default new Phaser.Game(config);
const Start = () => new Phaser.Game(config);
export default Start;
