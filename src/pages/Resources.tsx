import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Vote } from 'lucide-react';

const resources = [
  {
    title: 'Vote',
    subtitle: 'Daily Rewards',
    description: 'Support the server and earn vote keys with exclusive rewards.',
    href: '/vote',
    icon: Vote,
    image: '/assets/vote.jpg',
  },
  {
    title: 'About',
    subtitle: 'Our Story',
    description: 'Learn more about ShahiMC and our journey.',
    href: '/about',
    icon: BookOpen,
    image: '/assets/about.jpg',
  },
  {
    title: 'Staff',
    subtitle: 'Our Team',
    description: 'Meet the dedicated team keeping the server running smoothly.',
    href: '/staff',
    icon: Users,
    image: '/assets/staff.jpg',
  },
];

export default function Resources() {
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
              Resources
            </h1>
            <p className="text-lg text-gray-400">
              Guides, information, and everything you need to get started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={resource.href}
                className="block group"
              >
                <div className="glass-card overflow-hidden h-full hover:bg-white/10 transition-all duration-300 group-hover:translate-y-[-4px]">
                  {/* Image */}
                  <div 
                    className="relative h-48 bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: `url(${resource.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <resource.icon className="w-16 h-16 text-white/30 group-hover:text-orange-400/50 transition-colors" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">
                      {resource.subtitle}
                    </p>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
