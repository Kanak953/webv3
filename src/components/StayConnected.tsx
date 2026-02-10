import { motion } from 'framer-motion';
import { useDiscordWidget } from '@/hooks/useApi';

// EDIT THIS MANUALLY
const TOTAL_MEMBERS = 52; // ← Change this to your actual member count

export default function StayConnected() {
  const { data: discordData, loading } = useDiscordWidget();

  const onlineCount = discordData?.presence_count || 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-bold text-white mb-4">STAY CONNECTED</h2>

      <a
        href="https://discord.gg/8c84ufEVqx"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 rounded-xl transition-all group"
      >
        {/* Discord Icon */}
        <div className="w-14 h-14 bg-[#5865F2] rounded-xl flex items-center justify-center flex-shrink-0">
          <svg 
            viewBox="0 0 24 24" 
            className="w-8 h-8 text-white"
            fill="currentColor"
          >
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold group-hover:text-[#5865F2] transition-colors">
              Official Discord
            </h3>
          </div>
          <p className="text-gray-400 text-sm truncate">
            Community, support, updates & giveaways
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="flex items-center gap-1.5 text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-medium">{loading ? '...' : onlineCount.toLocaleString()}</span>
            </div>
            <div className="text-gray-500 text-xs">Online</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-white text-sm font-medium">{TOTAL_MEMBERS.toLocaleString()}</div>
            <div className="text-gray-500 text-xs">Members</div>
          </div>
        </div>
      </a>
    </motion.section>
  );
}
