// Player types from /api/players
export interface Player {
  uuid: string;
  username: string;
  nickname: string | null;
  playtimeMs: number;
  playtimeHours: number;
  playtimeFormatted: string;
  balance: number;
  lastLogin: string;
  lastLogout: string;
  skin: string | null;
  votifier: number;
}

// AjLeaderboards stats
export interface PlayerKillEntry {
  uuid: string;
  username: string;
  prefix: string;
  suffix: string;
  kills: number;
  formattedKills: string;
}

export interface MobKillEntry {
  uuid: string;
  username: string;
  mobKills: number;
  formattedMobKills: string;
}

export interface DeathEntry {
  uuid: string;
  username: string;
  deaths: number;
  formattedDeaths: string;
}

export interface BlocksMinedEntry {
  uuid: string;
  username: string;
  blocksMined: number;
  formattedBlocksMined: string;
}

// CMI Leaderboards
export interface RichEntry {
  uuid: string;
  username: string;
  balance: number;
  playtimeFormatted: string;
  playtimeHours: number;
  skin: string | null;
}

export interface PlaytimeEntry {
  uuid: string;
  username: string;
  playtimeMs: number;
  playtimeFormatted: string;
  playtimeHours: number;
  balance: number;
  skin: string | null;
}

// Votes API
export interface VoteEntry {
  uuid: string;
  username: string;
  votes: {
    allTime: number;
    thisMonth: number;
    thisWeek: number;
    today: number;
  };
  formattedVotes: {
    allTime: string;
    thisMonth: string;
    thisWeek: string;
    today: string;
  };
  streak: {
    current: number;
    best: number;
  };
  points: number;
  lastOnline: string;
}

// Server status
export interface ServerStatus {
  online: boolean;
  players: {
    online: number;
    max: number;
    list: Array<{
      name_clean: string;
      uuid: string;
    }>;
  };
}

// Discord widget
export interface DiscordWidgetData {
  id: string;
  name: string;
  instant_invite: string;
  presence_count: number;
  members: Array<{
    id: string;
    username: string;
    avatar: string | null;
    status: string;
  }>;
}

// LuckPerms
export interface LuckPermsPlayer {
  uuid: string;
  username: string;
  group: string;
  isStaff: boolean;
  isVip: boolean;
}

export interface LuckPermsGroup {
  group: string;
  prefix: string;
  players: LuckPermsPlayer[];
}

export interface LuckPermsResponse {
  count: number;
  groups: LuckPermsGroup[];
}

// News/Updates
export interface NewsItem {
  id: number;
  date: { day: string; month: string; year: string };
  title: string;
  type: 'Feature' | 'Improvement' | 'Bug Fix' | 'Technical' | 'Other';
  readTime: string;
  content: string;
  eventDetails?: string;
}

// Plan API - Note: This API has IP whitelist, may not work
export interface PlanPlayerData {
  player_name: string;
  player_uuid: string;
  registered: number;
  last_seen: number;
  geo_info?: {
    country: string;
    city?: string;
  };
  kill_data?: {
    player_kills_total: number;
    mob_kills_total: number;
    deaths_total: number;
    player_kills_7d: number;
    mob_kills_7d: number;
    deaths_7d: number;
    player_kills_30d: number;
    mob_kills_30d: number;
    deaths_30d: number;
  };
  sessions?: Array<{
    start: number;
    length: number;
    mob_kills: number;
    player_kills: number;
    deaths: number;
    server_name?: string;
    name?: string;
  }>;
}

// Player profile combined data
export interface PlayerProfile {
  uuid: string;
  username: string;
  playtimeFormatted: string;
  playtimeHours: number;
  balance: number;
  skin: string | null;
  prefix?: string;
  kills?: number;
  mobKills?: number;
  deaths?: number;
  blocksMined?: number;
  votes?: VoteEntry;
}
