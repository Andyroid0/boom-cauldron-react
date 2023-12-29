import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

const useStateStore = create<AppState>()(
  persist(
    (set, get) => ({
      authenticated: false,
      setAuthenticated: (value) => {
        set({ authenticated: value });
      },
    }),
    {
      name: "boom-cauldron-state-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useStateStore;
