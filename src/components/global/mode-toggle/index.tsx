'use client';
import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
const ThemeSwiter = () => {
    const [mounted, setMounted] = React.useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(()=>{
        setMounted(true)
    },[])
    if(!mounted){
        return null
    }
  return (
    <div>
        <Switch checked={theme === "light"}
        className="h-10 w-20 pl-1 data-[state=checked]:bg-primary-80 "
        area-label="Toggle dark mode"
        onCheckedChange={()=>{
            setTheme(theme=='dark'?'light':'dark')
        }}
        >
           
        </Switch>
    </div>
  )
  }

export default ThemeSwiter;