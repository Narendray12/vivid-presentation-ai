import { Slide, Theme } from "@/lib/types";
import { Projects } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface SlideState{
    slides:Slide[]
    setSlides:(slides:Slide[])=>void
    setProjects:(projects:Projects[])=>void
    projects:Projects[]
    currentTheme:Theme
    setCurrentTheme:(theme:Theme)=>void
}

const defaultTheme:Theme={
    name:'Default',
    fontFamily:'"Inter", sans-serif',
    fontColor:'#333333',
    backgroundColor:'#f0f0f0',
    slideBackgroundColor:'#ffffff',
    accentColor:'#3b82f6',
    type:'light'
}

export const useSlideStore = create(
    persist<SlideState>(
        (set) => ({
            slides:[],
            setSlides:(slides:Slide[])=>set({slides}),
            projects:[],
            setProjects:(projects:Projects[])=>set({projects}),
            currentTheme:defaultTheme,
            setCurrentTheme:(theme:Theme)=>set({currentTheme:theme})    
        }),
        {
            name: "slides",
        }
    )
)