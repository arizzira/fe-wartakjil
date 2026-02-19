import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { ArrowLeft, Zap, Shield, Loader2, Globe, Flame, AlertCircle } from 'lucide-react'; // Tambah AlertCircle
import { SoundContext } from '../context/SoundContext';
import { motion } from 'framer-motion';

const API_URL = 'https://vercel.com/arizziras-projects/be-wartakjil/api'; 

const takjilImages = [
  '/animasi/1.png', '/animasi/2.png', '/animasi/3.png', '/animasi/4.png',
  '/animasi/5.png', '/animasi/6.png', '/animasi/7.png', '/animasi/8.png',
  '/animasi/9.png', '/animasi/10.png', '/animasi/11.png', '/animasi/12.png',
  '/animasi/13.png',
];

function Game() {
  const { playClick } = useContext(SoundContext);
  const { teamId } = useParams();
  const navigate = useNavigate();
  
  const [localScore, setLocalScore] = useState(0); 
  const [globalTeamScore, setGlobalTeamScore] = useState(0); 
  const [pendingClicks, setPendingClicks] = useState(0); 
  const [isAnimate, setIsAnimate] = useState(false);
  
  const [popups, setPopups] = useState([]);
  const popupIdRef = useRef(0);

  const isMuslim = teamId === 'muslim';
  
  const theme = isMuslim ? {
    accent: 'bg-cyan-400',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-cyan-700',
    btnShadow: 'shadow-[6px_6px_0px_0px_#0891b2]', 
    label: 'TIM PECI'
  } : {
    accent: 'bg-orange-500',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-orange-900',
    btnShadow: 'shadow-[6px_6px_0px_0px_#ea580c]', 
    label: 'TIM SALIB'
  };

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/scores`);
        const myTeamData = res.data.find(t => t.team_name === teamId);
        if (myTeamData) {
          const serverScore = parseInt(myTeamData.score || 0); 
          setGlobalTeamScore(serverScore + pendingClicks);
        }
      } catch (err) {
        console.error("Gagal konek backend:", err);
      }
    };
    fetchGlobalStats(); 
    const interval = setInterval(fetchGlobalStats, 2000); 
    return () => clearInterval(interval);
  }, [teamId, pendingClicks]); 

  useEffect(() => {
    const interval = setInterval(async () => {
      if (pendingClicks > 0) {
        const toSend = pendingClicks;
        
        try {
          // Menggunakan API_URL yang terhubung ke backend
          const res = await axios.post(`${API_URL}/vote`, { team: teamId, count: toSend });
          
          const myTeamData = res.data.find(t => t.team_name === teamId);
          if (myTeamData) {
            setGlobalTeamScore(parseInt(myTeamData.score));
          }
          
          setPendingClicks(prev => Math.max(0, prev - toSend)); 
          
        } catch (e) {
          console.error("Gagal kirim vote:", e);
        }
      }
    }, 2000); 
    return () => clearInterval(interval);
  }, [pendingClicks, teamId]);

  const handleTap = (e) => {
    playClick(); 
    
    const clickX = e.clientX || window.innerWidth / 2;
    const clickY = e.clientY || window.innerHeight / 2;

    setLocalScore(prev => prev + 1);
    setPendingClicks(prev => prev + 1);
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 100);

    confetti({
      particleCount: 5,
      spread: 60,
      origin: { y: 0.6 },
      colors: isMuslim ? ['#22d3ee', '#fbbf24'] : ['#f97316', '#fbbf24'],
      disableForReducedMotion: true,
    });

    const randomImage = takjilImages[Math.floor(Math.random() * takjilImages.length)];
    const randomRotate = Math.floor(Math.random() * 40) - 20;

    const newPopup = {
      id: popupIdRef.current++,
      src: randomImage,
      x: clickX,
      y: clickY,
      rotate: randomRotate,
    };

    setPopups(prev => [...prev, newPopup]);
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== newPopup.id)), 800);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FFC000] font-body relative overflow-hidden selection:bg-black selection:text-yellow-400`}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Fredoka:wght@400;600;700&display=swap');
        .font-game { font-family: 'Luckiest Guy', cursive; letter-spacing: 0.05em; }
        .font-body { font-family: 'Fredoka', sans-serif; }
        
        .bg-pattern {
          background-image: radial-gradient(#000 1.5px, transparent 1.5px);
          background-size: 20px 20px;
          opacity: 0.1;
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5) rotate(var(--rot)); opacity: 0; }
          20% { transform: translateY(-50px) scale(1.5) rotate(var(--rot)); opacity: 1; }
          100% { transform: translateY(-200px) scale(1) rotate(var(--rot)); opacity: 0; }
        }
        .animate-float { animation: floatUp 0.8s ease-out forwards; pointer-events: none; }
      `}</style>

      <div className="absolute inset-0 bg-pattern pointer-events-none"></div>
      
      <div className="absolute top-10 left-0 w-full text-center pointer-events-none opacity-5 z-0">
         <h1 className="text-[30vw] font-game text-black leading-none">WAR!!</h1>
      </div>

      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {popups.map((popup) => (
          <img 
            key={popup.id}
            src={popup.src}
            alt=""
            className="absolute w-24 h-24 object-contain animate-float"
            style={{
              left: popup.x,
              top: popup.y,
              transform: 'translate(-50%, -50%)',
              '--rot': `${popup.rotate}deg`
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between p-4 md:p-6 z-10 relative">
        <button 
          onClick={() => navigate('/')} 
          className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95"
        >
          <ArrowLeft size={28} className="text-black" strokeWidth={3} />
        </button>
        
        <div className={`px-4 py-2 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 font-game uppercase text-sm md:text-lg ${theme.text}`}>
           {isMuslim ? <Shield size={20} className={theme.iconColor}/> : <Zap size={20} className={theme.iconColor}/>}
           {theme.label}
        </div>
        
        <div className="w-12"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 pb-20 relative">
        
        <div className="mb-6 text-center relative z-20 w-full max-w-xs">
          
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-yellow-400 rounded-lg border-2 border-black font-body font-bold text-xs uppercase shadow-sm">
               <Globe size={14} />
               <span>GLOBAL: {globalTeamScore.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white border-[6px] border-black px-8 py-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transform rotate-2 hover:rotate-0 transition-transform duration-300">
            {/* Indikator "Syncing" di pojok kartu skor */}
            {pendingClicks > 0 && (
              <div className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-2 border-black animate-bounce shadow-md">
                <AlertCircle size={16} />
              </div>
            )}

            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 border-2 border-black px-2 py-0.5 rounded text-[10px] font-black uppercase whitespace-nowrap">
               KONTRIBUSI LO
            </div>

            <h1 className="text-6xl md:text-7xl font-game text-black tabular-nums leading-none">
              {localScore}
            </h1>
          </div>

          {/* STATUS SYNC YANG DIPERJELAS */}
          <div className="mt-6 flex flex-col items-center gap-2">
             {pendingClicks > 0 ? (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col items-center gap-1 bg-white border-4 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
               >
                 <div className="flex items-center gap-2 text-red-600 font-game text-sm uppercase italic">
                    <Loader2 size={16} className="animate-spin" />
                    Tunggu bentar, poin lagi diamankan!
                 </div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                   Jangan refresh web dulu ya bang...
                 </p>
               </motion.div>
             ) : (
               <div className="flex items-center gap-2 text-black font-game text-xs opacity-60">
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black shadow-sm"></div>
                 POIN kamu SUDAH MASUK SERVER
               </div>
             )}
          </div>
        </div>

        <div className="relative group mt-2 z-30">
          <button 
            onClick={handleTap}
            className={`
              relative w-64 h-64 md:w-72 md:h-72 rounded-full bg-white border-[6px] border-black
              flex items-center justify-center
              transition-all duration-75 touch-manipulation
              ${theme.btnShadow}
              hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              active:translate-x-[6px] active:translate-y-[6px] active:shadow-none
              ${isAnimate ? 'scale-95' : 'scale-100'}
              z-10 overflow-hidden
            `}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className={`absolute inset-0 rounded-full opacity-20 ${theme.accent}`}></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-50"></div>

            <img 
              src={isMuslim 
                ? "https://cdn-icons-png.flaticon.com/512/4305/4305432.png" 
                : "https://cdn-icons-png.flaticon.com/512/2607/2607316.png"
              } 
              alt="Takjil" 
              className="w-36 h-36 md:w-40 md:h-40 object-contain drop-shadow-xl select-none pointer-events-none relative z-10 transform transition-transform group-active:scale-90 group-active:rotate-12"
            />
          </button>
          
          <div className="absolute -right-4 top-10 font-game text-2xl text-white text-stroke-black rotate-12 animate-pulse pointer-events-none">
            TAP!
          </div>
        </div>

        <div className="mt-10 max-w-xs mx-auto text-center">
            <div className={`inline-block font-game text-sm md:text-base px-4 py-2 bg-black text-white border-2 border-transparent rounded-lg rotate-1 shadow-lg`}>
               {isMuslim 
                ? "JANGAN KASIH KENDOR WOOY!" 
                : "SIKAT GORENGANNYA BANG!"}
            </div>
        </div>

      </div>
    </div>
  );
}

export default Game;