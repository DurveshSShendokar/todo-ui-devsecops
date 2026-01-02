import React from "react";

const projectData = [
  { name: "Completed", value: 15, color: "#10B981" },
  { name: "Ongoing", value: 8, color: "#3B82F6" },
  { name: "Pending", value: 5, color: "#EF4444" },
];

const monthlyProgress = [
  { month: "Jan", completed: 12, ongoing: 6 },
  { month: "Feb", completed: 15, ongoing: 8 },
  { month: "Mar", completed: 18, ongoing: 5 },
  { month: "Apr", completed: 22, ongoing: 7 },
  { month: "May", completed: 25, ongoing: 8 },
];

const ProjectAnalytics = () => (
  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-20">
    <h2 className="text-3xl font-bold text-white text-center mb-8">
      Project Analytics Dashboard
    </h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white/5 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Project Status
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="relative w-48 h-48">
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
                strokeDasharray={`${(15 / 28) * 251.2} 251.2`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="8"
                strokeDasharray={`${(8 / 28) * 251.2} 251.2`}
                strokeDashoffset={`-${(15 / 28) * 251.2}`}
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#EF4444"
                strokeWidth="8"
                strokeDasharray={`${(5 / 28) * 251.2} 251.2`}
                strokeDashoffset={`-${((15 + 8) / 28) * 251.2}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          {projectData.map((item) => (
            <div
              key={item.name}
              className="flex items-center space-x-2"
            >
              <div
                className={`w-3 h-3 rounded-full`}
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-300 text-sm">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/5 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Monthly Progress
        </h3>
        <div className="h-64 flex items-end justify-center space-x-4">
          {monthlyProgress.map((month) => (
            <div
              key={month.month}
              className="flex flex-col items-center space-y-2"
            >
              <div className="flex flex-col space-y-1">
                <div
                  className="w-8 bg-green-500 rounded-t"
                  style={{
                    height: `${(month.completed / 30) * 120}px`,
                  }}
                ></div>
                <div
                  className="w-8 bg-blue-500 rounded-b"
                  style={{ height: `${(month.ongoing / 30) * 120}px` }}
                ></div>
              </div>
              <span className="text-gray-300 text-xs">
                {month.month}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300 text-sm">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-300 text-sm">Ongoing</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProjectAnalytics;
