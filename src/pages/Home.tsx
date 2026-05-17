import { motion } from "motion/react";
import { ArrowRight, BookOpen, Calendar, Users, Newspaper, ArrowUpRight, Code, Sparkles, Loader2, ImageIcon, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiService } from "../services/apiService";

const latestBlogs = [
  {
    title: "The Future of AI at Marwadi University",
    date: "March 20, 2024",
    category: "AI",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Mastering React 19: A Guide for MU Developers",
    date: "March 15, 2024",
    category: "Web Dev",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
  }
];

export default function Home() {
  const [featuredEvent, setFeaturedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await apiService.getEvents();
        if (result.success && result.data.length > 0) {
          // Take the first event as featured
          setFeaturedEvent(result.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch featured event", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#000] text-white overflow-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[750px] w-full flex items-center justify-center overflow-hidden">
        {/* 1. Background Video Layer */}
        <div className="absolute inset-0 z-0 bg-black pointer-events-none overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/IVqOajz5Hw0?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&playlist=IVqOajz5Hw0&playsinline=1&enablejsapi=1&iv_load_policy=3"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.77777778vh] h-[56.25vw] opacity-90 pointer-events-none scale-110"
            allow="autoplay; encrypted-media"
            title="Hero Background"
            style={{ 
              filter: "brightness(1.1) contrast(1.1)",
              border: "none"
            }}
          />
        </div>

        {/* 2. Cinematic Overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-50" />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        </div>

        {/* 3. Hero Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-3 px-5 py-2 mb-12 text-[9px] md:text-[10px] font-black tracking-[0.5rem] text-[#00ff88] uppercase bg-white/5 border border-white/10 rounded-full backdrop-blur-xl"
          >
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Official Student Chapter</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-black mb-10 tracking-tighter leading-[0.95] uppercase flex flex-col items-center"
            style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}
          >
            <span className="block text-white">Bridge The Gap</span>
            <span className="block text-white/50 lowercase italic font-light my-2" style={{ fontSize: "0.4em" }}>With</span>
            <span className="relative inline-block text-white px-6">
              GFG MU
              <span className="absolute inset-0 bg-[#00ff88]/10 rounded-2xl -z-10 border border-[#00ff88]/20 blur-sm" />
              <span className="absolute -bottom-2 left-6 right-6 h-[2px] bg-[#00ff88] shadow-[0_0_20px_#00ff88]" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/40 text-base md:text-lg font-medium max-w-2xl mx-auto mb-20 leading-relaxed tracking-tight text-balance"
          >
            Join the elite circle of developers at Marwadi University. We specialize in turning ambitious students into industry-ready engineers through <span className="text-[#00ff88]/80">peer-led technical excellence</span>.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
          >
            <Link 
              to="/resources"
              className="w-full sm:w-auto px-14 py-6 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all duration-500 shadow-[0_0_40px_rgba(0,255,136,0.2)] hover:shadow-[0_0_60px_rgba(0,255,136,0.4)] flex items-center justify-center group"
            >
              Explore Courses <BookOpen className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform" />
            </Link>
            <Link 
              to="/events"
              className="w-full sm:w-auto px-14 py-6 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white hover:text-black hover:border-white transition-all duration-500 flex items-center justify-center group backdrop-blur-md"
            >
              Live Events <Calendar className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop" 
                alt="Community Group" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="flex -space-x-4 mb-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-[#111] overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#00ff88]">Join 2500+ MU Learners</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#00ff88] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Our Community</span>
              <h2 className="font-black mb-8 tracking-tighter uppercase leading-tight" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                Where Ambition <br />
                <span className="text-[#00ff88] neon-glow">Meets Opportunity</span>
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed mb-10 max-w-xl">
                We are a community of developers, innovators, and learners at Marwadi University. Dedicated to bridge the gap between academia and industry through peer learning and expert mentorship.
              </p>
              <Link 
                to="/about"
                className="inline-flex items-center space-x-2 text-[#00ff88] font-black uppercase tracking-widest text-[10px] group"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-32 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div>
              <span className="text-[#00ff88] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Next Up</span>
              <h2 className="font-black tracking-tighter uppercase" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>Featured <span className="text-[#00ff88]">Events</span></h2>
            </div>
            <Link 
              to="/events"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#00ff88] hover:text-black transition-all duration-300"
            >
              View All Events
            </Link>
          </div>

          <div className="flex flex-col gap-12">
            {/* ICT x GFG CODEJAM - Special Featured Event */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00ff99]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex flex-col lg:flex-row min-h-[500px]">
                {/* Left Side: Poster (Full Visibility) */}
                <div className="lg:w-[55%] relative bg-[#0a0a0a] p-6 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,153,0.1)_0%,transparent_70%)]" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-50" />
                  <img 
                    src="https://plain-apac-prod-public.komododecks.com/202605/17/qI56Nyxvlar17gtFWIzo/image.jpg" 
                    alt="ICT x GFG CODEJAM Poster"
                    className="relative z-10 w-full h-full max-h-[600px] object-contain drop-shadow-[0_0_50px_rgba(0,255,153,0.3)] transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Right Side: Details */}
                <div className="lg:w-[45%] p-8 lg:p-16 flex flex-col justify-center bg-black/40">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-[#00ff99]/10 border border-[#00ff99]/20 text-[#00ff99] text-[10px] font-black uppercase tracking-widest animate-pulse">
                      Registration Open
                    </span>
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                      28th March
                    </span>
                  </div>

                  <h3 className="text-4xl lg:text-7xl font-black text-white italic tracking-tighter mb-6 uppercase leading-[0.85]">
                    ICT × GFG <br />
                    <span className="text-[#00ff99] neon-glow">CODEJAM</span>
                  </h3>
                  
                  <p className="text-white/50 text-lg mb-10 leading-relaxed font-medium">
                    In exclusive collaboration with the <span className="text-white">ICT Department at Marwadi University</span>. Push your logical boundaries in the ultimate algorithmic showdown.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <a 
                      href="https://forms.gle/your-external-form" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-10 py-5 bg-[#00ff99] text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(0,255,153,0.3)] hover:shadow-[0_0_50px_rgba(0,255,153,0.5)] flex items-center justify-center group"
                    >
                      Register Now <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Placeholder Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative h-64 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center p-8 overflow-hidden hover:border-[#00ff99]/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00ff99]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-[#00ff99]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">More Events Incoming</h4>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Spring Season '26</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative h-64 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center p-8 overflow-hidden hover:border-[#00ff99]/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00ff99]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Code className="w-8 h-8 text-[#00ff99]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Hackathon Season</h4>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Prepare Your Stacks</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative h-64 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center p-8 overflow-hidden hover:border-[#00ff99]/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00ff99]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8 text-[#00ff99]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Chapter Awards</h4>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Excellence Recognized</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Preview */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-[#00ff88] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Knowledge Hub</span>
            <h2 className="font-black tracking-tighter uppercase" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>Fresh <span className="text-[#00ff88]">Insights</span></h2>
            <div className="w-20 h-1 bg-[#00ff88] mx-auto mt-8 rounded-full shadow-[0_0_10px_#00ff88]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {latestBlogs.map((blog, i) => (
              <motion.div
                key={blog.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden hover:border-[#00ff88]/30 transition-all flex flex-col h-full"
              >
                <div className="aspect-[16/9] relative overflow-hidden shrink-0">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" referrerPolicy="no-referrer" />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-[#00ff88] text-black text-[8px] font-black uppercase tracking-widest rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 block">{blog.date}</span>
                  <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter leading-tight group-hover:text-[#00ff88] transition-colors">
                    {blog.title}
                  </h3>
                  <Link to="/blogs" className="mt-auto flex items-center text-[#00ff88] font-black uppercase tracking-widest text-[10px] group/link">
                    Read Story <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link 
              to="/blogs"
              className="px-12 py-5 bg-transparent border border-white/10 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88] transition-all duration-300"
            >
              View More Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-32 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div>
              <span className="text-[#00ff88] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Free Education</span>
              <h2 className="font-black tracking-tighter uppercase" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>Master <span className="text-[#00ff88]">MongoDB</span></h2>
            </div>
            <Link 
              to="/resources"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#00ff88] hover:text-black transition-all duration-300"
            >
              All Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "MongoDB Overview",
                geeks: "18k+",
                link: "https://www.geeksforgeeks.org/courses/mongodb-overview",
                image: "https://media.geeksforgeeks.org/img-practice/prod/courses/1028/Web/Content/mongodb_overview_webp_1760440738.webp"
              },
              {
                title: "CRUD Operations",
                geeks: "5k+",
                link: "https://www.geeksforgeeks.org/courses/crud-operations-in-mongodb",
                image: "https://media.geeksforgeeks.org/img-practice/prod/courses/994/Web/Content/crud_operations_in_mongodb_1758600430.webp"
              },
              {
                title: "RAG with MongoDB",
                geeks: "5k+",
                link: "https://www.geeksforgeeks.org/courses/rag-with-mongodb",
                image: "https://media.geeksforgeeks.org/img-practice/prod/courses/997/Web/Content/rag_with_mongodb_1758600921.webp"
              },
              {
                title: "Schema Design",
                geeks: "5k+",
                link: "https://www.geeksforgeeks.org/courses/schema-design-patterns-and-antipatterns",
                image: "https://media.geeksforgeeks.org/img-practice/prod/courses/990/Web/Content/schema_design_patterns_webp_1758600211.webp"
              }
            ].map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden hover:border-[#00ff88]/50 transition-all flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden shrink-0">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-40" />
                </div>
                <div className="p-8 flex flex-col flex-grow relative -mt-4 bg-[#0a0a0a] rounded-t-[32px]">
                  <div className="flex items-center space-x-2 text-[8px] font-black uppercase tracking-widest text-[#00ff88] mb-4">
                    <Users className="w-3 h-3" />
                    <span>{course.geeks} Geeks</span>
                  </div>
                  <h3 className="text-lg font-black uppercase mb-8 tracking-tight group-hover:text-[#00ff88] transition-colors">{course.title}</h3>
                  <a 
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors"
                  >
                    Start Learning <ArrowUpRight className="ml-1 w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00ff88]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#00ff8815_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-black tracking-tighter uppercase mb-12 leading-[0.9]" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
              Start Your Coding <br />
              <span className="text-[#00ff88] neon-glow">Journey Today</span>
            </h2>
            <Link 
              to="/resources"
              className="px-16 py-6 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(0,255,136,0.4)] hover:shadow-[0_0_70px_rgba(0,255,136,0.6)] inline-flex items-center"
            >
              Explore GfG Courses <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
