import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Building2, Ticket } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Content Area */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2 animate-pulse"></span>
              Live Token System
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
              Campus Queues,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                Simplified.
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md">
              Skip the long lines. Generate your token online, track your live status from anywhere, and only show up when it's your turn.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="inline-flex justify-center items-center px-6 py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/30 transition-all active:scale-95"
              >
                Student Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/visitor-token" 
                className="inline-flex justify-center items-center px-6 py-3.5 bg-white text-gray-800 font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
              >
                <Ticket className="mr-2 w-5 h-5 text-gray-500" />
                Visitor Token
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-500 font-medium">
              Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign in here</Link>
            </div>
          </div>
        </div>

        {/* Right Feature Area */}
        <div className="w-full md:w-1/2 bg-gray-900 p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
          {/* Dark mode decorative elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary-900/40 to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-8">Why use QueueEase?</h2>
            
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-primary-500/20 group-hover:border-primary-500/50 transition-colors">
                  <Clock className="w-6 h-6 text-primary-300" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-white">Save Your Time</h3>
                  <p className="mt-1 text-gray-400 text-sm">Real-time estimated wait calculations so you never stand idle in hallways.</p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-300" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-white">All Departments</h3>
                  <p className="mt-1 text-gray-400 text-sm">Unified access to Exam Cell, Accounts, Admissions, and Library.</p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                  <Users className="w-6 h-6 text-purple-300" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-semibold text-white">Fair & Transparent</h3>
                  <p className="mt-1 text-gray-400 text-sm">Strict first-come, first-serve algorithms. No line cutting, guaranteed.</p>
                </div>
              </div>
            </div>

            {/* Quick Status Check Card */}
            <div className="mt-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Already generated a token?</p>
                  <p className="text-white font-medium">Check your live status instantly</p>
                </div>
                <Link to="/visitor-status/check" className="px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Check Status
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
