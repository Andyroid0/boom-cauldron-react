import "../PhaserGame";
import "../css/App.css";

import TopBar from "../components/HUD/TopBar";
import BottomBar from "../components/HUD/BottomBar";
import LoadingView from "../components/Views/LoadingView";
import PauseView from "../components/Views/PauseView";
import useMessageService from "../hooks/useMessageService";

const GamePlayScreen = () => {
  useMessageService();

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
