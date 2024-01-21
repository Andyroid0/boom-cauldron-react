import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppSave {
  volume: number;
  setVolume: (value: number) => void;

  sfx: number;
  setSFX: (value: number) => void;

  music: number;
  setMusic: (value: number) => void;

  brightness: number;
  setBrightness: (value: number) => void;
}

const useSaveStore = create<AppSave>()(
  persist(
    (set, get) => ({
      volume: 100,
      setVolume: (value) => {
        set({ volume: value });
      },

      sfx: 100,
      setSFX: (value) => {
        set({ sfx: value });
      },

      music: 100,
      setMusic: (value) => {
        set({ music: value });
      },

      brightness: 100,
      setBrightness: (value) => {
        set({ volume: value });
      },
    }),
    {
      name: "boom-cauldron-save-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSaveStore;
