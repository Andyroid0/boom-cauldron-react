/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import useStateStore from "../context/useStateStore";
import MessageServiceType from "../types/MessageServiceType.type";

const useMessageService = () => {
  const { togglePause } = useStateStore(
    useShallow((state) => ({
      togglePause: state.togglePaused,
    })),
  );

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      switch (event.data as MessageServiceType) {
        case "toggle-pause":
          togglePause();
          break;
        default:
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
