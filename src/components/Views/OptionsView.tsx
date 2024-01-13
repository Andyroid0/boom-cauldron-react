import { FC } from "react";
import * as React from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useShallow } from "zustand/react/shallow";

// import VolumeControl from "../UI/VolumeControl";

import useStateStore from "../../context/useStateStore";

// const [value, setValue] = React.useState<number>(30);

interface OptionsViewProps {}

const OptionsView: FC<OptionsViewProps> = (props) => {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;

  const { paused, pause } = useStateStore(
    useShallow((state) => ({
      paused: state.paused,
      pause: state.togglePaused,
    })),
  );

  const handleClose = () => {
    pause();
  };

  const _title = "Options Menu";
  const _volume = "Volume";
  const _sfx = "SFX";
  const _music = "Music";
  const _brightness = "Brightness";
  const _closeButton = "Close";

  return (
    <Dialog
      open={paused}
      keepMounted
      onClose={handleClose}
      aria-describedby="Pause Menu"
    >
      <DialogTitle>{_title}</DialogTitle>
      <DialogContent>
        <Button onClick={handleClose}>{_closeButton}</Button>
      </DialogContent>
    </Dialog>
  );
};

export default OptionsView;
