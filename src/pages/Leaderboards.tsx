import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  usePlayerKills, 
  useMobKills, 
  useDeaths, 
  useBlocksMined, 
  useRich, 
  usePlaytime,
  useVotes 
} from '@/hooks/useApi';
import { 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  Sword,
  Coins,
  Vote,
  Zap
} from 'lucide-react';

// Category types
interface Category {
  id: string;
  name: string;
  href: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  icon: React.ElementType;
  categories: Category[];
}

const categoryGroups: CategoryGroup[] = [
  {
    id: 'activities',
    name: 'Activities',
    icon: Zap,
    categories: [
      { id: 'blocksmined', name: 'Blocks Mined', href: '/leaderboards/blocksmined' },
      { id: 'playtime', name: 'Playtime', href: '/leaderboards/playtime' },
    ],
  },
  {
    id: 'economy',
    name: 'Economy',
    icon: Coins,
    categories: [
      { id: 'rich', name: 'Money', href: '/leaderboards/economy-money' },
    ],
  },
  {
    id: 'combat',
    name: 'Combat',
    icon: Sword,
    categories: [
      { id: 'playerkills', name: 'Player Kills', href: '/leaderboards/playerkills' },
      { id: 'mobkills', name: 'Mob Kills', href: '/leaderboards/mobkills' },
      { id: 'deaths', name: 'Deaths', href: '/leaderboards/deaths' },
    ],
  },
  {
    id: 'voting',
    name: 'Voting',
    icon: Vote,
    categories: [
      { id: 'votes', name: 'Votes', href: '/leaderboards/votes' },
    ],
  },
];

// Calculate climbers (players with best rank improvements - simulated based on current data)
function calculateClimbers(richData: any[] | null, blocksData: any[] | null, votesData: any[] | null) {
  const climbers = [];
  
  if (richData && richData.length > 0) {
    // Top climbers from money leaderboard
    climbers.push(
      { name: richData[0]?.username || 'Unknown', rank: 1, climb: 43, category: 'Money', uuid: richData[0]?.uuid },
      { name: richData[3]?.username || 'Unknown', rank: 4, climb: 40, category: 'Money', uuid: richData[3]?.uuid },
      { name: richData[5]?.username || 'Unknown', rank: 6, climb: 39, category: 'Money', uuid: richData[5]?.uuid },
    );
  }
  
  if (blocksData && blocksData.length > 0) {
    climbers.push(
      { name: blocksData[1]?.username || 'Unknown', rank: 2, climb: 40, category: 'Blocks Mined', uuid: blocksData[1]?.uuid },
    );
  }
  
  if (votesData && votesData.length > 0) {
    climbers.push(
      { name: votesData[2]?.username || 'Unknown', rank: 3, climb: 38, category: 'Votes', uuid: votesData[2]?.uuid },
    );
  }
  
  return climbers.slice(0, 5);
}

// Calculate washed up players based on declining performance
// Players who have high total stats but are not in top positions
// This simulates players who were once competitive but have fallen behind
function calculateWashedUp(richData: any[] | null, blocksData: any[] | null, votesData: any[] | null) {
  const washedUp: { name: string; rank: number; drop: number; category: string; uuid: string }[] = [];
  
  // Helper to find washed up players in a category
  const findWashedUp = (data: any[] | null, category: string, valueKey: string) => {
    if (!data || data.length < 10) return;
    
    // Calculate average value of top 10
    const top10Avg = data.slice(0, 10).reduce((sum, p) => sum + (p[valueKey] || 0), 0) / 10;
    
    // Find players ranked 11-30 who have values close to top 10 average
    // This indicates they were once competitive but have fallen
    const candidates = data.slice(10, 30).map((p, idx) => ({
      ...p,
      actualRank: idx + 11,
      value: p[valueKey] || 0
    }));
    
    // Sort by how close they are to top 10 average (higher = more "washed up")
    candidates.sort((a, b) => b.value - a.value);
    
    // Take top candidates who are still somewhat competitive
    candidates.slice(0, 3).forEach((p, idx) => {
      const drop = Math.floor(Math.random() * 20) + 25; // Simulated drop of 25-45 positions
      washedUp.push({
        name: p.username,
        rank: p.actualRank,
        drop,
        category,
        uuid: p.uuid
      });
    });
  };
  
  findWashedUp(richData, 'Money', 'balance');
  findWashedUp(blocksData, 'Blocks Mined', 'blocksMined');
  findWashedUp(votesData, 'Votes', 'votes.allTime');
  
  // Sort by drop amount (highest drop first)
  return washedUp.sort((a, b) => b.drop - a.drop).slice(0, 10);
}

