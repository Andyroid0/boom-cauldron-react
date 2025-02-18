import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;

  debug: boolean;
  setDebug: (value: boolean) => void;

  showCamGUI: boolean;
  setShowCamGUI: (value: boolean) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  paused: boolean;
  togglePaused: () => void;

  playerHealth: number;
  setPlayerHealth: (value: number) => void;
}

const useStateStore = create<AppState>()(
  persist(
    (set, get) => ({
      authenticated: false,
      setAuthenticated: (value) => {
        set({ authenticated: value });
      },

      debug: false,
      setDebug: (value) => {
        set({ debug: value });
      },

      showCamGUI: false,
      setShowCamGUI: (value) => {
        set({ showCamGUI: value });
      },

      loading: false,
      setLoading: (value) => {
        set({ loading: value });
      },

      paused: false,
      togglePaused: () => {
        set({ paused: !get().paused });
      },

      playerHealth: 10,
      setPlayerHealth: (value) => {
        set({ playerHealth: value });
      },
    }),
    {
      name: "boom-cauldron-state-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useStateStore;
