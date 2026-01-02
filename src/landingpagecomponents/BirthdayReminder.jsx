import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const employees = [
  {
    id: 1,
    name: "Mohib Hussain",
    birthday: "02-07",
    department: "Development",
    avatar: "AS",
  },
  {
    id: 2,
    name: "Priya Patel",
    birthday: "25-06",
    department: "Design",
    avatar: "PP",
  },
  {
    id: 3,
    name: "Rohit Kumar",
    birthday: "17-06",
    department: "Marketing",
    avatar: "RK",
  },
  {
    id: 4,
    name: "Sneha Singh",
    birthday: "16-06",
    department: "HR",
    avatar: "SS",
  },
  {
    id: 5,
    name: "Vikram Gupta",
    birthday: "20-12",
    department: "Sales",
    avatar: "VG",
  },
];

function getCurrentDateIST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  const day = String(istDate.getUTCDate()).padStart(2, "0");
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  return `${day}-${month}`;
}

const BirthdayReminder = ({ show, setShow }) => {
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);

  useEffect(() => {
    setTodaysBirthdays(
      employees.filter((employee) => employee.birthday === getCurrentDateIST())
    );
  }, []);

  if (!show || todaysBirthdays.length === 0) return null;

  return (
    <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-40 animate-slide-in-right">
      <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 p-1 rounded-3xl shadow-2xl max-w-sm">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full translate-y-8 -translate-x-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🎂</span>
                </div>
                <h3 className="text-white font-bold text-lg">
                  Birthday Alert!
                </h3>
              </div>
              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {todaysBirthdays.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center font-bold text-white">
                      {employee.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">
                        {employee.name}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {employee.department}
                      </p>
                    </div>
                    <div className="text-2xl">🎉</div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-pink-300 text-sm font-medium">
                      🎈 Happy Birthday! 🎈
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Send Birthday Wishes 💌
              </button>
              <button className="w-full bg-white/10 backdrop-blur-md text-white py-2 px-4 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20">
                View All Birthdays 📅
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-xs">
                🌟 Celebrating {todaysBirthdays.length} special{" "}
                {todaysBirthdays.length === 1 ? "person" : "people"} today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayReminder;

