import React from "react";
import { MapPin } from "lucide-react";

const careerPositions = [
  {
    id: 1,
    title: "Senior React Developer",
    department: "Engineering",
    location: "Pune, India",
    type: "Full-time",
    salary: "₹12-18 LPA",
    experience: "4-6 years",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    description: "Lead frontend development for our AI-powered productivity platform.",
    urgent: true,
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    salary: "₹8-12 LPA",
    experience: "2-4 years",
    skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
    description: "Design intuitive user experiences for our team collaboration tools.",
    urgent: false,
  },
  {
    id: 3,
    title: "Data Scientist",
    department: "AI/ML",
    location: "Pune, India",
    type: "Full-time",
    salary: "₹15-22 LPA",
    experience: "3-5 years",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
    description: "Build intelligent features and analytics for our productivity suite.",
    urgent: true,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Hybrid",
    type: "Full-time",
    salary: "₹10-16 LPA",
    experience: "3-5 years",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    description: "Scale and optimize our cloud infrastructure for global users.",
    urgent: false,
  },
];

const Careers = () => (
  <div className="mb-20" id="careers">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white mb-4">
        Join Our Growing Team
      </h2>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
        Be part of something extraordinary. We're looking for passionate
        individuals to help shape the future of workplace productivity.
      </p>
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span>
            We're Hiring!{" "}
            {careerPositions.filter((pos) => pos.urgent).length} Urgent
            Positions
          </span>
        </div>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      {careerPositions.map((position) => (
        <div
          key={position.id}
          className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer group hover:scale-105 relative overflow-hidden"
        >
          {position.urgent && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
              URGENT
            </div>
          )}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 pr-16">
              {position.title}
            </h3>
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
              <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                {position.department}
              </span>
              <span>•</span>
              <span>{position.type}</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{position.location}</span>
              </div>
              <span>•</span>
              <span>{position.experience}</span>
            </div>
          </div>
          <div className="mb-4">
            <span className="text-2xl font-bold text-green-400">
              {position.salary}
            </span>
            <span className="text-gray-400 ml-2">per annum</span>
          </div>
          <p className="text-gray-300 mb-4 text-sm leading-relaxed">
            {position.description}
          </p>
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-2 text-sm">
              Required Skills:
            </h4>
            <div className="flex flex-wrap gap-2">
              {position.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm">
              Apply Now
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white py-2 px-4 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 text-sm">
              Learn More
            </button>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      ))}
    </div>
  </div>
);

export default Careers;