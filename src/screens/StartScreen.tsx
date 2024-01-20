import { Button, Typography } from "@mui/material";

import useNavService from "../hooks/useNavService";
import Background from "../components/Background";
import MessageService from "../services/MessageService";

const StartScreen = () => {
  const _start = "Start";
  useNavService();

  return (
    <Background>
      <Button onClick={() => MessageService.navigateScreen("/game")}>
        <Typography
          variant="h3"
          sx={{
            color: "rgb(225, 225, 225)",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ":hover": {
              color: "#85f2d0",
            },
          }}
          textAlign="center"
        >
          {_start}
        </Typography>
      </Button>
    </Background>
  );
};

export default StartScreen;
