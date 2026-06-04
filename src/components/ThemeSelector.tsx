import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/src/contexts/ThemeContext";
import { cn } from "@/src/lib/utils";

export default function ThemeSelector() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative rounded-full font-sans font-black tracking-[0.12em] uppercase transition-colors duration-300 shadow-inner flex items-center select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gfg-primary/50 group shrink-0",
        // Desktop
        "md:w-[176px] md:h-[52px] md:p-[6px] md:text-xs",
        // Tablet
        "sm:w-[152px] sm:h-[46px] sm:p-[4px] sm:text-[10px]",
        // Mobile
        "w-[128px] h-[38px] p-[3px] text-[9px]",
        theme === "light" 
          ? "bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB]" 
          : "bg-black text-white hover:bg-neutral-900"
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      {/* Absolute text layer to prevent movement shifts */}
      <div
        className={cn(
          "absolute inset-y-0 flex items-center justify-center transition-all duration-300 pointer-events-none font-bold uppercase",
          theme === "light"
            ? "left-0 pl-1.5 md:pl-2.5 right-[48px] md:right-[54px] sm:right-[50px]"
            : "left-[48px] md:left-[54px] sm:left-[50px] right-0 pr-1.5 md:pr-2.5"
        )}
      >
        {theme === "light" ? "DAY MODE" : "NIGHT MODE"}
      </div>

      {/* Floating active handle */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        style={{
          marginLeft: theme === "light" ? "auto" : "0px",
          marginRight: theme === "light" ? "0px" : "auto",
        }}
        className={cn(
          "rounded-full bg-white flex items-center justify-center shadow-md select-none pointer-events-none shrink-0 transition-shadow",
          // Handle Sizes matching outer container layout
          "md:w-[40px] md:h-[40px]",
          "sm:w-[38px] sm:h-[38px]",
          "w-[32px] h-[32px]",
          theme === "dark" && "border border-black"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            {theme === "light" ? (
              <Sun className="text-[#111827] stroke-[2.2] md:w-5 md:h-5 sm:w-[18px] sm:h-[18px] w-[15px] h-[15px]" />
            ) : (
              <Moon className="text-[#111827] stroke-[2.2] md:w-5 md:h-5 sm:w-[18px] sm:h-[18px] w-[15px] h-[15px]" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
