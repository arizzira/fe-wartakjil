import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trophy, Crown, Flame, Medal } from 'lucide-react';

const API_URL = 'https://war-takjil.vercel.app/api'; 

function Leaderboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  // --- LOGIC FETCH DATA ---
  const fetchScores = async () => {
    try {
      const res = await axios.get(`${API_URL}/scores`);
      
      // 1. Hitung Total Suara (Ganti total_score jadi score)
      const total = res.data.reduce((acc, curr) => acc + parseInt(curr.score || 0), 0);
      setTotalVotes(total);

      // 2. Sortir: Skor terbesar di atas (Ganti total_score jadi score)
      const sortedData = res.data.sort((a, b) => b.score - a.score);
      
      setScores(sortedData);
      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 3000); // Update tiap 3 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50 font-body text-black selection:bg-black selection:text-white">
      
      {/* INJECT FONT */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Outfit:wght@400;500;700;900&display=swap');
        .font-heading { font-family: 'Dela Gothic One', cursive; }
        .font-body { font-family: 'Outfit', sans-serif; }
      `}</style>

      {/* --- NAVBAR --- */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b-2 border-black sticky top-0 z-30 shadow-sm">
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <span className="font-heading text-lg tracking-wide uppercase">Global Ranking</span>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="max-w-xl mx-auto p-6 pb-20">
        
        {/* --- HEADER TROPHY --- */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 animate-bounce">
            <Trophy className="w-12 h-12 text-black" fill="white" />
          </div>
          <h2 className="text-3xl font-heading leading-tight mb-2">PENGUASA<br/>TAKJIL</h2>
          <p className="text-sm font-bold bg-black text-white px-4 py-1 rounded-full inline-block font-mono">
            LIVE REAL-TIME DATA
          </p>
        </div>

        {/* --- BATTLE BAR (DOMINASI WILAYAH) --- */}
        {!loading && totalVotes > 0 && (
          <div className="mb-12 bg-white p-4 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="flex justify-between text-xs font-black mb-3 uppercase tracking-wider">
              <span>Dominasi Wilayah</span>
              <span>{totalVotes.toLocaleString()} Votes</span>
            </div>
            
            {/* The Bar */}
            <div className="h-8 w-full bg-gray-200 border-2 border-black rounded-full overflow-hidden flex relative">
              {scores.map((team) => {
                // Hitung Persentase (Pakai score)
                const percent = (parseInt(team.score) / totalVotes) * 100;
                const isMuslim = team.team_name === 'muslim';
                
                // Pastikan width tidak 0% kalau ada isinya biar kelihatan dikit
                const styleWidth = percent > 0 ? `${percent}%` : '0%';

                return (
                  <div 
                    key={team.team_name}
                    style={{ width: styleWidth }}
                    className={`h-full flex items-center justify-center overflow-hidden transition-all duration-1000 ease-out ${isMuslim ? 'bg-emerald-400' : 'bg-orange-400'}`}
                  >
                    {/* Pattern Overlay pada Bar */}
                    <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[size:10px_10px]"></div>
                  </div>
                );
              })}
              
              {/* VS Divider di tengah */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black z-10 -translate-x-1/2 opacity-20"></div>
            </div>

            {/* Legend */}
            <div className="flex justify-between mt-3 text-sm font-bold font-heading">
              <span className="text-emerald-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 border border-black"></div> MUSLIM
              </span>
              <span className="text-orange-700 flex items-center gap-2">
                 NONIS <div className="w-3 h-3 rounded-full bg-orange-400 border border-black"></div>
              </span>
            </div>
          </div>
        )}

        {/* --- LIST KLASEMEN --- */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-10 font-mono font-bold animate-pulse">Scanning War Data...</div>
          ) : (
            scores.map((item, index) => {
              const isFirst = index === 0;
              const isMuslim = item.team_name === 'muslim';
              
              // Style Variables
              const cardBg = isFirst ? 'bg-yellow-300' : 'bg-white';
              const teamColor = isMuslim ? 'text-emerald-700' : 'text-orange-700';
              const badgeColor = isMuslim ? 'bg-emerald-400' : 'bg-orange-400';
              const scaleClass = isFirst ? 'scale-105 z-10' : 'scale-100 grayscale-[0.5] opacity-80 hover:grayscale-0 hover:opacity-100';

              return (
                <div 
                  key={item.team_name}
                  className={`
                    relative flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl transition-all duration-300
                    border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                    ${cardBg} ${scaleClass}
                  `}
                >
                  {/* Badge Juara 1 */}
                  {isFirst && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-yellow-400 text-xs font-black px-4 py-1.5 rounded-full border-2 border-yellow-400 shadow-md flex items-center gap-1 animate-pulse">
                      <Crown size={14} /> CURRENT KING
                    </div>
                  )}

                  <div className="flex items-center gap-5 mb-4 sm:mb-0">
                    {/* Ranking Number */}
                    <div className={`
                      w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl border-2 border-black font-heading text-2xl
                      ${isFirst ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}
                    `}>
                      #{index + 1}
                    </div>

                    {/* Team Info */}
                    <div>
                      <h3 className={`font-heading text-xl uppercase flex items-center gap-2 ${isFirst ? 'text-black' : 'text-gray-600'}`}>
                        {isMuslim ? 'Tim Muslim' : 'Tim Nonis'}
                        {isFirst && <Medal size={20} className="text-black"/>}
                      </h3>
                      <div className="flex gap-2 mt-1">
                         <span className={`text-[10px] font-bold px-2 py-0.5 border border-black rounded-md ${badgeColor} text-black`}>
                           {isMuslim ? 'DEFENDER' : 'RUSHER'}
                         </span>
                      </div>
                    </div>
                  </div>

                  {/* Score (Pakai score bukan total_score) */}
                  <div className="text-right">
                    <span className={`block text-3xl font-heading tracking-tighter ${teamColor}`}>
                      {parseInt(item.score).toLocaleString()}
                    </span>
                    {isFirst && (
                      <span className="text-xs font-bold flex items-center justify-end gap-1 text-black">
                        <Flame size={12} fill="black" /> Leading
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer Credit */}
        <div className="mt-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
           War Takjil Season 1
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;