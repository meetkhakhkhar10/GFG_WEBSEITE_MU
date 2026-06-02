import { Outlet } from "react-router-dom";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Chatbot from "@/src/components/Chatbot";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal } from "lucide-react";
import { useTheme } from "@/src/contexts/ThemeContext";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="theme-transition min-h-screen bg-theme-bg text-theme-text selection:bg-gfg-primary selection:text-black">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-theme-bg flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-gfg-primary/10 border border-gfg-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                <Terminal className="w-12 h-12 text-gfg-primary" />
              </div>
              <div className="flex flex-col items-center">
                <motion.h1 
                  layoutId="loadingText"
                  className="text-3xl font-black tracking-tighter mb-2 text-theme-text uppercase"
                >
                  STUDENT <span className="text-gfg-primary">CHAPTER</span>
                </motion.h1>
                <div className="w-48 h-1 bg-gfg-primary/15 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-gfg-primary"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gfg-primary/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gfg-primary/3 blur-[200px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <Outlet />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
}
