import React from "react";

const ProductivityTracking = () => (
  <div className="mb-20">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white mb-4">
        Real-Time Productivity Tracking
      </h2>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Monitor your productivity and celebrate achievements in
        real-time
      </p>
    </div>
    <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Daily Productivity Score */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Today's Productivity
          </h3>
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#374151"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray={`${(87 / 100) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">
                  87%
                </div>
                <div className="text-sm text-gray-400">Score</div>
              </div>
            </div>
          </div>
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
              <span className="text-gray-300 font-medium">
                Tasks Completed
              </span>
              <span className="text-green-400 font-bold text-lg">
                12/14
              </span>
            </div>
            <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
              <span className="text-gray-300 font-medium">
                Focus Time
              </span>
              <span className="text-blue-400 font-bold text-lg">
                6.2h
              </span>
            </div>
            <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
              <span className="text-gray-300 font-medium">
                Efficiency Rating
              </span>
              <span className="text-purple-400 font-bold text-lg">
                High
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Achievements & Progress */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Achievements
        </h3>
        {/* Recent Achievement */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 mb-6 border border-purple-500/30">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">
                Achievement Unlocked!
              </h4>
              <p className="text-gray-300">
                Completed 50 tasks this week
              </p>
              <div className="text-xs text-purple-300 mt-1">
                Just earned +500 XP
              </div>
            </div>
          </div>
        </div>
        {/* Progress Metrics */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">
                Weekly Goal
              </span>
              <span className="text-green-400 font-bold">
                12/15 tasks
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">
                Focus Streak
              </span>
              <span className="text-blue-400 font-bold">7 days</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">
                Monthly Target
              </span>
              <span className="text-purple-400 font-bold">
                45/60 tasks
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>
        {/* Next Achievement */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold text-sm">
                Next Achievement
              </h4>
              <p className="text-gray-400 text-xs">
                Complete 60 tasks this month
              </p>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-bold">75%</div>
              <div className="text-xs text-yellow-300">
                15 tasks to go
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductivityTracking;