// import "../PhaserGame";
import "../css/App.css";

import Phaser from "phaser";
import { useEffect } from "react";

import TopBar from "../components/HUD/TopBar";
import BottomBar from "../components/HUD/BottomBar";
import LoadingView from "../components/Views/LoadingView";
import PauseView from "../components/Views/PauseView";
import useMessageService from "../hooks/useMessageService";
import useNavService from "../hooks/useNavService";
import Bootstrap from "../scenes/Bootstrap";
import Game from "../scenes/Game";
import DungeonScene from "../scenes/Dungeon/DungeonScene";

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

const GamePlayScreen = () => {
  useMessageService();
  useNavService();
  useEffect(() => {
    if (!document.getElementById("phaser-container")?.children.length) {
      new Phaser.Game(config);
    }
  });

  return (
    <>
      <TopBar />
      <div id="phaser-container" className="App" />
      <BottomBar />
      <PauseView />
      <LoadingView />
    </>
  );
};

export default GamePlayScreen;
