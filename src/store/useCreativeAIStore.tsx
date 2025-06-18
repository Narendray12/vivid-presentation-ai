import { OutlineCard } from "@/lib/types";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

type CreativeAIStore = {
  outlines: OutlineCard[] | [];
  addMultipleOutlines: (outlines: OutlineCard[]) => void;
  addOutline: (outline: OutlineCard) => void;
  currentAiPrompt: string;
  setCurrentAiPrompt: (prompt: string) => void;
  resetOutlines: () => void;
};

const useCreativeAIStore = create<CreativeAIStore>()(
  persist(
    (set) => ({
      outlines: [],
      addOutline: (outline: OutlineCard) => {
        set((state) => ({
          outlines: [outline, ...state.outlines],
        }));
      },
      addMultipleOutlines: (outlines: OutlineCard[]) => {
        set(() => ({ outlines: [...outlines] }));
      },
      currentAiPrompt: "",
      setCurrentAiPrompt: (prompt: string) => {
        set(() => ({ currentAiPrompt: prompt }));
      },
      resetOutlines: () => {
        set(() => ({ outlines: [] }));
      },
    }),
    {
      name: "creative-ai",
    }
  )
);

export default useCreativeAIStore;
