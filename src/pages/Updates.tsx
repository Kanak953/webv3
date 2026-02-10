import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Calendar, Filter } from 'lucide-react';

// Update types with colors
const updateTypes = [
  { name: 'Feature', color: 'bg-green-500', count: 12 },
  { name: 'Improvement', color: 'bg-blue-500', count: 28 },
  { name: 'Bug Fix', color: 'bg-red-500', count: 15 },
  { name: 'Technical', color: 'bg-purple-500', count: 8 },
  { name: 'Other', color: 'bg-gray-500', count: 5 },
];

// Monthly data
const monthlyUpdates = [
  { month: 'Feb 2026', count: 8 },
  { month: 'Jan 2026', count: 15 },
  { month: 'Dec 2025', count: 12 },
  { month: 'Nov 2025', count: 10 },
  { month: 'Oct 2025', count: 8 },
];

// Example updates
const updatesData = [
  {
    id: 1,
    date: { day: '04', month: 'FEB', year: '2026' },
    title: 'New Rank System',
    type: 'Feature',
    content: 'We have introduced a new rank system with exciting perks and rewards.',
    month: 'February 2026',
  },
  {
    id: 2,
    date: { day: '03', month: 'FEB', year: '2026' },
    title: 'Performance Improvements',
    type: 'Improvement',
    content: 'Server performance has been optimized for smoother gameplay.',
    month: 'February 2026',
  },
  {
    id: 3,
    date: { day: '01', month: 'FEB', year: '2026' },
    title: 'Bug Fix: Vote System',
    type: 'Bug Fix',
    content: 'Fixed an issue where votes were not being counted correctly.',
    month: 'February 2026',
  },
  {
    id: 4,
    date: { day: '28', month: 'JAN', year: '2026' },
    title: 'Database Migration',
    type: 'Technical',
    content: 'Migrated to a new database system for better reliability.',
    month: 'January 2026',
  },
  {
    id: 5,
    date: { day: '25', month: 'JAN', year: '2026' },
    title: 'New Shop Items',
    type: 'Feature',
    content: 'Added new items to the in-game shop.',
    month: 'January 2026',
  },
];

const typeColors: Record<string, string> = {
  'Feature': 'type-feature',
  'Improvement': 'type-improvement',
  'Bug Fix': 'type-bugfix',
  'Technical': 'type-technical',
  'Other': 'type-other',
};

export default function Updates() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter updates
  const filteredUpdates = updatesData.filter(update => {
    const matchesType = selectedType ? update.type === selectedType : true;
    const matchesMonth = selectedMonth ? update.month === selectedMonth : true;
    const matchesSearch = searchQuery 
      ? update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        update.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesType && matchesMonth && matchesSearch;
  });

  // Group by month
  const groupedUpdates = filteredUpdates.reduce((acc, update) => {
    if (!acc[update.month]) acc[update.month] = [];
    acc[update.month].push(update);
    return acc;
  }, {} as Record<string, typeof updatesData>);

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
              Updates
            </h1>
            <p className="text-lg text-gray-400">
              Track all the changes, improvements, and new features added to the server.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-white">{updatesData.length}</p>
                <p className="text-sm text-gray-400">This Year</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-3xl font-bold text-white">{updatesData.length}</p>
                <p className="text-sm text-gray-400">All Time</p>
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Type
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                    selectedType === null ? 'bg-orange-500/20 text-orange-400' : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span className="text-sm">All Types</span>
                  <span className="text-sm text-gray-500">{updatesData.length}</span>
                </button>
                {updateTypes.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => setSelectedType(type.name)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                      selectedType === type.name ? 'bg-orange-500/20 text-orange-400' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${type.color}`} />
                      <span className="text-sm text-gray-300">{type.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{type.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Jump to Month */}
            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Jump to Month
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedMonth(null)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                    selectedMonth === null ? 'bg-orange-500/20 text-orange-400' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm text-gray-300">All Months</span>
                </button>
                {monthlyUpdates.map((month) => (
                  <button
                    key={month.month}
                    onClick={() => setSelectedMonth(month.month)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                      selectedMonth === month.month ? 'bg-orange-500/20 text-orange-400' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{month.month}</span>
                    </div>
                    <span className="text-sm text-gray-500">{month.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Active Filters */}
            {(selectedType || selectedMonth) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Active filters:</span>
                {selectedType && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full flex items-center gap-2">
                    {selectedType}
                    <button onClick={() => setSelectedType(null)} className="hover:text-white">×</button>
                  </span>
                )}
                {selectedMonth && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full flex items-center gap-2">
                    {selectedMonth}
                    <button onClick={() => setSelectedMonth(null)} className="hover:text-white">×</button>
                  </span>
                )}
              </div>
            )}

            {/* Updates List */}
            {Object.keys(groupedUpdates).length > 0 ? (
              Object.entries(groupedUpdates).map(([month, updates]) => (
                <div key={month}>
                  <h2 className="text-xl font-bold text-white mb-4">{month}</h2>
                  <div className="space-y-4">
                    {updates.map((update, index) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="glass-card overflow-hidden"
                      >
                        <div className="flex">
                          {/* Date */}
                          <div className="w-16 bg-white/5 flex flex-col items-center justify-center p-4 border-r border-white/10">
                            <span className="text-xs text-gray-500 uppercase">{update.date.month}</span>
                            <span className="text-2xl font-bold text-white">{update.date.day}</span>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-white mb-2">{update.title}</h3>
                                <p className="text-sm text-gray-400">{update.content}</p>
                              </div>
                              <span className={`px-3 py-1 text-xs rounded-full border ${typeColors[update.type]}`}>
                                {update.type.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No updates found matching your filters.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
