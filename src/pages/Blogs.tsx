import { motion } from "motion/react";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { useState } from "react";

const blogs = [
  {
    title: "The Future of AI at Marwadi University",
    excerpt: "How AI is transforming the way MU students learn, build, and innovate in 2024.",
    author: "Meet Khakhkhar",
    date: "March 20, 2024",
    category: "AI",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    readTime: "5 min read"
  },
  {
    title: "Mastering React 19: A Guide for MU Developers",
    excerpt: "A deep dive into the latest updates in React 19 and how MU students can leverage them for better performance.",
    author: "GFG MU Team",
    date: "March 15, 2024",
    category: "Web Dev",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    readTime: "8 min read"
  },
  {
    title: "The Roadmap to FAANG from Marwadi University",
    excerpt: "Everything MU students need to know to start their journey towards landing a job at top tech companies.",
    author: "Technical Lead",
    date: "March 10, 2024",
    category: "Career",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
    readTime: "10 min read"
  }
];

export default function Blogs() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-32 bg-[#000] min-h-screen text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest text-[#00ff88] uppercase bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
            <span>Articles & Insights</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
            Our <span className="text-[#00ff88] neon-glow">Blogs</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed mb-12 font-medium uppercase tracking-widest text-[10px]">
            Read the latest technical articles, tutorials, and insights from our community members and industry experts.
          </p>

          <div className="relative max-w-xl mx-auto mt-12">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-[#0a0a0a] border border-white/10 rounded-2xl outline-none focus:border-[#00ff88]/30 transition-all text-sm shadow-2xl text-white placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {filteredBlogs.map((blog, i) => (
            <motion.div
              key={blog.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-[40px] overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-[#00ff88]/30 transition-all shadow-2xl flex flex-col h-full"
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-[#00ff88] text-black text-[8px] font-black rounded-full uppercase tracking-widest">
                    {blog.category}
                  </span>
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center space-x-4 mb-6 text-[10px] font-black uppercase tracking-widest text-white/30">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5 text-[#00ff88]" /> {blog.date}</span>
                  <span className="flex items-center"><User className="w-3 h-3 mr-1.5 text-[#00ff88]" /> {blog.author}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#00ff88] transition-colors leading-tight uppercase tracking-tighter">
                  {blog.title}
                </h3>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium leading-relaxed mb-10 line-clamp-2">{blog.excerpt}</p>
                <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5">
                  <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">{blog.readTime}</span>
                  <button className="flex items-center text-[#00ff88] font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors group/link">
                    Read Story <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Blog CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-16 rounded-[60px] bg-[#0a0a0a] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#00ff88]/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="flex items-center space-x-10 text-left relative z-10">
            <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-[#00ff88]">
              <Tag className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-tight">Want to contribute?</h3>
              <p className="text-white/40 font-medium uppercase tracking-widest text-[10px]">Share your technical knowledge with the community. Submit your article today.</p>
            </div>
          </div>
          <button className="relative z-10 px-12 py-5 bg-[#00ff88] text-black font-black rounded-2xl hover:bg-white transition-all whitespace-nowrap flex items-center shadow-[0_0_30px_rgba(0,255,136,0.2)] uppercase tracking-widest text-xs">
            Submit Article <ArrowRight className="ml-2 w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
