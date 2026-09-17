import { Outlet } from "react-router-dom";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Chatbot from "@/src/components/Chatbot";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Layout() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111318] relative selection:bg-[#00A86B] selection:text-white">
      {/* Paper film grain overlay */}
      <div className="paper-grain" />

      {/* Architectural grid lines background */}
      <div className="fixed inset-0 z-0 bg-technical-grid opacity-75 pointer-events-none" />

      {/* Subtle paper vignette */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,transparent_60%,rgba(17,19,24,0.03)_100%)]" />

      {/* Minimal Editorial Initial Loader */}
      <AnimatePresence>
        {initialLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#F4F4F0] flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center space-y-4">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8B9198]">
                GeeksforGeeks × Marwadi University
              </span>
              <div className="font-editorial italic text-3xl font-light tracking-tight text-[#111318]">
                Developer Culture
              </div>
              <div className="w-32 h-[1px] bg-[#E2E2DC] relative overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-full h-full bg-[#00A86B]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-18">
          <Outlet />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
}
