import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { SoundProvider } from './context/SoundContext'; // Impor Provider
import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import './App.css';

function App() {
  return (
    <SoundProvider> {/* Bungkus disini */}
      <BrowserRouter>
        <div className="main-layout">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:teamId" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;