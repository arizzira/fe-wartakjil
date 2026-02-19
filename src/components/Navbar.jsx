import { Share2, Trophy, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { SoundContext } from '../context/SoundContext';

function Navbar() {
  const navigate = useNavigate();
  const { isMuted, toggleMute, playClick } = useContext(SoundContext);
  
  // LOGIKA SHARE GOKIL
  const handleShare = async () => {
    playClick(); // Mainin suara klik dulu

    const shareData = {
      title: 'War Takjil Online ⚔️',
      text: 'Woi! Gercep bantu kubu kita menangin War Takjil hari ini. Jangan sampe gorengan idaman lo diborong mereka! 😂🔥 #WarTakjil2026',
      url: window.location.origin // Link web lo otomatis
    };

    try {
      // Cek kalau browser support fitur Share bawaan (biasanya di HP)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback buat di Laptop/Desktop: Copy ke clipboard
        const shareText = `${shareData.text} \n\nMain di sini: ${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        
        // Kasih notif simpel ala gaming
        alert('Pesan ajakan & Link udah dicopy! Langsung paste ke grup WA!');
      }
    } catch (err) {
      console.log('Batal share atau ada error:', err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 font-body">
      {/* Background Putih + Border Bawah Hitam Tebal */}
      <div className="absolute inset-0 bg-white border-b-4 border-black"></div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* LOGO & SOUND TOGGLE */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => { playClick(); navigate('/'); }}>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); // Biar gak ketrigger navigate ke home
              toggleMute(); 
            }}
            className="bg-orange-400 p-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:scale-90"
          >
            {isMuted ? <VolumeX size={22} className="text-white" /> : <Volume2 size={22} className="text-black animate-pulse" />}
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-game text-black leading-none uppercase" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
              WAR<span className="text-orange-500">TAKJIL</span>
            </h1>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Ramadhan Edition</span>
          </div>
        </div>

        {/* TOMBOL ACTIONS (Ranking & Share) */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* TOMBOL LEADERBOARD */}
          <button 
            onClick={() => { playClick(); navigate('/leaderboard'); }}
            className="flex items-center gap-2 px-3 md:px-5 py-2 bg-white text-black rounded-xl text-xs md:text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all font-game uppercase"
            style={{ fontFamily: "'Luckiest Guy', cursive" }}
          >
            <Trophy size={18} className="text-yellow-500" />
            <span className="hidden sm:inline">RANKING</span>
          </button>

          {/* TOMBOL SHARE YANG SEKARANG FUNGSI */}
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-3 md:px-5 py-2 bg-yellow-400 text-black rounded-xl text-xs md:text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all font-game uppercase"
            style={{ fontFamily: "'Luckiest Guy', cursive" }}
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">AJAK TEMAN</span>
            <span className="sm:hidden">SHARE</span>
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;