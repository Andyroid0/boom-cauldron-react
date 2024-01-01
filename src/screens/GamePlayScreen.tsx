/* eslint-disable @shopify/strict-component-boundaries */
import "../PhaserGame";
import "../css/App.css";
import TopBar from "../components/HUD/TopBar";
import BottomBar from "../components/HUD/BottomBar";
import LoadingView from "../components/Views/LoadingView";

const GamePlayScreen = () => {
  return (
    <>
      <TopBar />
      <div id="phaser-container" className="App" />
      <BottomBar />
      <LoadingView />
    </>
  );
};

export default GamePlayScreen;
