import { OutlineCard } from "@/lib/types";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
type OutlineStore = {
    outlines: OutlineCard[]
    addOutline: (outline: OutlineCard) => void;
    resetOutlines: () => void;
    addMultipleOutlines: (outlines: OutlineCard[]) => void;
};
const useScratchStore = create<OutlineStore>()(
    devtools(
        persist(
            (set) => ({
                outlines: [],
                addOutline: (outline: OutlineCard) => {
                    set((state) => ({
                        outlines: [outline, ...state.outlines],
                    }));
                },
                resetOutlines: () => {
                    set(() => ({ outlines: [] }));
                },
                addMultipleOutlines: (outlines: OutlineCard[]) => {
                    set(() => ({ outlines: [...outlines] }));
                },
            }),
            { name: "scratch" }
        )
    )
);

export default useScratchStore;