import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  Player, 
  PlayerKillEntry,
  MobKillEntry,
  DeathEntry,
  BlocksMinedEntry,
  RichEntry,
  PlaytimeEntry,
  VoteEntry, 
  ServerStatus, 
  DiscordWidgetData,
  LuckPermsResponse,
  PlanPlayerData 
} from '@/types';

const API_BASE = 'http://140.245.6.26:25005';
const PLAN_API_BASE = 'https://plan.kanakxd.me:8804/v1';

// Generic fetch hook
export function useFetch<T>(url: string | null, interval?: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.warn('API fetch failed:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
    if (interval && interval > 0) {
      const timer = setInterval(fetchData, interval);
      return () => clearInterval(timer);
    }
  }, [fetchData, interval]);

  return { data, loading, error, refetch: fetchData };
}

// Get all players
export function usePlayers(interval?: number) {
  return useFetch<{ count: number; timezone: string; players: Player[] }>(
    `${API_BASE}/api/players`, 
    interval || 30000
  );
}

// Get single player by UUID
export function usePlayer(uuid: string | null) {
  return useFetch<Player>(uuid ? `${API_BASE}/api/player/${uuid}` : null, 30000);
}

// Get player full stats by UUID
export function usePlayerFull(uuid: string | null) {
  return useFetch<{ player: Player; stats: any }>(
    uuid ? `${API_BASE}/api/player/${uuid}/full` : null, 
    30000
  );
}

// Player Kills Leaderboard
export function usePlayerKills(interval?: number) {
  return useFetch<PlayerKillEntry[]>(
    `${API_BASE}/api/stats/playerkills`, 
    interval || 30000
  );
}

// Mob Kills Leaderboard
export function useMobKills(interval?: number) {
  return useFetch<MobKillEntry[]>(
    `${API_BASE}/api/stats/mobkills`, 
    interval || 30000
  );
}

// Deaths Leaderboard
export function useDeaths(interval?: number) {
  return useFetch<DeathEntry[]>(
    `${API_BASE}/api/stats/deaths`, 
    interval || 30000
  );
}

// Blocks Mined Leaderboard
export function useBlocksMined(interval?: number) {
  return useFetch<BlocksMinedEntry[]>(
    `${API_BASE}/api/stats/blocksmined`, 
    interval || 30000
  );
}

// Rich (Balance) Leaderboard
export function useRich(interval?: number) {
  return useFetch<RichEntry[]>(
    `${API_BASE}/api/leaderboard/rich`, 
    interval || 30000
  );
}

// Playtime Leaderboard
export function usePlaytime(interval?: number) {
  return useFetch<PlaytimeEntry[]>(
    `${API_BASE}/api/leaderboard/playtime`, 
    interval || 30000
  );
}

// Votes
export function useVotes(type: 'alltime' | 'monthly' | 'streaks' = 'alltime', interval?: number) {
  const endpoints: Record<string, string> = {
    'alltime': `${API_BASE}/api/votes/alltime`,
    'monthly': `${API_BASE}/api/votes/monthly`,
    'streaks': `${API_BASE}/api/votes/streaks`,
  };
  
  return useFetch<VoteEntry[]>(endpoints[type], interval || 30000);
}

// Last Month Votes (for historical data)
export function useLastMonthVotes(interval?: number) {
  return useFetch<VoteEntry[]>(
    `${API_BASE}/api/votes/lastmonth`,
    interval || 30000
  );
}

// Server status - using mcstatus.io which supports CORS
export function useServerStatus(interval?: number) {
  return useFetch<ServerStatus>(
    `https://api.mcstatus.io/v2/status/java/140.245.6.26:25004`, 
    interval || 10000
  );
}

// Discord widget - Discord API supports CORS
export function useDiscordWidget(interval?: number) {
  return useFetch<DiscordWidgetData>(
    'https://discord.com/api/guilds/1334147142880727140/widget.json', 
    interval || 30000
  );
}

// LuckPerms - all players
export function useLuckPermsPlayers(interval?: number) {
  return useFetch<LuckPermsResponse>(
    `${API_BASE}/api/luckperms/players`, 
    interval || 30000
  );
}

// LuckPerms - specific group
export function useLuckPermsGroup(group: string | null, interval?: number) {
  return useFetch<{ group: string; prefix: string; players: any[] }>(
    group ? `${API_BASE}/api/luckperms/group/${group}` : null,
    interval || 30000
  );
}

// LuckPerms - get player's group by username
export function useLuckPermsPlayerGroup(username: string | null, interval?: number) {
  const { data, loading, error } = useFetch<LuckPermsResponse>(
    `${API_BASE}/api/luckperms/players`,
    interval || 30000
  );
  
  // Find the player's group from the response
  const playerGroup = useMemo(() => {
    if (!data || !username) return null;
    
    // Search through all groups to find the player
    for (const group of data.groups) {
      const player = group.players.find(p => 
        p.username.toLowerCase() === username.toLowerCase()
      );
      if (player) {
        return {
          group: group.group,
          prefix: group.prefix,
          player: player
        };
      }
    }
    return null;
  }, [data, username]);
  
  return { 
    data: playerGroup, 
    loading, 
    error,
    rawData: data 
  };
}

// Plan API - Note: This has IP whitelist and may not work
export function usePlanPlayer(playerName: string | null) {
  return useFetch<PlanPlayerData>(
    playerName ? `${PLAN_API_BASE}/player?player=${playerName}` : null,
    60000
  );
}

// Plan API - Get player geolocation/region data
export function usePlanPlayerGeolocation(playerName: string | null) {
  const { data, loading, error } = useFetch<any>(
    playerName ? `${PLAN_API_BASE}/player?player=${playerName}` : null,
    60000
  );
  
  // Extract geolocation from connections array
  // The API returns connections with geolocation field
  const connections = data?.connections || [];
  const geolocation = connections.length > 0 ? connections[0].geolocation : null;
  
  return { 
    data: geolocation ? { country: geolocation } : null, 
    loading, 
    error,
    rawData: data 
  };
}

// Combined leaderboard hook
export function useLeaderboard(type: string, interval?: number) {
  switch (type) {
    case 'playerkills':
      return usePlayerKills(interval);
    case 'mobkills':
      return useMobKills(interval);
    case 'deaths':
      return useDeaths(interval);
    case 'blocksmined':
      return useBlocksMined(interval);
    case 'rich':
    case 'economy-money':
      return useRich(interval);
    case 'playtime':
      return usePlaytime(interval);
    case 'votes':
      return useVotes('alltime', interval);
    default:
      return { data: null, loading: false, error: new Error('Unknown leaderboard type'), refetch: () => {} };
  }
}
