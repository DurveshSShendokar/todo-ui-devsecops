import React from "react";
import { Calendar } from "lucide-react";

const newEmployees = [
  {
    id: 1,
    name: "Mohib Hussain",
    position: "Jr.Developer",
    department: "Development",
    joinDate: "2025-06-29",
    description: "Passionate React developer with 3+ years experience in modern web technologies. Loves creating intuitive user interfaces.",
    avatar: "AR",
    skills: ["React", "TypeScript", "UI/UX"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b029?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Karthik Menon",
    position: "Data Scientist",
    department: "Analytics",
    joinDate: "2025-06-30",
    description: "ML enthusiast with expertise in predictive analytics and data visualization. Previously worked at tech startups.",
    avatar: "KM",
    skills: ["Python", "Machine Learning", "SQL"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Riya Sharma",
    position: "Product Designer",
    department: "Design",
    joinDate: "2025-07-08",
    description: "Creative designer focused on user-centered design principles. Brings fresh perspectives from leading design agencies.",
    avatar: "RS",
    skills: ["Figma", "Prototyping", "Research"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
];

const isNewEmployee = (joinDate) => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const employeeJoinDate = new Date(joinDate);
  const monthAgo = new Date(istNow.getTime() - 30 * 24 * 60 * 60 * 1000);
  return employeeJoinDate >= monthAgo;
};

const recentJoiners = newEmployees.filter((employee) =>
  isNewEmployee(employee.joinDate)
);

const NewEmployees = () => (
  <div className="mb-20">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white mb-4">
        Welcome Our New Team Members
      </h2>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Meet the talented professionals who joined our ZioTeams family this month
      </p>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      {recentJoiners.map((employee) => (
        <div
          key={employee.id}
          className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer group hover:scale-105"
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gradient-to-r from-purple-400 to-blue-400 p-1">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full hidden items-center justify-center font-bold text-white text-sm">
                    {employee.avatar}
                  </div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                NEW
              </div>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-1">
              {employee.name}
            </h3>
            <p className="text-purple-300 font-semibold mb-1">
              {employee.position}
            </p>
            <p className="text-gray-400 text-sm mb-3">
              {employee.department}
            </p>
            <div className="flex flex-wrap justify-center gap-1 mb-3">
              {employee.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-white/10 backdrop-blur-md text-purple-200 px-2 py-1 rounded-full text-xs font-medium border border-white/20"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs mb-3">
              <Calendar className="w-3 h-3" />
              <span>
                Joined{" "}
                {new Date(employee.joinDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-2 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm">
              Say Hello 👋
            </button>
          </div>
        </div>
      ))}
    </div>
    {recentJoiners.length > 0 && (
      <div className="text-center mt-8">
        <button className="bg-white/5 backdrop-blur-md text-white px-8 py-3 rounded-2xl font-medium hover:bg-white/10 transition-all duration-300 border border-white/20">
          View All Team Members ({recentJoiners.length} new this month)
        </button>
      </div>
    )}
  </div>
);

export default NewEmployees;