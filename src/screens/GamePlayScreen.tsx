/* eslint-disable import/order */
/* eslint-disable @shopify/strict-component-boundaries */
import "../PhaserGame";
import "../css/App.css";
import { useEffect } from "react";

import TopBar from "../components/HUD/TopBar";
import BottomBar from "../components/HUD/BottomBar";
import LoadingView from "../components/Views/LoadingView";
import PauseView from "../components/Views/PauseView";
import useStateStore from "../context/useStateStore";

import { useShallow } from "zustand/react/shallow";

const GamePlayScreen = () => {
  const { togglePause } = useStateStore(
    useShallow((state) => ({
      togglePause: state.togglePaused,
    })),
  );

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      if (event.data === "toggle-pause") {
        togglePause();
      }
    };
    window.addEventListener("message", handleEvent);
    return () => {
      window.removeEventListener("message", handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
