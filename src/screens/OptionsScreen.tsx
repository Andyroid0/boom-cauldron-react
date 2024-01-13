import { Button, Typography } from "@mui/material";

import useNavService from "../hooks/useNavService";
import Background from "../components/Background";

const OptionsScreen = () => {
  const _options = "Options";
  const goTo = useNavService();

  const handleClick = () => {
    goTo("/");
  };
  return (
    <Background>
      <Button onClick={handleClick}>
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
