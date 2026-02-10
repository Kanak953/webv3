import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { ExternalLink, Trophy, ChevronLeft, ChevronRight, Flame } from 'lucide-react';

// Voting sites
const votingSites = [
  { name: 'Minecraft Servers', url: 'https://minecraftservers.org/vote/shahimc' },
  { name: 'Minecraft Buzz', url: 'https://minecraft.buzz/vote/shahimc' },
  { name: 'Minecraft.Menu', url: 'https://minecraft.menu/server-shahimc/vote' },
  { name: 'Minecraft MP', url: 'https://minecraft-mp.com/server/shahimc/vote/' },
  { name: 'Minecraft Server List', url: 'https://minecraft-server-list.com/server/shahimc/vote/' },
];

// API Response types
interface MonthlyVote {
  uuid: string;
  username: string;
  monthVotes: number;
  allTime: number;
  streak: { current: number; best: number };
  points: number;
}

interface LastMonthVote {
  uuid: string;
  username: string;
  lastMonthVotes: number;
  currentMonth: number;
  allTime: number;
  streak: { current: number; best: number };
  points: number;
}

// Stored last month votes (persisted in memory)
let storedJanuary2026Votes: { username: string; votes: number; uuid: string }[] | null = null;

export default function Vote() {
  const [currentMonth, setCurrentMonth] = useState(1); // February 2026 (default)
  const [monthlyVotes, setMonthlyVotes] = useState<MonthlyVote[]>([]);
  const [lastMonthVotes, setLastMonthVotes] = useState<LastMonthVote[]>([]);
  const [loading, setLoading] = useState(true);

  const monthNames = ['January 2026', 'February 2026', 'March 2026'];

  // Fetch votes data
  useEffect(() => {
    const fetchVotes = async () => {
      setLoading(true);
      try {
        // Fetch current month votes
        const monthlyRes = await fetch('http://140.245.6.26:25005/api/votes/monthly');
        const monthlyData = await monthlyRes.json();
        setMonthlyVotes(monthlyData);

        // Fetch last month votes
        const lastMonthRes = await fetch('http://140.245.6.26:25005/api/votes/lastmonth');
        const lastMonthData = await lastMonthRes.json();
        setLastMonthVotes(lastMonthData);

        // Store January 2026 votes if not already stored
        if (!storedJanuary2026Votes && lastMonthData.length > 0) {
          storedJanuary2026Votes = lastMonthData.map((v: LastMonthVote) => ({
            username: v.username,
            votes: v.lastMonthVotes,
            uuid: v.uuid
          }));
        }
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
      setLoading(false);
    };

    fetchVotes();
    // Refresh every 30 seconds
    const interval = setInterval(fetchVotes, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get votes based on selected month
  const votes = useMemo(() => {
    if (currentMonth === 0) {
      // January 2026 - use stored votes or fetch from last month API
      return (storedJanuary2026Votes || lastMonthVotes.map(v => ({
        username: v.username,
        votes: v.lastMonthVotes,
        uuid: v.uuid,
        streak: v.streak
      }))).sort((a, b) => b.votes - a.votes);
    } else {
      // Current month - use monthly API
      return monthlyVotes.map(v => ({
        username: v.username,
        votes: v.monthVotes,
        uuid: v.uuid,
        streak: v.streak
      })).sort((a, b) => b.votes - a.votes);
    }
  }, [currentMonth, monthlyVotes, lastMonthVotes]);

  // Calculate total votes
  const totalVotes = useMemo(() => {
    return votes.reduce((sum, v) => sum + v.votes, 0);
  }, [votes]);

  const rankStyles = [
    { bg: 'bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 border-yellow-500/50', text: 'text-yellow-400' },
    { bg: 'bg-gradient-to-br from-gray-400/30 to-gray-500/30 border-gray-400/50', text: 'text-gray-300' },
    { bg: 'bg-gradient-to-br from-orange-600/30 to-orange-700/30 border-orange-600/50', text: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[300px] py-16 overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Vote
            </h1>
            <p className="text-lg text-gray-400">
              Earn a vote key every day and unlock rewards as you hit voting achievements.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
        {/* Voting Sites */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Vote on These Sites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {votingSites.map((site, index) => (
              <motion.a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card p-4 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-white group-hover:text-orange-400 transition-colors">
                      {site.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Top Voters Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-orange-400" />
                Top Voters
              </h2>
              <p className="text-gray-400">Monthly leaderboard - Updates every 30s</p>
            </div>
            
            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
                disabled={currentMonth === 0}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <span className="text-white font-medium px-4">{monthNames[currentMonth]}</span>
              <button
                onClick={() => setCurrentMonth(Math.min(monthNames.length - 1, currentMonth + 1))}
                disabled={currentMonth === monthNames.length - 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Top 25 Voters List */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-400" />
                Top 25 Voters - {monthNames[currentMonth]}
              </h3>
              <span className="text-sm text-gray-500">Updates every 30s</span>
            </div>

            {loading ? (
              <div className="p-8 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : votes.length > 0 ? (
              <div className="divide-y divide-white/10">
                {votes.slice(0, 25).map((voter, index) => {
                  const isTop3 = index < 3;
                  const style = isTop3 ? rankStyles[index] : null;
                  
                  return (
                    <motion.div
                      key={voter.uuid || voter.username}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <a
                        href={`/player/${voter.username}`}
                        className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${isTop3 ? style?.bg : ''}`}
                      >
                        {/* Rank */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-300 text-black' :
                          index === 2 ? 'bg-orange-500 text-black' :
                          'bg-white/10 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {/* Avatar - Half Bust */}
                        <img
                          src={`https://nmsr.nickac.dev/bust/${voter.username}`}
                          alt={voter.username}
                          className="w-14 h-14 rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/${voter.username}/56`;
                          }}
                        />
                        
                        {/* Name */}
                        <span className={`flex-1 font-medium hover:text-orange-400 transition-colors ${isTop3 ? style?.text : 'text-gray-300'}`}>
                          {voter.username}
                        </span>
                        
                        {/* Streak */}
                        {voter.streak?.current > 0 && (
                          <span className="text-xs text-orange-400 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> {voter.streak.current}
                          </span>
                        )}
                        
                        {/* Votes */}
                        <span className={`font-bold ${isTop3 ? 'text-orange-400' : 'text-gray-400'}`}>
                          {voter.votes} votes
                        </span>
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No vote data available
              </div>
            )}
          </div>

          {/* Vote Stats */}
          {!loading && votes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card p-6 mt-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-400" />
                Vote Statistics - {monthNames[currentMonth]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Votes</span>
                  <span className="text-orange-400 font-bold">{totalVotes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Top Voter</span>
                  <span className="text-white font-medium">{votes[0]?.username || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Voters</span>
                  <span className="text-white font-medium">{votes.length}</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
