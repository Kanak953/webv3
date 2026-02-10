import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Staff data with roles
const staffMembers = [
  { name: 'Aarav24_', role: 'Owner', color: 'role-owner' },
  { name: 'KanakXD', role: 'Lead Developer', color: 'role-developer' },
  { name: 'Fangaming2169', role: 'Admin', color: 'role-admin' },
  { name: 'blonded_', role: 'Admin', color: 'role-admin' },
  { name: 'Sg_playz42', role: 'Admin', color: 'role-admin' },
];

export default function Staff() {
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
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Staff Team
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Meet the dedicated team keeping the server running smoothly
            </p>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <p className="text-center text-gray-400">
          Our staff team is committed to creating a welcoming, fair, and enjoyable environment for all players. 
          Whether you need assistance, have questions, or want to report an issue, feel free to reach out to 
          any staff member in-game or through Discord.
        </p>
      </motion.section>

      {/* Staff Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {staffMembers.map((staff, index) => (
              <motion.div
                key={staff.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/player/${staff.name}`} className="block group">
                  <div className="glass-card overflow-hidden hover:bg-white/10 transition-all duration-300 group-hover:translate-y-[-4px]">
                    {/* Skin Render using nmsr.nickac.dev */}
                    <div className="relative h-48 bg-gradient-to-b from-[#1a0a2e]/50 to-background flex items-center justify-center overflow-hidden">
                      <motion.img
                        src={`https://nmsr.nickac.dev/bust/${staff.name}`}
                        alt={staff.name}
                        className="h-40 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to mc-heads if nmsr fails
                          (e.target as HTMLImageElement).src = `https://mc-heads.net/body/${staff.name}/256`;
                        }}
                      />
                      
                      {/* Role Badge */}
                      <div className={`absolute bottom-0 left-0 right-0 ${staff.color} py-1.5 text-center`}>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {staff.role}
                        </span>
                      </div>
                    </div>
                    
                    {/* Name */}
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {staff.name}
                      </h3>
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
