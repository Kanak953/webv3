import HeroSection from '@/components/HeroSection';
import NewsFeed from '@/components/NewsFeed';
import HowToJoin from '@/components/HowToJoin';
import ServerStatus from '@/components/ServerStatus';
import StayConnected from '@/components/StayConnected';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Main Content */}
      <div className="bg-background max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left Column - News Feed */}
          <div>
            <NewsFeed />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <HowToJoin />
            <StayConnected />
            <ServerStatus />
          </div>
        </div>
      </div>
    </div>
  );
}
