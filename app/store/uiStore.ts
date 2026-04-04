import { create } from "zustand";

interface UIStore {
  showNumbering: boolean;
  snapToGrid: boolean;
  setSnapToGrid: (val: boolean) => void;
  setShowNumbering: (val: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  showNumbering: false,
  snapToGrid: false,
  setSnapToGrid: (val) => set({snapToGrid: val}),
  setShowNumbering: (val) => set({ showNumbering: val }),
}));