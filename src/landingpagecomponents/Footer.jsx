import React from "react";
import { CheckCircle, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-black/30 backdrop-blur-md border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ZioTeams</span>
          </div>
          <p className="text-gray-400 mb-6 max-w-md">
            Developed by ZionIT - Empowering businesses with cutting-edge
            technology solutions.
          </p>
          <div className="text-gray-400">
            <p className="font-semibold text-white mb-2">
              ZionIT Solutions
            </p>
            <p>Innovation • Excellence • Growth</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact Info
          </h3>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>info@zionitai.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Pune,IND</span>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-white mb-3">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/people/Zionitai/61567164891617/"
                target="_blank"
                className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <span className="text-sm font-bold">f</span>
              </a>
              <a
                href="https://www.youtube.com/@Zionitai"
                target="_blank"
                className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white hover:bg-red-700 transition-colors"
              >
                <span className="text-xs">▶</span>
              </a>
              <a
                href="https://www.linkedin.com/company/zionit-software/posts/?feedView=all"
                target="_blank"
                className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
              >
                <span className="text-sm font-bold">in</span>
              </a>
              <a
                href="info@zionitai.com"
                className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              >
                <span className="text-xs">@</span>
              </a>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <div className="space-y-2 text-gray-400">
            <p>Founded: 2022</p>
            <p>Employees: 50+</p>
            <p>Industry: SaaS & AI</p>
            <p>
              Mission: Transforming workplace productivity through
              intelligent technology
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
        <p>
          &copy; 2025 ZionIT Solutions. All rights reserved. | Designed with
          ❤️ for the future of work.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;