import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Leaderboards from '@/pages/Leaderboards';
import LeaderboardDetail from '@/pages/LeaderboardDetail';
import Player from '@/pages/Player';
import Vote from '@/pages/Vote';
import Updates from '@/pages/Updates';
import Resources from '@/pages/Resources';
import Staff from '@/pages/Staff';
import Shop from '@/pages/Shop';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative">
        {/* Global Background - Hero image visible on all pages */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: 'url(/assets/hero.png)' }}
        />
        <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-0" />
        <Navbar />
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/leaderboards/:type" element={<LeaderboardDetail />} />
            <Route path="/player/:username" element={<Player />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
