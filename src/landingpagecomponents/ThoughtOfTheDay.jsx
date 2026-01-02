import React, { useEffect, useState } from "react";
import { Brain, X } from "lucide-react";

const thoughtsOfTheDay = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
];

const ThoughtOfTheDay = ({ show, setShow }) => {
  const [todaysThought, setTodaysThought] = useState("");

  useEffect(() => {
    setTodaysThought(
      thoughtsOfTheDay[Math.floor(Math.random() * thoughtsOfTheDay.length)]
    );
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md max-w-2xl mx-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Brain className="w-6 h-6 text-yellow-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">
              💡 Thought of the Day
            </h4>
            <p className="text-white/90 text-sm leading-relaxed">
              {todaysThought}
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThoughtOfTheDay;