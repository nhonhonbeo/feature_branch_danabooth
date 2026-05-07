import { create } from "zustand";
import type { Category } from "@/types";

interface UIState {
  selectedCategory: Category | "all";
  searchQuery: string;
  setCategory: (c: Category | "all") => void;
  setSearch: (q: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedCategory: "all",
  searchQuery: "",
  setCategory: (selectedCategory) => set({ selectedCategory }),
  setSearch: (searchQuery) => set({ searchQuery }),
}));
