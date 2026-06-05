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
  Info, 
  Award, 
  CheckCircle, 
  BadgeAlert, 
  PartyPopper,
  Volume2,
  X,
  VolumeX
} from "lucide-react";

// Types for our custom floating particle mechanics
interface FloatingItem {
  id: number;
  type: "heart" | "glass";
  x: number; // percentage width
  size: number; // pixels
  delay: number; // seconds
  duration: number; // seconds
  opacity: number;
}

export default function App() {
  // Particle list setup for floating background items
  const [particles, setParticles] = useState<FloatingItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [successClicks, setSuccessClicks] = useState(0);
  const [bgMusic, setBgMusic] = useState(false);
  
  // Position state for the escaping "Nahi" button
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0, isMoved: false });
  // Escape count for funny messaging
  const [escapeCount, setEscapeCount] = useState(0);

  // Initialize floating hearts and magnifying glasses
  useEffect(() => {
    const items: FloatingItem[] = [];
    // Generate 25 items for a lively ambient bg
    for (let i = 0; i < 25; i++) {
      items.push({
        id: i,
        type: i % 3 === 0 ? "glass" : "heart", // more hearts, some magnifying glasses
        x: Math.random() * 100,
        size: Math.random() * (40 - 15) + 15,
        delay: Math.random() * 8,
        duration: Math.random() * (12 - 6) + 6,
        opacity: Math.random() * (0.6 - 0.2) + 0.2,
      });
    }
    setParticles(items);
  }, []);

  // Runaway logic: Calculates a distant coordinate relative to mouse/touch coordinates
  const handleNoButtonEscape = (e?: React.MouseEvent | React.TouchEvent) => {
    const btnWidth = 100;
    const btnHeight = 45;
    
    // Total space minus safe margins
    const maxWidth = window.innerWidth - btnWidth - 30;
    const maxHeight = window.innerHeight - btnHeight - 30;

    // Get current client trigger point
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

    // Try multiple random coordinates and select the one furthest from current cursor
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
      x: bestX,
      y: bestY,
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
    if (escapeCount === 0) return "Click karo dosti paki karne k liye!";
    if (escapeCount < 3) return "Arrey? Kuch toh garbar hai, button bhag raha hai! 😂";
    if (escapeCount < 7) return "Arey Sidra, jitni marzi koshish karlo, 'NAHI' toh touch nahi hoga! 🔍😜";
    if (escapeCount < 12) return "Aray yaar! Tum abhi tak koshish kar rahi ho? Sachi me KHOJHI ho tum! 🕵️‍♀️";
    return "Bas karo Sidra Khojhi, 'Haan' daba do chup chap! Hahaha 😂❤️";
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-400 via-pink-500 to-red-600 flex flex-col items-center justify-center p-4 font-sans selection:bg-rose-300 selection:text-rose-900">
      
      {/* Immersive UI Background Large Romantic Hearts */}
      <div className="absolute top-10 left-10 text-pink-200 opacity-20 pointer-events-none select-none text-[8rem]" id="large-heart-1">&hearts;</div>
      <div className="absolute bottom-10 right-10 text-pink-200 opacity-20 pointer-events-none select-none text-[10rem]" id="large-heart-2">&hearts;</div>
      <div className="absolute top-1/4 right-1/4 text-pink-200 opacity-10 pointer-events-none select-none text-[5rem]" id="large-heart-3">&hearts;</div>
      <div className="absolute bottom-1/4 left-1/4 text-pink-200 opacity-10 pointer-events-none select-none text-[6rem]" id="large-heart-4">&hearts;</div>

      {/* Background Floating Elements Layer */}
      <div className="absolute inset-0 pointer-events-none" id="floating-canvas">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "110vh", x: `${p.x}vw`, rotate: 0 }}
            animate={{ 
              y: "-20vh", 
              rotate: 360,
              x: [`${p.x}vw`, `${p.x + (p.id % 2 === 0 ? 5 : -5)}vw`, `${p.x}vw`]
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
              color: p.type === "glass" ? "#fef08a" : "#ffe4e6"
            }}
          >
            {p.type === "heart" ? (
              <Heart className="w-full h-full fill-current drop-shadow-md" />
            ) : (
              <Search className="w-full h-full stroke-[2.5]" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Decorative Interactive sound button */}
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

      {/* Ambient background glow effect */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-350 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-350 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-pulse pointer-events-none" />

      {/* Main Glassmorphic Card Container - Styled meticulously with rounded-[3rem] and extra width padding */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-xl p-8 md:p-14 rounded-[3rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-center flex flex-col items-center overflow-hidden"
        id="card-container"
      >
        {/* Playful Floating Glass Title Badge */}
        <div className="mb-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/15 text-pink-100 text-xs font-semibold uppercase tracking-wider shadow-inner" id="dosti-badge">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
          Special Friendship Card
        </div>

        {/* Elegant typography for Name */}
        <div className="mb-6 relative w-full" id="name-wrapper">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tighter drop-shadow-2xl">
            Sidra
          </h1>
          <span className="block text-2xl md:text-3xl font-serif italic text-pink-200 mt-2">
            &ldquo;Sidra Khojhi&rdquo; 🕵️‍♀️
          </span>
          
          <div className="text-xs text-rose-100 font-semibold mt-4 flex items-center justify-center gap-1 bg-rose-950/20 px-3.5 py-1.5 rounded-full border border-rose-400/20 max-w-xs mx-auto shadow-sm" id="khojhi-subtitle">
            <Search className="w-3.5 h-3.5 text-yellow-300 stroke-[2.5]" />
            <span>Rank #1: Dunia Ki Sab Se Bari Detective</span>
          </div>
        </div>

        {/* Immersive UI border-y divider and highlight structure */}
        <div className="w-full my-8 py-6 border-y border-white/10 relative select-none" id="core-message-box">
          {/* Left/Right romantic heart visuals to mock the look */}
          <div className="absolute top-2 left-2 text-pink-200/20"><Heart className="w-5 h-5 fill-current" /></div>
          <div className="absolute bottom-2 right-2 text-pink-200/20"><Heart className="w-5 h-5 fill-current" /></div>

          <p className="text-lg md:text-xl text-pink-100 font-light tracking-wide">
            Oye, ek baat suno... 🤔
          </p>
          <p className="text-3xl md:text-4xl font-black text-white mt-4 uppercase drop-shadow-sm leading-snug">
            Tum sirf meri sachi aur achi <span className="text-yellow-300 underline decoration-yellow-300 decoration-wavy decoration-2 underline-offset-8">DOST</span> ho! 🤝
          </p>
          <p className="text-xs text-rose-100/80 leading-relaxed max-w-md mx-auto mt-3">
            (Koi galat fehmi mat paalna, romantic background sirf dushmani bhulane k liye hai 😜)
          </p>
        </div>

        {/* Dynamic Escape Status Box */}
        <div className="h-6 mb-4 flex items-center justify-center">
          <p className="text-xs text-yellow-300 font-mono tracking-tight text-center bg-rose-950/30 px-3.5 p-1 rounded-full border border-yellow-300/10">
            {getEscapeMessage()}
          </p>
        </div>

        {/* Interactive Question Card */}
        <div className="w-full rounded-2xl mb-2 relative" id="question-box">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
            Humari friendship hy ya nahi? 🤔
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 min-h-[80px] relative w-full" id="button-row">
            {/* Stable "Haan" Button - Immersive Theme white & pink/red glow */}
            <motion.button
              whileHover={{ scale: 1.1, shadow: "0px 10px 25px rgba(255,255,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleYesClick}
              className="bg-white text-red-600 hover:bg-pink-100 px-12 py-5 rounded-full text-2xl font-bold shadow-xl transition-all transform cursor-pointer flex items-center justify-center gap-2 border border-white"
              id="yes-btn"
            >
              <Smile className="w-6 h-6 fill-current text-red-500" />
              Haan! ✅
            </motion.button>

            {/* Runaway "Nahi" Button */}
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
              className="bg-red-700/50 hover:bg-red-800/70 text-white px-12 py-5 rounded-full text-2xl font-bold shadow-lg border border-white/20 transition-all duration-75 select-none whitespace-nowrap cursor-pointer touch-none flex items-center justify-center gap-2"
              id="no-btn"
            >
              <Laugh className="w-6 h-6" />
              Nahi! ❌
            </motion.button>
          </div>
        </div>

        {/* Tiny Dosti Footnotes */}
        <div className="mt-8 text-[10px] text-rose-200/50 flex flex-col items-center gap-1 font-mono" id="card-footers">
          <span>Validity: FOREVER 🔒 (No exchange or replacement policy)</span>
          {escapeCount > 0 && (
            <span className="text-yellow-300/70">
              Sidra Khojhi ne button pakarne ki <span className="underline font-bold text-yellow-300">{escapeCount}</span> baar nakaam koshish ki 😂
            </span>
          )}
        </div>
      </motion.div>

      {/* Celebratory Friendship Locked Certificate / Custom Alert Modal Instead of Browser Alert */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="modal-container">
            {/* Modal Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Certificate Style Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-stone-900 border-2 border-yellow-400 rounded-3xl p-6 md:p-8 text-center shadow-2xl text-white overflow-hidden"
              id="celebration-certificate"
            >
              {/* Confetti details */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 cursor-pointer transition" onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 border border-stone-800 rounded-full p-1 bg-stone-800/50 hover:bg-stone-800" />
              </div>

              {/* Celebration icon header */}
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-yellow-400/10 rounded-full border border-yellow-400/30 animate-bounce">
                  <PartyPopper className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              {/* Title representation */}
              <h3 className="text-yellow-400 font-mono text-sm uppercase tracking-widest mb-1">Dosti Officially Confirmed</h3>
              <h2 className="text-2xl md:text-3xl font-serif font-black text-stone-100 tracking-tight leading-none mb-4">
                FRIENDSHIP CERTIFICATE 📜
              </h2>

              <div className="border-t border-b border-stone-800 py-4 my-2 text-stone-200 text-sm leading-relaxed space-y-4">
                <p className="text-base text-yellow-100">
                  Mubarak ho! 🥳 Ab officially tay ho chuka hai k tum is puri dunya ki sachi, achi, aur pakki 
                  <span className="text-pink-400 font-bold"> DOST</span> ho! 🤝💖
                </p>

                {/* Report parameters */}
                <div className="bg-stone-950/50 rounded-xl p-3 border border-stone-800 text-left font-mono text-[11px] md:text-xs text-stone-400 space-y-1.5">
                  <div className="flex justify-between border-b border-stone-900 pb-1">
                    <span>🕵️‍♀️ Detective Name:</span>
                    <span className="text-stone-200 text-right">Sidra "Khojhi"</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-900 pb-1">
                    <span>🔍 Case Investigated:</span>
                    <span className="text-stone-200">Har dosti me romantic twist</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-900 pb-1">
                    <span>🧠 Dimagh khana speed:</span>
                    <span className="text-yellow-400 font-bold">100 GigaBytes / Min</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-900 pb-1">
                    <span>🗣️ Batein karne ki limits:</span>
                    <span className="text-stone-200">INFINITE ♾️</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>🏆 Friendship status:</span>
                    <span className="text-emerald-400 font-bold">Sachi aur Pakki Wali! ⭐</span>
                  </div>
                </div>

                <p className="text-[11px] italic text-stone-400 leading-snug">
                  "Aur haan Sidra Khojhi, har cheez me dasti raaz ya khwah-makhwah detective giri band karo! Bohot dhoond liya, par dosti k siwa kuch nahi milna yahan! 😂🔍"
                </p>
              </div>

              {/* Close controls */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetNoButton();
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-stone-950 font-bold text-xs tracking-wider uppercase transition cursor-pointer"
                >
                  Dosti Qubool Hai! 🥳
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
