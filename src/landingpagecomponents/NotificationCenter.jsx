import React, { useState } from "react";
import { X, Bell } from "lucide-react";

const initialNotifications = [
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

const NotificationCenter = ({ show, setShow }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
  };

  if (!show) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 border border-white/20 shadow-2xl relative">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-purple-400 mr-2" />
          <h2 className="text-2xl font-bold text-white flex-1">Notifications</h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-blue-400 hover:text-blue-300 underline ml-2"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="space-y-4 max-h-72 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="text-gray-400 text-center py-8">No notifications.</div>
          )}
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl p-4 border ${
                n.unread
                  ? "border-purple-500/40 bg-white/10"
                  : "border-white/10 bg-white/5"
              } flex flex-col gap-1`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    n.priority === "high"
                      ? "bg-red-500"
                      : n.priority === "medium"
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  }`}
                ></span>
                <span className="font-semibold text-white">{n.title}</span>
                {n.unread && (
                  <span className="ml-2 text-xs text-purple-300 font-bold animate-pulse">
                    New
                  </span>
                )}
                <span className="ml-auto text-xs text-gray-400">{n.time}</span>
              </div>
              <div className="text-gray-300 text-sm">{n.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;