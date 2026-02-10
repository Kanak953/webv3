import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { usePlayers, usePlayerKills, useMobKills, useDeaths, useBlocksMined, useVotes, usePlanPlayerGeolocation, useLuckPermsPlayers } from '@/hooks/useApi';
import { Globe, Skull, Sword, Pickaxe, Coins, Vote, TrendingUp, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import SkinViewer3D from '@/components/SkinViewer3D';

// Generate mock session data for charts
const generateSessionData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      playtime: Math.floor(Math.random() * 4) + 1,
      kills: Math.floor(Math.random() * 20),
      blocks: Math.floor(Math.random() * 5000) + 1000,
    });
  }
  return data;
};

// Format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

// Format money
function formatMoney(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
}

export default function Player() {
  const { username } = useParams<{ username: string }>();
  
  // Fetch all data with 30 second refresh
  const { data: playersData, loading: playersLoading } = usePlayers(30000);
  const { data: killsLeaderboard } = usePlayerKills(30000);
  const { data: mobKillsLeaderboard } = useMobKills(30000);
  const { data: deathsLeaderboard } = useDeaths(30000);
  const { data: blocksMinedLeaderboard } = useBlocksMined(30000);
  const { data: votesLeaderboard } = useVotes('alltime', 30000);
  
  // Fetch player geolocation from Plan API
  const { data: geolocation } = usePlanPlayerGeolocation(username || null);
  
  // Fetch LuckPerms data for player rank
  const { data: luckPermsData } = useLuckPermsPlayers(30000);
  
  // Find player's group from LuckPerms data
  // API returns: { count, players: [{ uuid, username, group, isStaff, isVip }] }
  const playerGroup = useMemo(() => {
    if (!luckPermsData?.players || !username) return { group: 'default' };
    
    const player = luckPermsData.players.find((p: any) => 
      p.username.toLowerCase() === username?.toLowerCase()
    );
    
    return { group: player?.group || 'default' };
  }, [luckPermsData, username]);

  // Find player in players list
  const player = playersData?.players.find(p => 
    p.username.toLowerCase() === username?.toLowerCase()
  );

  // Find player in various leaderboards
  const playerKills = killsLeaderboard?.find(p => p.username.toLowerCase() === username?.toLowerCase());
  const playerMobKills = mobKillsLeaderboard?.find(p => p.username.toLowerCase() === username?.toLowerCase());
  const playerDeaths = deathsLeaderboard?.find(p => p.username.toLowerCase() === username?.toLowerCase());
  const playerBlocksMined = blocksMinedLeaderboard?.find(p => p.username.toLowerCase() === username?.toLowerCase());
  const playerVotes = votesLeaderboard?.find(p => p.username.toLowerCase() === username?.toLowerCase());

  // Calculate ranks
  const playerRank = {
    kills: killsLeaderboard?.findIndex(p => p.username.toLowerCase() === username?.toLowerCase()) ?? -1,
    mobKills: mobKillsLeaderboard?.findIndex(p => p.username.toLowerCase() === username?.toLowerCase()) ?? -1,
    deaths: deathsLeaderboard?.findIndex(p => p.username.toLowerCase() === username?.toLowerCase()) ?? -1,
    blocksMined: blocksMinedLeaderboard?.findIndex(p => p.username.toLowerCase() === username?.toLowerCase()) ?? -1,
    votes: votesLeaderboard?.findIndex(p => p.username.toLowerCase() === username?.toLowerCase()) ?? -1,
  };

  const sessionData = generateSessionData();

  if (playersLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.img
            src="/assets/404pagenpc.png"
            alt="Player Not Found"
            className="w-64 h-64 mx-auto mb-8"
            style={{ filter: 'drop-shadow(0 0 30px rgba(249, 115, 22, 0.5))' }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <h1 className="text-4xl font-bold text-white mb-4">Player Not Found</h1>
          <p className="text-gray-400">The player "{username}" does not exist on ShahiMC.</p>
        </motion.div>
      </div>
    );
  }

  // Calculate K/D ratio
  const kdRatio = playerDeaths?.deaths 
    ? ((playerKills?.kills || 0) / playerDeaths.deaths).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Player Header */}
      <section className="relative min-h-[200px] py-8 overflow-hidden">
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
            {/* Player Name and Rank */}
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">
                {player?.username || username}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {/* Custom Rank Badge */}
              {(() => {
                const group = playerGroup?.group?.toLowerCase() || 'default';
                if (group === 'owner') {
                  return (
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full font-medium border border-pink-500/30">
                      OWNER
                    </span>
                  );
                } else if (group === 'admin') {
                  return (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full font-medium border border-red-500/30">
                      ADMIN
                    </span>
                  );
                } else if (group === 'shahi') {
                  return (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full font-medium border border-yellow-500/30">
                      SHAHI
                    </span>
                  );
                } else if (group === 'voter') {
                  return (
                    <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full font-medium border border-yellow-400/30">
                      VOTER
                    </span>
                  );
                } else if (group === 'vip') {
                  return (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full font-medium border border-purple-500/30">
                      VIP
                    </span>
                  );
                } else {
                  return (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full font-medium border border-green-500/30">
                      PLAYER
                    </span>
                  );
                }
              })()}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          {/* Left Column - Skin & Info */}
          <div className="space-y-6">
            {/* 3D Skin Viewer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 flex justify-center"
            >
              <SkinViewer3D username={username || ''} width={280} height={350} animation="walk" rotateSpeed={0.5} />
            </motion.div>

            {/* Information Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Information</h3>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Activity Section */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Activity</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">First Joined</span>
                      <span className="text-white text-sm">{player.lastLogin || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Last Online</span>
                      <span className="text-white text-sm">{player.lastLogout || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Known As</span>
                      <span className="text-white text-sm">{player.nickname || username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Region</span>
                      <span className="text-white text-sm flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {geolocation?.country || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Joins</span>
                      <span className="text-white text-sm">{Math.floor(Math.random() * 500) + 100}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Play Time</span>
                      <span className="text-white text-sm">{player.playtimeFormatted}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Currencies</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" /> Money
                      </span>
                      <span className="text-green-400 font-medium">{formatMoney(player.balance)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <Vote className="w-4 h-4 text-purple-400" /> Vote Points
                      </span>
                      <span className="text-purple-400 font-medium">{playerVotes?.points || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Charts */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sword className="w-5 h-5 text-red-400" />
                  <span className="text-gray-400 text-sm">Player Kills</span>
                </div>
                <p className="text-2xl font-bold text-white">{playerKills?.kills?.toLocaleString() || 0}</p>
                {playerRank.kills >= 0 && (
                  <p className="text-xs text-orange-400 mt-1">#{playerRank.kills + 1}</p>
                )}
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Skull className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Mob Kills</span>
                </div>
                <p className="text-2xl font-bold text-white">{playerMobKills?.mobKills?.toLocaleString() || 0}</p>
                {playerRank.mobKills >= 0 && (
                  <p className="text-xs text-orange-400 mt-1">#{playerRank.mobKills + 1}</p>
                )}
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Skull className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 text-sm">Deaths</span>
                </div>
                <p className="text-2xl font-bold text-white">{playerDeaths?.deaths?.toLocaleString() || 0}</p>
                {playerRank.deaths >= 0 && (
                  <p className="text-xs text-orange-400 mt-1">#{playerRank.deaths + 1}</p>
                )}
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Pickaxe className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">Blocks Mined</span>
                </div>
                <p className="text-2xl font-bold text-white">{playerBlocksMined?.blocksMined?.toLocaleString() || 0}</p>
                {playerRank.blocksMined >= 0 && (
                  <p className="text-xs text-orange-400 mt-1">#{playerRank.blocksMined + 1}</p>
                )}
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Vote className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">Votes</span>
                </div>
                <p className="text-2xl font-bold text-white">{playerVotes?.votes?.allTime || 0}</p>
                {playerRank.votes >= 0 && (
                  <p className="text-xs text-orange-400 mt-1">#{playerRank.votes + 1}</p>
                )}
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-400 text-sm">K/D Ratio</span>
                </div>
                <p className="text-2xl font-bold text-white">{kdRatio}</p>
              </div>
            </motion.div>

            {/* Mining Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Mining</h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Blocks Mined</p>
                    <p className="text-xl font-bold text-white">{playerBlocksMined?.blocksMined?.toLocaleString() || 0}</p>
                    {playerRank.blocksMined >= 0 && (
                      <span className="text-xs text-orange-400">#{playerRank.blocksMined + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Mining Level</p>
                    <p className="text-xl font-bold text-white">{Math.floor((playerBlocksMined?.blocksMined || 0) / 1000)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Daily Record</p>
                    <p className="text-xl font-bold text-white">{formatNumber(Math.floor(Math.random() * 50000) + 10000)}</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Daily Blocks Mined</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sessionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.9)', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="blocks" 
                            stroke="#f97316" 
                            strokeWidth={2}
                            dot={{ fill: '#f97316', strokeWidth: 0, r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Activity (Hours)</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sessionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.9)', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="playtime" fill="#f97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vote Streak */}
            {playerVotes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">Vote Streak</p>
                      <p className="text-gray-400 text-sm">Current: {playerVotes.streak?.current || 0} days | Best: {playerVotes.streak?.best || 0} days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-400">{playerVotes.votes?.thisMonth || 0}</p>
                    <p className="text-xs text-gray-500">This Month</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
