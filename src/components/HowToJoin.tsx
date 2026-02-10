import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function HowToJoin() {
  const [copied, setCopied] = useState(false);
  const serverAddress = 'play.shahimc.in';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(serverAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 relative overflow-visible"
    >
      {/* Character Image - Using the provided NPC */}
      <div className="absolute -right-2 -top-16 w-32 h-40 z-20 pointer-events-none">
        <motion.img
          src="/assets/howtojoinbesidenpc.png"
          alt="Minecraft Character"
          className="w-full h-full object-contain drop-shadow-2xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Glow effect behind character */}
        <div className="absolute inset-0 -z-10 blur-xl bg-orange-500/20 rounded-full scale-75" />
      </div>

      <h2 className="text-xl font-bold text-white mb-4">HOW TO JOIN?</h2>

      {/* Version Badge */}
      <div className="mb-4">
        <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full">
          1.21.4
        </span>
      </div>

      {/* Server Address */}
      <div className="mb-2">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">SERVER ADDRESS</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-white font-mono text-lg font-semibold">
            {serverAddress}
          </code>
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-xl transition-all duration-200 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
            title="Copy to clipboard"
          >
            <motion.div
              initial={false}
              animate={{ scale: copied ? [1, 1.3, 1] : 1, rotate: copied ? [0, 10, 0] : 0 }}
              transition={{ duration: 0.3 }}
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Copy feedback text */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : -10 }}
        className="text-green-400 text-xs mt-2 font-medium"
      >
        Copied to clipboard!
      </motion.p>
    </motion.section>
  );
}
