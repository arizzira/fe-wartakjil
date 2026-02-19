import React, { createContext, useState, useEffect, useRef } from 'react';

export const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const bgMusic = useRef(null);

  useEffect(() => {
    // Inisialisasi Backsound
    bgMusic.current = new Audio('/sound/backsound.mp3');
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.4; // Set volume 40% biar ga kaget

    // Browser melarang autoplay sebelum ada interaksi. 
    // Kita jalankan musik saat pertama kali user klik apapun di web.
    const startAudio = () => {
      if (!isMuted) {
        bgMusic.current.play().catch(() => console.log("Menunggu interaksi user..."));
      }
      window.removeEventListener('click', startAudio);
    };

    window.addEventListener('click', startAudio);
    
    return () => {
      bgMusic.current.pause();
      window.removeEventListener('click', startAudio);
    };
  }, []);

  // Handler untuk mute/unmute
  useEffect(() => {
    if (bgMusic.current) {
      bgMusic.current.muted = isMuted;
    }
  }, [isMuted]);

  // Fungsi untuk suara klik (Sound Effect)
  const playClick = () => {
    if (!isMuted) {
      const clickSfx = new Audio('/sound/click.wav');
      clickSfx.volume = 0.6;
      clickSfx.play();
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playClick }}>
      {children}
    </SoundContext.Provider>
  );
};