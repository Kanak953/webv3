import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLeaderboard } from '@/hooks/useApi';
import { ChevronLeft, Trophy, ChevronLeft as ChevronLeftIcon, ChevronRight } from 'lucide-react';
import SkinViewer3D from '@/components/SkinViewer3D';
import { useState, useMemo } from 'react';

const leaderboardConfig: Record<string, { name: string; unit: string; valueKey: string; formatValue: (v: number) => string }> = {
  'votes': { 
    name: 'Top Voters', 
    unit: 'votes', 
    valueKey: 'votes.allTime',
    formatValue: (v) => v.toLocaleString()
  },
  'playerkills': { 
    name: 'Player Kills', 
    unit: 'kills', 
    valueKey: 'kills',
    formatValue: (v) => v.toLocaleString()
  },
  'mobkills': { 
    name: 'Mob Kills', 
    unit: 'kills', 
    valueKey: 'mobKills',
    formatValue: (v) => v.toLocaleString()
  },
  'economy-money': { 
    name: 'Balance', 
    unit: '$', 
    valueKey: 'balance',
    formatValue: (v) => {
      if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
      if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
      return `$${v.toLocaleString()}`;
    }
  },
  'rich': { 
    name: 'Balance', 
    unit: '$', 
    valueKey: 'balance',
    formatValue: (v) => {
      if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
      if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
      return `$${v.toLocaleString()}`;
    }
  },
  'blocksmined': { 
    name: 'Blocks Mined', 
    unit: 'blocks', 
    valueKey: 'blocksMined',
    formatValue: (v) => v.toLocaleString()
  },
  'deaths': { 
    name: 'Deaths', 
    unit: 'deaths', 
    valueKey: 'deaths',
    formatValue: (v) => v.toLocaleString()
  },
  'playtime': { 
    name: 'Playtime', 
    unit: 'hours', 
    valueKey: 'playtimeHours',
    formatValue: (v) => `${Math.floor(v)}h`
  },
};

// Get value from nested object using dot notation
function getNestedValue(obj: any, path: string): number {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || 0;
}

const PLAYERS_PER_PAGE = 25;

