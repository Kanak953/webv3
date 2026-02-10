import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sword, 
  Shield, 
  Users, 
  Map, 
  Gem, 
  Trophy,
  Heart,
  Zap,
  ChevronRight
} from 'lucide-react';

const features = [
  {
    icon: Sword,
    title: 'Survival Gameplay',
    description: 'Experience classic Minecraft survival with a twist. Gather resources, build your base, and survive the night.',
  },
  {
    icon: Shield,
    title: 'Land Claims',
    description: 'Protect your builds with our easy-to-use land claiming system. Never worry about griefers again.',
  },
  {
    icon: Users,
    title: 'Friendly Community',
    description: 'Join a welcoming community of players. Make friends, trade, and collaborate on epic projects.',
  },
  {
    icon: Map,
    title: 'Custom World',
    description: 'Explore a carefully curated world with custom terrain, dungeons, and hidden treasures.',
  },
  {
    icon: Gem,
    title: 'Economy System',
    description: 'Trade with other players, run your own shop, and become the richest player on the server.',
  },
  {
    icon: Trophy,
    title: 'Leaderboards',
    description: 'Compete with other players on our leaderboards. Show off your skills and climb the ranks.',
  },
];

const stats = [
  { value: '50+', label: 'Player Slots' },
  { value: '1.21.4', label: 'Minecraft Version' },
  { value: '24/7', label: 'Uptime' },
  { value: '0%', label: 'Pay to Win' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[400px] py-16 overflow-hidden">
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
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-orange-400">ShahiMC</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A premium Minecraft survival server built for players who love the classic experience with modern enhancements.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-4"
                >
                  <p className="text-3xl font-bold text-orange-400">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Server Features</h2>
          <p className="text-gray-400">Everything you need for the ultimate survival experience</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                  <Icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Rules Section */}
      <section className="bg-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Server Rules</h2>
            <p className="text-gray-400">Follow these simple rules to keep our community friendly and fun</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Heart, title: 'Be Respectful', desc: 'Treat all players with respect. No harassment, bullying, or hate speech.' },
              { icon: Shield, title: 'No Griefing', desc: 'Do not destroy or steal from other players\' builds. Use the land claim system.' },
              { icon: Zap, title: 'No Cheating', desc: 'Use of hacks, mods, or exploits is strictly prohibited.' },
              { icon: Users, title: 'No Spamming', desc: 'Avoid excessive messages, caps, or repeated content in chat.' },
            ].map((rule, index) => {
              const Icon = rule.icon;
              return (
                <motion.div
                  key={rule.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 glass-card p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{rule.title}</h3>
                    <p className="text-gray-400 text-sm">{rule.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">How to Join</h2>
          <p className="text-gray-400">Getting started is easy. Follow these simple steps:</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { step: '1', title: 'Launch Minecraft', desc: 'Open Minecraft Java Edition (version 1.21.4)' },
            { step: '2', title: 'Add Server', desc: 'Click "Add Server" and enter: play.shahimc.in' },
            { step: '3', title: 'Start Playing', desc: 'Click "Join Server" and start your adventure!' },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Adventure?</h2>
            <p className="text-gray-400 mb-6">Join ShahiMC today and become part of our growing community!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vote"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                <Trophy className="w-5 h-5" />
                Vote for Rewards
              </Link>
              <a
                href="https://discord.gg/8c84ufEVqx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
                Join Discord
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
