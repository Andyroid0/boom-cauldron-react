import { FC } from "react";
import { AppBar, Box, LinearProgress } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useShallow } from "zustand/react/shallow";

import useStateStore from "../../context/useStateStore";

interface TopBarProps {}

const TopBar: FC<TopBarProps> = (props) => {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;
  const { playerHealth } = useStateStore(
    useShallow((state) => ({
      playerHealth: state.playerHealth,
    })),
  );
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "rgba(0,0,0,0)", boxShadow: 0 }}
    >
      <Box display="flex" justifyContent="row" alignItems="center">
        <FavoriteIcon
          sx={{
            margin: 2,
          }}
        />
        <LinearProgress
          variant="determinate"
          value={playerHealth * 10}
          sx={{
            width: "200px",
            height: "8px",
            borderColor: "white",
            borderWidth: "2px",
            borderStyle: "solid",
            backgroundColor: "white",
          }}
          color="error"
        />
      </Box>
    </AppBar>
  );
};

export default TopBar;
