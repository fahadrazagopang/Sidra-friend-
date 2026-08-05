import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Heart, 
  Search, 
  Sparkles, 
  Laugh, 
  Smile, 
  PartyPopper,
  X,
  HeartHandshake
} from "lucide-react";

// Types for floating background items
interface FloatingItem {
  id: number;
  type: "heart" | "glass" | "ring";
  x: number; // percentage width
  size: number; // pixels
  delay: number; // seconds
  duration: number; // seconds
  opacity: number;
}

export default function App() {
  const [particles, setParticles] = useState<FloatingItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [successClicks, setSuccessClicks] = useState(0);
  
  // Position state for the escaping "Nahi" button
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0, isMoved: false });
  // Escape count for funny messaging
  const [escapeCount, setEscapeCount] = useState(0);

  // Initialize floating hearts, rings and magnifying glasses
  useEffect(() => {
    const items: FloatingItem[] = [];
    for (let i = 0; i < 30; i++) {
      items.push({
        id: i,
        type: i % 4 === 0 ? "glass" : i % 5 === 0 ? "ring" : "heart",
        x: Math.random() * 100,
        size: Math.random() * (38 - 16) + 16,
        delay: Math.random() * 8,
        duration: Math.random() * (12 - 5) + 5,
        opacity: Math.random() * (0.6 - 0.2) + 0.2,
      });
    }
    setParticles(items);
  }, []);

  // Runaway logic: Calculates a distant coordinate relative to mouse/touch coordinates
  const handleNoButtonEscape = (e?: React.MouseEvent | React.TouchEvent) => {
    const btnWidth = 120;
    const btnHeight = 50;
    
    // Total space minus safe margins
    const maxWidth = window.innerWidth - btnWidth - 30;
    const maxHeight = window.innerHeight - btnHeight - 30;

    let refX = window.innerWidth / 2;
    let refY = window.innerHeight / 2;

    if (e) {
      if ("touches" in e && e.touches.length > 0) {
        refX = e.touches[0].clientX;
        refY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        refX = e.clientX;
        refY = e.clientY;
      }
    }

    let bestX = Math.random() * maxWidth;
    let bestY = Math.random() * maxHeight;
    let maxDistance = -1;

    for (let i = 0; i < 8; i++) {
      const candidateX = Math.random() * maxWidth;
      const candidateY = Math.random() * maxHeight;
      const distance = Math.hypot(candidateX - refX, candidateY - refY);
      
      if (distance > maxDistance) {
        maxDistance = distance;
        bestX = candidateX;
        bestY = candidateY;
      }
    }

    setNoBtnPos({
      x: Math.max(20, bestX),
      y: Math.max(20, bestY),
      isMoved: true
    });
    setEscapeCount(prev => prev + 1);
  };

  const handleYesClick = () => {
    setShowModal(true);
    setSuccessClicks(prev => prev + 1);
  };

  const resetNoButton = () => {
    setNoBtnPos({ x: 0, y: 0, isMoved: false });
    setEscapeCount(0);
  };

  // Fun helper message depending on how many times "Nahi" escaped
  const getEscapeMessage = () => {
    if (escapeCount === 0) return "Daba do 'Qabool Hai' bina sharmaye! 😉";
    if (escapeCount < 3) return "Arrey Tooba? 'Nahi' wala button toh bhaag raha hai! 😂";
    if (escapeCount < 7) return "Jitni marzi koshish karlo Tooba Khojhi, 'Nahi' toh touch nahi hoga! 🔍😜";
    if (escapeCount < 12) return "Aray yaar! Abhi tak koshish kar rahi ho? Sachi me KHOJHI ho tum! 🕵️‍♀️";
    return "Bas karo Tooba Khojhi, 'Qabool Hai' daba do chup chap! Hahaha 😂❤️";
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-500 via-rose-600 to-amber-600 flex flex-col items-center justify-center p-4 font-sans selection:bg-rose-300 selection:text-rose-900">
      
      {/* Animated Gradient / Ambient Background Glows */}
      <div className="absolute top-10 left-10 text-pink-200/20 pointer-events-none select-none text-[8rem]" id="large-heart-1">&hearts;</div>
      <div className="absolute bottom-10 right-10 text-pink-200/20 pointer-events-none select-none text-[10rem]" id="large-heart-2">&hearts;</div>
      <div className="absolute top-1/4 right-1/4 text-pink-200/10 pointer-events-none select-none text-[5rem]" id="large-heart-3">&hearts;</div>
      <div className="absolute bottom-1/4 left-1/4 text-pink-200/10 pointer-events-none select-none text-[6rem]" id="large-heart-4">&hearts;</div>

      {/* Background Floating Elements Layer */}
      <div className="absolute inset-0 pointer-events-none" id="floating-canvas">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "110vh", x: `${p.x}vw`, rotate: 0 }}
            animate={{ 
              y: "-20vh", 
              rotate: 360,
              x: [`${p.x}vw`, `${p.x + (p.id % 2 === 0 ? 6 : -6)}vw`, `${p.x}vw`]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
            style={{ 
              position: "absolute", 
              width: p.size, 
              height: p.size, 
              opacity: p.opacity,
              color: p.type === "glass" ? "#fef08a" : p.type === "ring" ? "#fde047" : "#ffe4e6"
            }}
          >
            {p.type === "heart" ? (
              <Heart className="w-full h-full fill-current drop-shadow-md" />
            ) : p.type === "glass" ? (
              <Search className="w-full h-full stroke-[2.5]" />
            ) : (
              <span className="text-xl">💍</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Reset button if 'Nahi' ran away */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {escapeCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={resetNoButton}
            className="px-3.5 py-1.5 text-xs rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white border border-white/20 transition cursor-pointer flex items-center gap-1 font-mono shadow-sm"
            id="reset-btn"
          >
            Reset Button 🔄
          </motion.button>
        )}
      </div>

      {/* Main Glassmorphic Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl bg-white/15 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.25)] text-center flex flex-col items-center overflow-hidden"
        id="card-container"
      >
        {/* Special Proposal Badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold uppercase tracking-wider shadow-inner" id="proposal-badge">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
          Special Rishta Proposal 💍
        </div>

        {/* Header Heading: Tooba ❤️ Fahad */}
        <div className="mb-6 relative w-full" id="name-wrapper">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-2xl flex items-center justify-center gap-2 sm:gap-3">
            <span>Tooba</span>
            <span className="text-red-300 animate-pulse text-3xl sm:text-5xl">❤️</span>
            <span>Fahad</span>
          </h1>
          
          {/* Prominent Nickname "Tooba Khojhi" */}
          <div className="mt-3 inline-block bg-amber-200/90 text-rose-950 font-mono font-bold text-sm md:text-base px-4 py-1.5 rounded-full shadow-lg border border-yellow-300 transform -rotate-1 hover:rotate-0 transition-transform" id="nickname-badge">
            "Tooba Khojhi" 😜
          </div>
        </div>

        {/* Message Card */}
        <div className="w-full my-4 py-6 px-4 bg-white/10 rounded-2xl border border-white/20 relative select-none" id="core-message-box">
          <div className="absolute top-2 left-2 text-pink-200/30"><Heart className="w-5 h-5 fill-current" /></div>
          <div className="absolute bottom-2 right-2 text-pink-200/30"><Heart className="w-5 h-5 fill-current" /></div>

          <p className="text-lg md:text-2xl text-white font-bold leading-relaxed tracking-wide">
            Sunno Tooba! Tum sirf meri sachi aur achi <span className="text-yellow-300 underline decoration-yellow-300 decoration-wavy decoration-2 underline-offset-4">DOST</span> ho, par ab Fahad tum se <span className="text-yellow-200 underline font-black">Nikkah</span> karna chahta hai! 💍
          </p>
        </div>

        {/* Dynamic Escape Status Message */}
        <div className="h-6 mb-3 flex items-center justify-center">
          <p className="text-xs text-yellow-300 font-mono tracking-tight text-center bg-rose-950/40 px-3.5 py-1 rounded-full border border-yellow-300/20">
            {getEscapeMessage()}
          </p>
        </div>

        {/* Interactive Question Section */}
        <div className="w-full rounded-2xl mb-2 relative" id="question-box">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-6 text-pink-100 drop-shadow-md">
            Kya tumhen Fahad se Nikkah Qabool Hai? 🙈
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 min-h-[80px] relative w-full" id="button-row">
            {/* "Qabool Hai! ❤️" Button */}
            <motion.button
              whileHover={{ scale: 1.1, shadow: "0px 10px 25px rgba(255,255,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleYesClick}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full text-xl sm:text-2xl font-black shadow-xl transition-all transform cursor-pointer flex items-center justify-center gap-2 border-2 border-emerald-300 tracking-wide"
              id="yes-btn"
            >
              <Smile className="w-6 h-6 fill-current text-white" />
              Qabool Hai! ❤️
            </motion.button>

            {/* Runaway "Nahi 😜" Button */}
            <motion.button
              style={noBtnPos.isMoved ? {
                position: "fixed",
                left: `${noBtnPos.x}px`,
                top: `${noBtnPos.y}px`,
                zIndex: 9999,
              } : {
                position: "relative",
              }}
              animate={noBtnPos.isMoved ? { scale: [1, 1.05, 1] } : {}}
              onMouseEnter={() => handleNoButtonEscape()}
              onTouchStart={(e) => {
                e.preventDefault();
                handleNoButtonEscape(e);
              }}
              onClick={() => handleNoButtonEscape()}
              className="bg-rose-800/80 hover:bg-rose-900/90 text-white px-10 py-4 rounded-full text-xl sm:text-2xl font-bold shadow-lg border border-white/30 transition-all duration-75 select-none whitespace-nowrap cursor-pointer touch-none flex items-center justify-center gap-2"
              id="no-btn"
            >
              <Laugh className="w-6 h-6" />
              Nahi 😜
            </motion.button>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-8 text-xs text-rose-100/70 flex flex-col items-center gap-1 font-mono" id="card-footers">
          <span>Banaya gaya hai khaas Tooba Khojhi ke liye ❤️</span>
          {escapeCount > 0 && (
            <span className="text-yellow-300/80">
              Tooba Khojhi ne 'Nahi' dabane ki <span className="underline font-bold text-yellow-300">{escapeCount}</span> baar nakaam koshish ki 😂
            </span>
          )}
        </div>
      </motion.div>

      {/* Celebratory Nikkah Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="modal-container">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Celebration Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-stone-900 border-2 border-yellow-400 rounded-3xl p-6 md:p-8 text-center shadow-2xl text-white overflow-hidden"
              id="celebration-certificate"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 cursor-pointer transition" onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 border border-stone-800 rounded-full p-1 bg-stone-800/50 hover:bg-stone-800" />
              </div>

              {/* Celebration Header */}
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-yellow-400/10 rounded-full border border-yellow-400/30 animate-bounce">
                  <PartyPopper className="w-10 h-10 text-yellow-400" />
                </div>
              </div>

              <h3 className="text-yellow-400 font-mono text-sm uppercase tracking-widest mb-1">Rishta Accepted</h3>
              <h2 className="text-3xl font-serif font-black text-amber-300 tracking-tight leading-none mb-4">
                Mubarak Ho! 🎉
              </h2>

              <div className="border-t border-b border-stone-800 py-5 my-2 text-stone-200 text-base leading-relaxed space-y-4">
                <p className="text-lg font-bold text-white">
                  Tooba Khojhi ne Fahad ka Nikkah Qabool kar liya! ❤️
                </p>

                <div className="bg-stone-950/70 rounded-2xl p-4 border border-stone-800 text-center font-mono text-sm text-yellow-300">
                  <span>Ab ziada khojhiyaan mat marna, Fahad ko party do! 😜🎂</span>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetNoButton();
                  }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-stone-950 font-black text-sm tracking-wider uppercase transition cursor-pointer shadow-lg"
                >
                  Party Done! 🎂🥳
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

