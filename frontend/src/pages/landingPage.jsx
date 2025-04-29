import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, BarChart3, FileText, LayoutDashboard, PlayCircle, ShieldCheck, BriefcaseBusiness } from 'lucide-react';

// Simple CSS injection for animations
const injectStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 0.8; }
      100% { opacity: 0.4; }
    }
    
    @keyframes blob {
      0% { transform: scale(1) translate(0px, 0px); }
      33% { transform: scale(1.1) translate(30px, -50px); }
      66% { transform: scale(0.9) translate(-20px, 20px); }
      100% { transform: scale(1) translate(0px, 0px); }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-pulse-slow {
      animation: pulse 4s ease-in-out infinite;
    }
    
    .animate-blob {
      animation: blob 7s infinite;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `;
  document.head.appendChild(style);
  return () => {
    document.head.removeChild(style);
  };
};

function LandingPage() {
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);

  useEffect(() => {
    const cleanup = injectStyles();
    return cleanup;
  }, []);

  // Function to scroll to video section
  const scrollToVideoSection = (e) => {
    e.preventDefault();
    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-24 pb-16 px-6 lg:px-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="hero-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">
                    HR Management <br />Simplified
                  </h1>
                  
                  <p className="text-xl md:text-2xl mb-8 text-slate-300">
                    Streamline your HR processes, manage employees, track leave requests, and optimize your workforce with our comprehensive HR management platform.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/login">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all"
                      >
                        Get Started <ArrowRight size={16} />
                      </motion.button>
                    </Link>
                    <a href="#video-demo" onClick={scrollToVideoSection}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-transparent border border-slate-500 hover:border-slate-300 text-white font-medium py-3 px-6 rounded-lg transition-all"
                      >
                        Watch Demo <PlayCircle size={16} />
                      </motion.button>
                    </a>
                    <Link to="/jobs">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all"
                      >
                        View Jobs <BriefcaseBusiness size={16} />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative"
              >
                <div className="relative z-20 rounded-xl shadow-2xl overflow-hidden border border-slate-700 animate-float">
                  <img 
                    src="/images/DashBoard.png" 
                    alt="HR Dashboard Preview" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 -left-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
              </motion.div>
            </div>
          </div>
          
          {/* Floating stats cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-slate-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-blue-400" />
                <h3 className="text-xl font-medium">User Management</h3>
              </div>
              <p className="text-slate-300">Easily manage employees, roles, and departments</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-slate-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-violet-400" />
                <h3 className="text-xl font-medium">Leave Tracking</h3>
              </div>
              <p className="text-slate-300">Efficient management of employee leaves and requests</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-slate-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="text-emerald-400" />
                <h3 className="text-xl font-medium">Analytics</h3>
              </div>
              <p className="text-slate-300">Comprehensive reports and HR data analysis</p>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Powerful HR Management Features</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our platform offers comprehensive tools to streamline your HR processes and optimize workplace management
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Employee Management",
                description: "Maintain detailed employee records, manage profiles, and track performance metrics."
              },
              {
                icon: <Calendar className="h-8 w-8 text-blue-600" />,
                title: "Leave Management",
                description: "Streamline leave requests, approvals, and calendar synchronization for your team."
              },
              {
                icon: <FileText className="h-8 w-8 text-blue-600" />,
                title: "Job Offers",
                description: "Create, manage, and track job postings and applications in one place."
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
                title: "Reporting",
                description: "Generate comprehensive HR reports and analyze workplace metrics."
              },
              {
                icon: <LayoutDashboard className="h-8 w-8 text-blue-600" />,
                title: "Dynamic Dashboard",
                description: "Get a bird's eye view of your organization with customizable dashboards."
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
                title: "Secure Access Control",
                description: "Role-based permissions ensure sensitive data is only accessible to authorized personnel."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 transition-all duration-300"
              >
                <div className="mb-4 text-blue-600">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Video Demo Section */}
      <section id="video-demo" ref={videoSectionRef} className="py-20 px-6 lg:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">See It In Action</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Watch how our HR management platform can transform your organization's workflow
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-xl overflow-hidden shadow-2xl aspect-video max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
              <div className="text-white text-center p-8">
                <PlayCircle className="h-20 w-20 text-blue-500 mx-auto mb-4 animate-pulse-slow" />
                <p className="text-2xl font-semibold mb-4">HR Management Platform Demo</p>
                <p className="text-slate-300 max-w-lg mx-auto">Watch our comprehensive demonstration to see how our platform can streamline your organization's HR processes.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-6 lg:px-16 bg-gradient-to-b from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by HR Teams</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              See what our customers are saying about our HR management platform
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform has completely transformed how we manage our HR processes. The employee management and leave tracking features are exceptional.",
                author: "Ahmed Khalil",
                title: "Engineer and manager at JN"
              },
              {
                quote: "The reporting capabilities have given us insights we never had before. Our decision-making process is now data-driven and much more effective.",
                author: "Youssef Zammit",
                title: "Senior frontend developer at JN Inc."
              },
              {
                quote: "The job recruitment module streamlined our hiring process. We're now able to fill positions faster with better candidates.",
                author: "Ayoub Lani",
                title: "Backend connections expert at JN Enterprises"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-slate-700"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full mr-4 bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-slate-400 text-sm">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-slate-300">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white p-12 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your HR management?</h2>
                <p className="text-lg text-white/80 mb-8">
                  Join thousands of organizations that have streamlined their HR processes with our platform.
                </p>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-600 font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Get Started Today
                  </motion.button>
                </Link>
              </div>
              <div className="hidden lg:block">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="animate-float"
                >
                  <img 
                    src="/images/ManagerDashboard.png" 
                    alt="HR Management Illustration" 
                    className="max-h-80 mx-auto"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
