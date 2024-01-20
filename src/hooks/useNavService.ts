import { useNavigate } from "react-router-dom";

import MessageService from "../services/MessageService";
import NavPath from "../types/NavPath.type";
import MessageServiceNavigateToScreen from "../types/MessageServiceNavigateToScreen.interface";

const useNavService = () => {
  const navigate = useNavigate();
  MessageService.useNavigate((data: MessageServiceNavigateToScreen) => {
    navigate(data.screen);
  });

  return (path: NavPath) => {
    navigate(path);
  };
};

export default useNavService;
