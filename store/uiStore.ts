import { create } from "zustand";

interface UIStore {

  // Node editor
  gridColor: string;
  canvasColor: string;
  snapToGrid: boolean;
  setCanvasColor: (val: string) => void;
  setGridColor: (val: string) => void;
  setSnapToGrid: (val: boolean) => void;


  // Writting editor
  showNumbering: boolean;
  setShowNumbering: (val: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  canvasColor: "#050505",
  gridColor: "#262626",
  showNumbering: false,
  snapToGrid: true,
  setCanvasColor: (val) => set({canvasColor: val}),
  setGridColor: (val) => set({gridColor: val}),
  setSnapToGrid: (val) => set({snapToGrid: val}),
  setShowNumbering: (val) => set({ showNumbering: val }),
}));