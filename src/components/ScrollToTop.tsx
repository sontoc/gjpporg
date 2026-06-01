import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Track page scroll to show/hide the button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          id="scroll-to-top-button"
          aria-label="맨 위로 이동"
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/80 backdrop-blur-md hover:bg-accent hover:text-white text-accent rounded-full border border-slate-800 hover:border-accent hover:scale-105 active:scale-95 shadow-2xl shadow-black/40 transition-all duration-300 group select-none cursor-pointer"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-0.5 transition-transform duration-300" />
          <span className="text-[9px] font-bold uppercase tracking-wider -mt-0.5 group-hover:text-white">TOP</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
