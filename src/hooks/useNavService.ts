import { useNavigate } from "react-router-dom";

export type NavPath = "/game" | "/";

const useNavService = () => {
  const navigate = useNavigate();
  return (path: NavPath) => {
    navigate(path);
  };
};

export default useNavService;
