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

  up: boolean;
  toggleUp: () => void;

  down: boolean;
  toggleDown: () => void;

  left: boolean;
  toggleLeft: () => void;

  right: boolean;
  toggleRight: () => void;

  grab: boolean;
  toggleGrab: () => void;
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

      up: false,
      toggleUp: () => {
        set({ up: !get().up });
      },

      down: false,
      toggleDown: () => {
        set({ down: !get().down });
      },

      left: false,
      toggleLeft: () => {
        set({ left: !get().left });
      },

      right: false,
      toggleRight: () => {
        set({ right: !get().right });
      },

      grab: false,
      toggleGrab: () => {
        set({ grab: !get().grab });
      },
    }),
    {
      name: "boom-cauldron-state-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useStateStore;
