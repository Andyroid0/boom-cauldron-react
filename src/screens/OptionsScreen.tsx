import { Button, Typography } from "@mui/material";

import MessageService from "../services/MessageService";
import useNavService from "../hooks/useNavService";
import Background from "../components/Background";

const OptionsScreen = () => {
  const _options = "Options";
  useNavService();

  return (
    <Background>
      <Button onClick={() => MessageService.navigateScreen("/")}>
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
          {_options}
        </Typography>
      </Button>
    </Background>
  );
};

export default OptionsScreen;
