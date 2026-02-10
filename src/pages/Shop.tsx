import { motion } from 'framer-motion';
import { Construction, Sparkles } from 'lucide-react';

export default function Shop() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto px-4"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <Construction className="w-24 h-24 text-orange-400 mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Store Coming Soon
        </h1>
        
        <p className="text-lg text-gray-400 mb-8">
          Our store is currently under construction. Stay tuned for exclusive items, ranks, and more!
        </p>
        
        <div className="glass-card p-6 inline-block">
          <div className="flex items-center gap-2 text-orange-400">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Exciting features coming your way!</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