export default function LeaderboardDetail() {
  const { type } = useParams<{ type: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  
  const config = leaderboardConfig[type || ''] || { 
    name: 'Leaderboard', 
    unit: 'points', 
    valueKey: 'value',
    formatValue: (v: number) => v.toLocaleString()
  };
  
  // Use leaderboard hook with 30 second refresh
  const { data: leaderboard, loading } = useLeaderboard(type === 'economy-money' ? 'rich' : (type || ''), 30000);

  // Calculate pagination
  const totalPlayers = leaderboard?.length || 0;
  const totalPages = Math.ceil(totalPlayers / PLAYERS_PER_PAGE);
  
  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * PLAYERS_PER_PAGE;
    return leaderboard?.slice(start, start + PLAYERS_PER_PAGE) || [];
  }, [leaderboard, currentPage]);

  const top3 = leaderboard?.slice(0, 3) || [];

  // Calculate global stats
  const totalValue = leaderboard?.reduce((sum, p) => sum + getNestedValue(p, config.valueKey), 0) || 0;
  const avgValue = leaderboard?.length ? Math.floor(totalValue / leaderboard.length) : 0;

  const rankStyles = [
    { bg: 'bg-gradient-to-br from-yellow-500/40 to-yellow-600/40 border-yellow-500/60', text: 'text-yellow-400', rankBg: 'bg-yellow-500' },
    { bg: 'bg-gradient-to-br from-gray-400/40 to-gray-500/40 border-gray-400/60', text: 'text-gray-300', rankBg: 'bg-gray-400' },
    { bg: 'bg-gradient-to-br from-orange-600/40 to-orange-700/40 border-orange-600/60', text: 'text-orange-400', rankBg: 'bg-orange-600' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[250px] py-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/hero.png)' }}
        />
        <div className="absolute inset-0 page-header-gradient" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/leaderboards" 
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Leaderboards
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
              <Trophy className="w-10 h-10 text-orange-400" />
              {config.name} Leaderboard
            </h1>
            <p className="text-lg text-gray-400">
              {totalPlayers} players ranked by {config.name.toLowerCase()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          {/* Left Side - Top 3 with 3D Skin Viewer */}
          <div className="space-y-4">
            {loading ? (
              <div className="glass-card p-8 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {top3.map((player, index) => {
                  const value = getNestedValue(player, config.valueKey);
                  const style = rankStyles[index];
                  
                  return (
                    <motion.div
                      key={player.uuid || player.username}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link to={`/player/${player.username}`} className="block group">
                        <div className={`glass-card p-4 hover:bg-white/10 transition-all duration-300 relative overflow-hidden border-2 ${style.bg}`}>
                          {/* Rank Badge */}
                          <div className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white ${style.rankBg} shadow-lg`}>
                            #{index + 1}
                          </div>
                          
                          {/* Value */}
                          <div className="absolute top-3 right-3 bg-black/60 px-3 py-1 rounded-full text-sm font-bold text-white">
                            {config.formatValue(value)}
                          </div>
                          
                          {/* 3D Skin Viewer */}
                          <div className="flex justify-center py-6">
                            <SkinViewer3D 
                              username={player.username} 
                              width={200} 
                              height={250} 
                              animation="walk" 
                              rotateSpeed={0.45} 
                            />
                          </div>
                          
                          {/* Player Name */}
                          <div className="text-center">
                            <p className={`font-bold text-xl truncate group-hover:text-orange-400 transition-colors ${style.text}`}>
                              {player.username}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Global Statistics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="glass-card p-6 mt-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-400" />
                    Global Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Players</span>
                      <span className="text-white font-medium">{totalPlayers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total {config.name}</span>
                      <span className="text-orange-400 font-medium">{config.formatValue(totalValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average {config.name}</span>
                      <span className="text-white font-medium">{config.formatValue(avgValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Top Score</span>
                      <span className="text-yellow-400 font-medium">
                        {config.formatValue(getNestedValue(leaderboard?.[0], config.valueKey))}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Right Side - All Players List with Pagination */}
          <div>
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  Top {PLAYERS_PER_PAGE} Players
                </h2>
                <span className="text-sm text-gray-500">Page {currentPage} of {totalPages || 1}</span>
              </div>

              {loading ? (
                <div className="p-8 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : paginatedPlayers.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {paginatedPlayers.map((player, index) => {
                    const actualIndex = (currentPage - 1) * PLAYERS_PER_PAGE + index;
                    const value = getNestedValue(player, config.valueKey);
                    const isTop3 = actualIndex < 3;
                    
                    return (
                      <motion.div
                        key={player.uuid || player.username}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                      >
                        <Link
                          to={`/player/${player.username}`}
                          className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors"
                        >
                          {/* Rank */}
                          <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                            actualIndex === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                            actualIndex === 1 ? 'bg-gray-400/20 text-gray-300' :
                            actualIndex === 2 ? 'bg-orange-600/20 text-orange-400' :
                            'bg-white/5 text-gray-400'
                          }`}>
                            {actualIndex + 1}
                          </div>
                          
                          {/* Avatar - Half Bust */}
                          <img
                            src={`https://nmsr.nickac.dev/bust/${player.username}`}
                            alt={player.username}
                            className="w-12 h-12 rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/${player.username}/48`;
                            }}
                          />
                          
                          {/* Name */}
                          <span className={`flex-1 font-medium hover:text-orange-400 transition-colors ${isTop3 ? 'text-white' : 'text-gray-300'}`}>
                            {player.username}
                          </span>
                          
                          {/* Value */}
                          <span className={`font-bold ${isTop3 ? 'text-orange-400' : 'text-gray-400'}`}>
                            {config.formatValue(value)}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No data available
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
