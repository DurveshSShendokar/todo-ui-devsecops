import React from "react";

const BulletinBoard = () => (
  <section className="relative bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-md border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
          <span className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            📢
          </span>
          <span>Company Bulletin Board</span>
        </h2>
        <p className="text-gray-300 text-sm">
          Stay updated with the latest company news and announcements
        </p>
      </div>
      {/* Scrolling News Ticker */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-6 overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            LIVE
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap text-white">
              🎉 Welcome new team members joining this month! • 🚀 ZioTeams
              v2.0 launching next quarter • 💼 Now hiring: 4 urgent
              positions available • 🏆 Q2 performance bonuses announced • 🌟
              Company retreat planned for December • 📱 Mobile app beta
              testing starts soon
            </div>
          </div>
        </div>
      </div>
      {/* Recent Announcements Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Announcement 1 */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              🎯
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold text-sm">
                  Q2 Goals Achieved
                </h3>
                <span className="text-xs text-gray-400">2 days ago</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Congratulations team! We've exceeded our Q2 targets by 115%.
                Performance bonuses will be credited next week.
              </p>
              <div className="mt-2">
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                  Achievement
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Announcement 2 */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              🚀
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold text-sm">
                  Product Launch
                </h3>
                <span className="text-xs text-gray-400">5 days ago</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                ZioTeams 2.0 with AI-powered analytics is set to launch Q4
                2025. Beta testing begins internally next month.
              </p>
              <div className="mt-2">
                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                  Product
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Announcement 3 */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
              🏝️
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold text-sm">
                  Team Expo 2025
                </h3>
                <span className="text-xs text-gray-400">1 week ago</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Annual team attending Software Expo in December.
                Registration opens next month.
              </p>
              <div className="mt-2">
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                  Event
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      @keyframes marquee {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
      .animate-marquee {
        animation: marquee 30s linear infinite;
      }
    `}</style>
  </section>
);

export default BulletinBoard;