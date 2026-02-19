import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Zap, Swords, Gift } from 'lucide-react';
import Navbar from '../components/Navbar';

// Path gambar Saweria di folder public
const SAWERIA_QR = "/saweria.png";

function Home() {
  const navigate = useNavigate();
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Komponen Stat Bar Mini
  const StatBar = ({ label, value, color }) => (
    <div className="flex flex-col gap-1 mb-2 w-full">
      <div className="flex justify-between text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-black">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2.5 w-full bg-white border-2 border-black rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <section 
      ref={targetRef}
      className="relative min-h-screen bg-[#FFC000] text-black overflow-x-hidden font-body"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Fredoka:wght@400;600;700&display=swap');
        .font-game { font-family: 'Luckiest Guy', cursive; letter-spacing: 0.05em; }
        .font-body { font-family: 'Fredoka', sans-serif; }
        
        .bg-pattern {
          background-image: radial-gradient(#000 1.5px, transparent 1.5px);
          background-size: 20px 20px;
          opacity: 0.1;
        }
      `}</style>
      
      <div className="relative z-50 border-b-4 border-black bg-white">
        <Navbar />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern"></div>
      
      <motion.div 
        style={{ y: yText }}
        className="absolute top-20 left-0 w-full text-center pointer-events-none opacity-10 z-0"
      >
        <h1 className="text-[20vw] font-game text-black leading-none">WAR!!</h1>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-20">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="inline-block bg-white border-4 border-black px-4 py-1 rounded-full mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <span className="font-game text-lg md:text-xl text-orange-500">🔥 SEASON RAMADHAN 🔥</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-game text-black drop-shadow-sm mb-2 leading-tight">
            PILIH KUBU <br/> <span className="text-white text-stroke-black">PERPERANGAN</span>
          </h1>
          <p className="text-sm md:text-lg font-bold max-w-md mx-auto bg-black text-white py-1 px-3 rounded-lg rotate-1">
            "Janji gak nangis kalau kehabisan bakwan?"
          </p>
        </div>

        {/* --- HIGHLIGHT BAR --- */}
        <div className="bg-white border-4 border-black rounded-xl p-3 md:p-4 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="flex justify-between items-end mb-2">
            <span className="font-game text-lg md:text-2xl uppercase text-blue-600">Tim Peci</span>
            <div className="text-center">
              <Swords size={24} className="mx-auto mb-1 animate-pulse" />
              <span className="text-[10px] font-bold bg-gray-200 px-2 py-0.5 rounded">LIVE BATTLE</span>
            </div>
            <span className="font-game text-lg md:text-2xl uppercase text-orange-600">Tim Salib</span>
          </div>
          <div className="h-4 md:h-6 w-full bg-gray-200 rounded-full border-2 border-black flex overflow-hidden">
            <div className="w-[50%] bg-blue-400 border-r-2 border-black"></div>
            <div className="w-[50%] bg-orange-400"></div>
          </div>
        </div>

        {/* --- PILIH ROLE --- */}
        <div className="grid grid-cols-2 gap-3 md:gap-8 items-stretch">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/game/muslim')}
            className="bg-cyan-100 border-4 border-black rounded-2xl p-2 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-1 transition-transform flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 border-l-2 border-b-2 border-black rounded-bl-lg z-10">DEFENDER</div>
            <div className="flex justify-center my-2 md:my-4">
               <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full border-4 border-black flex items-center justify-center shadow-sm">
                 <Shield size={32} className="md:w-12 md:h-12 text-cyan-600" />
               </div>
            </div>
            <h3 className="font-game text-xl md:text-3xl text-center mb-1 leading-none text-blue-900">TIM <br/> MUSLIM</h3>
            <p className="text-[10px] md:text-sm text-center font-bold mb-4">"Sabar itu subur, tapi laper ya laper."</p>
            <div className="mt-auto space-y-1">
               <StatBar label="Iman" value={100} color="bg-blue-500" />
               <StatBar label="Sabar" value={90} color="bg-blue-500" />
            </div>
            <button className="mt-3 w-full bg-black text-white font-game py-2 rounded-lg text-sm md:text-lg">GAS JOIN!</button>
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/game/nonis')}
            className="bg-orange-100 border-4 border-black rounded-2xl p-2 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-1 transition-transform flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 border-l-2 border-b-2 border-black rounded-bl-lg z-10">RUSHER</div>
            <div className="flex justify-center my-2 md:my-4">
               <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full border-4 border-black flex items-center justify-center shadow-sm">
                 <Zap size={32} className="md:w-12 md:h-12 text-orange-600" />
               </div>
            </div>
            <h3 className="font-game text-xl md:text-3xl text-center mb-1 leading-none text-orange-900">TIM <br/> NONIS</h3>
            <p className="text-[10px] md:text-sm text-center font-bold mb-4">"Login jam 3 sore, sikat semua takjil."</p>
            <div className="mt-auto space-y-1">
               <StatBar label="Speed" value={100} color="bg-orange-500" />
               <StatBar label="Nyamar" value={85} color="bg-orange-500" />
            </div>
            <button className="mt-3 w-full bg-black text-white font-game py-2 rounded-lg text-sm md:text-lg">GAS JOIN!</button>
          </motion.div>
        </div>

        {/* --- DONATION BOX (SAWERIA ONLY) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 bg-white border-4 border-black rounded-xl p-6 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 border-2 border-black px-4 py-1 rounded-full font-game text-sm shadow-sm flex items-center gap-2 whitespace-nowrap">
            <Gift size={16} /> TRAKTIR ADMIN GORENGAN
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 mt-2">
            {/* Area Gambar QR Saweria */}
            <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-50 border-2 border-black rounded-lg flex-shrink-0 p-2 rotate-2 shadow-md overflow-hidden">
              <img src={SAWERIA_QR} alt="Saweria QR" className="w-full h-full object-contain" />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h3 className="font-game text-2xl md:text-3xl mb-2 text-orange-600">SUPPORT MIMIN HHE</h3>
              <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed mb-4">
                Website ini murni buat gabut & seru-seruan bareng. Kalau kamu terhibur, support admin lewat <span className="underline decoration-yellow-400 decoration-4">Saweria</span> buat modal beli Es Teh & Gorengan pas buka nanti!
              </p>
              <div className="inline-block bg-black text-white font-game px-4 py-2 rounded-lg text-sm rotate-[-1deg]">
                SCAN QR DI SAMPING
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
           <p className="font-game text-sm text-black/50 tracking-widest uppercase">
             DIBUAT DENGAN NEKAT & made by leno
           </p>
        </div>

      </div>
    </section>
  );
}

export default Home;