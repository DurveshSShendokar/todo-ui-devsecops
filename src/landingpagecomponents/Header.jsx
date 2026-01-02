import React, { useState, useEffect } from "react";
import { CheckCircle, Bell, X } from "lucide-react";

const unavailableEmployeesData = [
  {
    id: 1,
    name: "Mohib Hussain",
    reason: "Sick Leave",
    avatar: "AJ",
    department: "Engineering",
  },
  {
    id: 2,
    name: "Riya",
    reason: "Vacation",
    avatar: "MG",
    department: "Design",
  },
];

const notificationsData = [
  {
    id: 1,
    type: "task",
    title: "New Task Assigned",
    message: "Complete the Q3 performance review",
    time: "2 min ago",
    unread: true,
    priority: "high",
  },
  {
    id: 2,
    type: "meeting",
    title: "Upcoming Meeting",
    message: "Team standup in 15 minutes",
    time: "5 min ago",
    unread: true,
    priority: "medium",
  },
  {
    id: 3,
    type: "achievement",
    title: "Goal Achieved!",
    message: "You completed 5 tasks today",
    time: "1 hour ago",
    unread: false,
    priority: "low",
  },
];

const Header = ({ setShowLoginModal, setShowNotificationCenter }) => {
  const [showUnavailableEmployees, setShowUnavailableEmployees] =
    useState(false);
  const [notifications] = useState(notificationsData);
  const [unavailableEmployees] = useState(unavailableEmployeesData);

  useEffect(() => {
    const timer = setTimeout(() => setShowUnavailableEmployees(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="relative z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ZioTeams</span>
          </div>
          {showUnavailableEmployees && (
            <div className="absolute left-4 top-full mt-2 w-80 bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-2xl border border-purple-500/30 shadow-2xl z-40 backdrop-blur-md">
              <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <h3 className="text-white font-semibold">
                      Not Available Today
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowUnavailableEmployees(false)}
                    className="text-purple-300 hover:text-white transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {unavailableEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center space-x-3 bg-white/5 rounded-xl p-3 border border-purple-500/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {employee.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">
                        {employee.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-purple-300">
                          {employee.reason}
                        </span>
                        <span className="text-purple-400">•</span>
                        <span className="text-gray-300">
                          {employee.department}
                        </span>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-purple-500/20">
                <button className="w-full text-center text-purple-300 hover:text-purple-200 transition-colors text-sm font-medium">
                  View Full Attendance Report
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border-2 border-pink-400 text-pink-400 rounded-lg hover:bg-pink-400 hover:text-white transition-all duration-300 font-medium">
              Get the App
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Login/Sign Up
            </button>
            <button
              onClick={() => setShowNotificationCenter((v) => !v)}
              className="relative bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Bell className="w-5 h-5 text-white" />
              {notifications.filter((n) => n.unread).length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {notifications.filter((n) => n.unread).length}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
