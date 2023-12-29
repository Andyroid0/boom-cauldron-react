import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {}

const useSaveStore = create<AppState>()(
  persist((set, get) => ({}), {
    name: "boom-cauldron-save-storage",
    storage: createJSONStorage(() => localStorage),
  }),
);

export default useSaveStore;
