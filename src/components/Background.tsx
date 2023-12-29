import { FC, ReactNode } from "react";
import { Box } from "@mui/material";

interface BackgroundProps {
  children: ReactNode;
}

const Background: FC<BackgroundProps> = (props) => {
  const { children } = props;
  return (
    <Box
      sx={{
        backgroundColor: "#282c34",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
};

export default Background;
