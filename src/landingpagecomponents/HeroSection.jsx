import React from "react";
import { Brain, CheckCircle, Calendar, TrendingUp } from "lucide-react";

const HeroSection = () => (
  <section className="relative py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Empower Your Team with
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {" "}AI-Driven
          </span>
          <br />
          Productivity
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          ZioTeams revolutionizes workplace productivity with intelligent
          task management, team insights, and AI-powered features that keep
          your team motivated and organized.
        </p>
      </div>
      <div className="flex justify-center mb-20">
        <div className="relative group cursor-pointer">
          <div className="w-96 h-96 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-3xl p-1 shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
              <div className="relative">
                <div className="w-48 h-48 relative">
                  <div className="absolute inset-0 opacity-30">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse`}
                        style={{
                          top: `${Math.random() * 80 + 10}%`,
                          left: `${Math.random() * 80 + 10}%`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                      <Brain className="w-16 h-16 text-white animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-8 -left-8 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div
                  className="absolute -top-4 -right-12 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div
                  className="absolute -bottom-6 -right-8 w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDelay: "1s" }}
                >
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
