import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
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
          <img
            src="/assets/404pagenpc.png"
            alt="Page Not Found"
            className="w-64 h-64 mx-auto glow-404"
          />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <Home className="w-5 h-5" />
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
