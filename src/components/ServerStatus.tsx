import { motion } from 'framer-motion';
import { useServerStatus } from '@/hooks/useApi';

export default function ServerStatus() {
  const { data: serverData, loading } = useServerStatus();

  const onlinePlayers = serverData?.players?.online || 0;
  const maxPlayers = serverData?.players?.max || 100;
  const players = serverData?.players?.list || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-bold text-white mb-4">SERVER STATUS</h2>

      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full animate-pulse ${serverData?.online ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-white font-medium">{serverData?.online ? 'Online' : 'Offline'}</span>
        </div>
        <div className="text-gray-400 text-sm">
          <span className="text-white font-semibold">{loading ? '...' : onlinePlayers}</span> / {maxPlayers}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(onlinePlayers / maxPlayers) * 100}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-full rounded-full ${serverData?.online ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gray-500'}`}
        />
      </div>

      {/* Players Grid */}
      <div>
        <p className="text-gray-400 text-sm mb-3">Online Players</p>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : players.length > 0 ? (
          <div className="grid grid-cols-8 gap-2">
            {players.slice(0, 32).map((player, index) => (
              <motion.a
                key={player.uuid || index}
                href={`/player/${player.name_clean}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="group relative"
                title={player.name_clean}
              >
                {/* Flat Face Avatar */}
                <div className="relative w-full aspect-square hover:scale-110 transition-transform">
                  <img
                    src={`https://mc-heads.net/avatar/${player.name_clean}/64`}
                    alt={player.name_clean}
                    className="w-full h-full object-contain rounded-md"
                    loading="lazy"
                  />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 border border-gray-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {player.name_clean}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {serverData?.online ? 'No players online' : 'Server is offline'}
          </div>
        )}

        {onlinePlayers > 32 && (
          <p className="text-center text-gray-500 text-sm mt-3">
            +{onlinePlayers - 32} more players
          </p>
        )}
      </div>
    </motion.section>
  );
}
