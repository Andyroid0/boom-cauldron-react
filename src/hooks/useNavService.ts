import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import NavPath from "../types/NavPath.type";
import MessageServiceNavigateToScreen from "../types/MessageServiceNavigateToScreen.interface";

const useNavService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      const data = event.data as MessageServiceNavigateToScreen;
      switch (data.type) {
        case "navigate-screen":
          navigate(data.screen);
          break;
      }
    };
    window.addEventListener("message", handleEvent);
    return () => window.removeEventListener("message", handleEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (path: NavPath) => {
    navigate(path);
  };
};

export default useNavService;
