/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import useStateStore from "../context/useStateStore";
import MessageServiceType from "../types/MessageServiceType.type";

const useMessageService = () => {
  const {
    togglePause,
    toggleUp,
    toggleDown,
    toggleLeft,
    toggleRight,
    toggleGrab,
  } = useStateStore(
    useShallow((state) => ({
      togglePause: state.togglePaused,
      toggleLeft: state.toggleLeft,
      toggleRight: state.toggleRight,
      toggleUp: state.toggleUp,
      toggleDown: state.toggleDown,
      toggleGrab: state.toggleGrab,
    })),
  );

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      switch (event.data as MessageServiceType) {
        case "toggle-pause":
          togglePause();
          break;
        case "toggle-left":
          toggleLeft();
          break;
        case "toggle-right":
          toggleRight();
          break;
        case "toggle-up":
          toggleUp();
          break;
        case "toggle-down":
          toggleDown();
          break;
        case "toggle-grab":
          toggleGrab();
          break;
      }
    };
    window.addEventListener("message", handleEvent);
    return () => {
      window.removeEventListener("message", handleEvent);
    };
  }, []);
};

export default useMessageService;