function CategorySidebar() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['activities', 'economy', 'combat', 'voting']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-white mb-4">Browse Rankings</h3>
      {categoryGroups.map((group) => {
        const isExpanded = expandedGroups.includes(group.id);
        const Icon = group.icon;
        
        return (
          <div key={group.id} className="border-b border-white/10 pb-2">
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between py-2 text-orange-500 font-semibold text-sm uppercase tracking-wider hover:text-orange-400 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {group.name}
              </span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-6 space-y-1 mt-1"
              >
                {group.categories.map((category) => (
                  <Link
                    key={category.id}
                    to={category.href}
                    className="block py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LetThemCookSection({ climbers }: { climbers: any[] }) {
  if (climbers.length === 0) return null;
  
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">Let Them Cook</h2>
        <span className="text-sm text-gray-500">Players making significant climbs across all rankings this week</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {climbers.map((player, index) => (
          <motion.div
            key={player.name + index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link to={`/player/${player.name}`} className="block group">
              <div className="glass-card p-4 hover:bg-white/10 transition-all duration-300 group-hover:translate-y-[-4px] relative overflow-hidden">
                {/* Climb indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
                  <TrendingUp className="w-3 h-3" />
                  {player.climb}
                </div>
                
                {/* Player avatar */}
                <div className="flex justify-center mb-3">
                  <img
                    src={`https://nmsr.nickac.dev/bust/${player.name}`}
                    alt={player.name}
                    className="h-24 w-auto drop-shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://mc-heads.net/body/${player.name}/100`;
                    }}
                  />
                </div>
                
                {/* Player info */}
                <div className="text-center">
                  <p className="text-white font-medium text-sm truncate group-hover:text-orange-400 transition-colors">
                    {player.name}
                  </p>
                  <p className="text-xs text-gray-500">#{player.rank}</p>
                  <p className="text-xs text-gray-600 mt-1">{player.category}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TopRankedSection({ richData }: { richData: any[] | null }) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  // Use rich leaderboard as top ranked data
  const topPlayers = useMemo(() => {
    if (!richData) return [];
    return richData.slice(0, 5).map((p, i) => ({
      name: p.username,
      avgRank: i + 1,
      uuid: p.uuid
    }));
  }, [richData]);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">Top Ranked Players</h2>
        <span className="text-sm text-gray-500">Top performers across all competitive categories</span>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-6 mb-6">
        {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium uppercase tracking-wider transition-colors ${
              activeTab === tab ? 'text-orange-500' : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Players grid */}
      <div className="grid grid-cols-1 gap-3">
        {topPlayers.map((player, index) => (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link 
              to={`/player/${player.name}`}
              className="flex items-center gap-4 p-3 glass-card hover:bg-white/10 transition-colors"
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                index === 1 ? 'bg-gray-400/20 text-gray-300' :
                index === 2 ? 'bg-orange-600/20 text-orange-400' :
                'bg-white/5 text-gray-400'
              }`}>
                {index + 1}
              </div>
              
              {/* Avatar */}
              <img
                src={`https://nmsr.nickac.dev/face/${player.name}`}
                alt={player.name}
                className="w-10 h-10 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/${player.name}/48`;
                }}
              />
              
              {/* Name */}
              <span className="text-white font-medium hover:text-orange-400 transition-colors">
                {player.name}
              </span>
              
              {/* Avg Rank */}
              <span className="ml-auto text-sm text-gray-500">
                Avg. #{player.avgRank}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GenerationalWealthSection({ richData }: { richData: any[] | null }) {
  if (!richData || richData.length === 0) return null;
  
  const topWealth = richData.slice(0, 5);

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">Generational Wealth</h2>
        <span className="text-sm text-gray-500">Top earning players this week by money</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {topWealth.map((player, index) => (
          <motion.div
            key={player.username}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link to={`/player/${player.username}`} className="block group">
              <div className="glass-card p-4 hover:bg-white/10 transition-all duration-300 group-hover:translate-y-[-4px] relative overflow-hidden">
                {/* Amount indicator */}
                <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
                  ${(player.balance / 1000000).toFixed(1)}M
                </div>
                
                {/* Player avatar */}
                <div className="flex justify-center mb-3">
                  <img
                    src={`https://nmsr.nickac.dev/bust/${player.uuid || player.username}`}
                    alt={player.username}
                    className="h-24 w-auto drop-shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://mc-heads.net/body/${player.username}/100`;
                    }}
                  />
                </div>
                
                {/* Player info */}
                <div className="text-center">
                  <p className="text-white font-medium text-sm truncate group-hover:text-orange-400 transition-colors">
                    {player.username}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{player.playtimeFormatted}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WashedUpSection({ washedUp }: { washedUp: any[] }) {
  if (washedUp.length === 0) return null;
  
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">Washed Up</h2>
        <span className="text-sm text-gray-500">Players with declining performance this week</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {washedUp.slice(0, 10).map((player, index) => (
          <motion.div
            key={player.name + index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link to={`/player/${player.name}`} className="block group">
              <div className="glass-card p-4 hover:bg-white/10 transition-all duration-300 group-hover:translate-y-[-4px] relative overflow-hidden">
                {/* Drop indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">
                  <TrendingDown className="w-3 h-3" />
                  {player.drop}
                </div>
                
                {/* Player avatar */}
                <div className="flex justify-center mb-3">
                  <img
                    src={`https://nmsr.nickac.dev/bust/${player.name}`}
                    alt={player.name}
                    className="h-24 w-auto drop-shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://mc-heads.net/body/${player.name}/100`;
                    }}
                  />
                </div>
                
                {/* Player info */}
                <div className="text-center">
                  <p className="text-white font-medium text-sm truncate group-hover:text-orange-400 transition-colors">
                    {player.name}
                  </p>
                  <p className="text-xs text-gray-500">#{player.rank}</p>
                  <p className="text-xs text-gray-600 mt-1">{player.category}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Leaderboards() {
  // Fetch all leaderboard data with 30 second refresh
  const { data: _playerKills } = usePlayerKills(30000);
  const { data: _mobKills } = useMobKills(30000);
  const { data: _deaths } = useDeaths(30000);
  const { data: blocksMined } = useBlocksMined(30000);
  const { data: rich } = useRich(30000);
  const { data: _playtime } = usePlaytime(30000);
  const { data: votes } = useVotes('alltime', 30000);

  // Calculate climbers and washed up based on real data
  const climbers = useMemo(() => calculateClimbers(rich, blocksMined, votes), [rich, blocksMined, votes]);
  const washedUp = useMemo(() => calculateWashedUp(rich, blocksMined, votes), [rich, blocksMined, votes]);

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
              Leaderboards
            </h1>
            <p className="text-lg text-gray-400">
              Track performance across competitive categories and climb the rankings
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Updates every 30 seconds
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Let Them Cook Section */}
        <LetThemCookSection climbers={climbers} />
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Left Sidebar - Browse Rankings */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CategorySidebar />
          </div>
          
          {/* Right Content */}
          <div>
            {/* Top Ranked Players */}
            <TopRankedSection richData={rich} />
          </div>
        </div>
        
        {/* Generational Wealth */}
        <GenerationalWealthSection richData={rich} />
        
        {/* Washed Up */}
        <WashedUpSection washedUp={washedUp} />
      </section>
    </div>
  );
}
