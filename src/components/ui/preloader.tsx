import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const words = [
  "Hello",
  "नमस्ते",
  "నమస్తే",
  "Bonjour",
  "Ciao",
  "Olà",
  "やあ",
  "Hallå",
  "Guten tag",
  "হ্য়াল্লো",
];

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index === words.length - 1) {
      setTimeout(() => {
        setIsActive(false);
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }, 1000);
      return;
    }

    const timer = setTimeout(
      () => {
        setIndex(index + 1);
      },
      index === 0 ? 1000 : 150
    );

    return () => clearTimeout(timer);
  }, [index, onComplete]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curveInitial = {
    d: initialPath,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
  };

  const curveExit = {
    d: targetPath,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
  };

  return (
    <motion.div
      initial={{ y: 0 } as any}
      animate={isActive ? ({ y: 0 } as any) : ({ y: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } } as any)}
      className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-[#141516] z-[99999999999]"
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            initial={{ opacity: 0 } as any}
            animate={{ opacity: 0.75, transition: { duration: 1, delay: 0.2 } } as any}
            className="flex items-center text-white text-4xl md:text-5xl lg:text-6xl absolute z-10 font-medium"
          >
            <span className="block w-2.5 h-2.5 bg-white rounded-full mr-2.5" />
            {words[index]}
          </motion.p>
          <svg className="absolute top-0 w-full h-[calc(100%+300px)]">
            <motion.path
              initial={curveInitial as any}
              animate={(isActive ? curveInitial : curveExit) as any}
              fill="#141516"
            />
          </svg>
        </>
      )}
    </motion.div>
  );
}
