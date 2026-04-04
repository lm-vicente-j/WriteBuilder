import { create } from "zustand";

interface UIStore {
  showNumbering: boolean;
  setShowNumbering: (val: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  showNumbering: false,
  setShowNumbering: (val) => set({ showNumbering: val }),
}));