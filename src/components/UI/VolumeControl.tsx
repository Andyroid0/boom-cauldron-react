import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { useShallow } from "zustand/react/shallow";

import useSaveStore from "../../context/useSaveStore";

export default function ContinuousSlider() {
  const {
    volume,
    setVolume,
    SFX,
    setSFX,
    music,
    setMusic,
    brightness,
    setBrightness,
  } = useSaveStore(
    useShallow((state) => ({
      volume: state.volume,
      setVolume: state.setVolume,
      SFX: state.sfx,
      setSFX: state.setSFX,
      music: state.music,
      setMusic: state.setMusic,
      brightness: state.brightness,
      setBrightness: state.setBrightness,
    })),
  );

  const handleChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    setSFX(newValue as number);
    setMusic(newValue as number);
    setBrightness(newValue as number);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        <Slider aria-label="Volume" value={volume} onChange={handleChange} />
        <VolumeUp />
      </Stack>
      <Slider disabled defaultValue={30} aria-label="Disabled slider" />
    </Box>
  );
}
