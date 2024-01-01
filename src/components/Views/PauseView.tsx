import { FC } from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useShallow } from "zustand/react/shallow";

import useStateStore from "../../context/useStateStore";

interface PauseViewProps {}

const PauseView: FC<PauseViewProps> = (props) => {
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

  const _title = "Pause Menu";
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

export default PauseView;
