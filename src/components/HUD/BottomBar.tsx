import { FC } from "react";
import { AppBar } from "@mui/material";
import HandymanIcon from "@mui/icons-material/Handyman";

interface TopBarProps {}

const BottomBar: FC<TopBarProps> = (props) => {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;

  return (
    <AppBar
      position="fixed"
      sx={{
        top: "auto",
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0)",
        boxShadow: 0,
      }}
    >
      <HandymanIcon sx={{ margin: 2 }} />
    </AppBar>
  );
};

export default BottomBar;
