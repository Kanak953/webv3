import { motion } from 'framer-motion';
import { Calendar, Clock, Tag } from 'lucide-react';

interface NewsItem {
  id: number;
  date: { day: string; month: string; year: string };
  title: string;
  type: string;
  readTime: string;
  content: string;
  eventDetails?: string;
}

// Template news items - Edit these to add your own news
const newsItems: NewsItem[] = [
  {
    id: 1,
    date: { day: '04', month: 'FEB', year: '2026' },
    title: 'WEEKEND EVENTS',
    type: 'ANNOUNCEMENT',
    readTime: '2 min read',
    content: 'Join us this weekend for exciting events and rewards! Check out our Discord for more details.',
    eventDetails: 'Event Details: Check Discord for schedule',
  },
  {
    id: 2,
    date: { day: '01', month: 'FEB', year: '2026' },
    title: 'SERVER UPDATE v2.5',
    type: 'UPDATE',
    readTime: '3 min read',
    content: 'We have released a new update with bug fixes and performance improvements.',
  },
  {
    id: 3,
    date: { day: '28', month: 'JAN', year: '2026' },
    title: 'NEW RANKS ADDED',
    type: 'FEATURE',
    readTime: '1 min read',
    content: 'New ranks have been added to the server! Check them out in-game.',
  },
  {
    id: 4,
    date: { day: '25', month: 'JAN', year: '2026' },
    title: 'BUG FIXES',
    type: 'BUG FIX',
    readTime: '2 min read',
    content: 'Fixed various bugs reported by the community. Thank you for your patience!',
  },
  {
    id: 5,
    date: { day: '20', month: 'JAN', year: '2026' },
    title: 'MAINTENANCE COMPLETE',
    type: 'TECHNICAL',
    readTime: '1 min read',
    content: 'Scheduled maintenance has been completed successfully.',
  },
];

export default function NewsFeed() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          NEWS FEED
        </h2>

        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card-hover p-6 group cursor-pointer"
            >
              <div className="flex gap-4">
                {/* Date */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-orange-500 text-xs font-bold">{item.date.month}</div>
                  <div className="text-white text-3xl font-bold">{item.date.day}</div>
                  <div className="text-gray-500 text-xs">{item.date.year}</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold text-lg group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h3>
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readTime}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm whitespace-pre-line mb-3">
                    {item.content}
                  </p>

                  {item.eventDetails && (
                    <div className="flex items-start gap-2 text-sm text-gray-400 bg-white/5 rounded-lg p-3">
                      <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>{item.eventDetails}</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="hidden sm:block flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
