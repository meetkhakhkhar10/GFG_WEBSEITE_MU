import { motion } from "motion/react";
import { Calendar, User, ArrowRight, Search, Tag, Sparkles } from "lucide-react";
import { useState } from "react";
import EditorialImage from "../components/EditorialImage";

const blogs = [
  {
    title: "The Future of AI at Marwadi University",
    excerpt: "How AI is transforming the way MU students learn, build, and innovate in 2026.",
    author: "Meet Khakhkhar",
    date: "March 20, 2026",
    category: "AI",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    readTime: "5 min read"
  },
  {
    title: "Mastering React 19: A Guide for MU Developers",
    excerpt: "A deep dive into the latest updates in React 19 and how MU students can leverage them for better performance.",
    author: "GFG MU Team",
    date: "March 15, 2026",
    category: "Web Dev",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    readTime: "8 min read"
  },
  {
    title: "The Roadmap to FAANG from Marwadi University",
    excerpt: "Everything MU students need to know to start their journey towards landing a job at top tech companies.",
    author: "Technical Lead",
    date: "March 10, 2026",
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
      className="py-32 bg-theme-bg min-h-screen text-theme-text relative overflow-hidden theme-transition"
    >
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gfg-primary/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest text-gfg-primary uppercase bg-gfg-primary/10 border border-gfg-primary/20 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Articles & Insights</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-theme-text mb-6 tracking-tighter uppercase leading-none italic">
            Our <span className="text-gfg-primary">Blogs</span>
          </h1>
          <p className="text-theme-text-secondary max-w-2xl mx-auto text-sm md:text-base mb-8 font-semibold leading-relaxed">
            Read the latest technical articles, tutorials, and insights from our community members and industry experts.
          </p>

          <div className="relative max-w-xl mx-auto mt-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-theme-text-muted opacity-60" />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 h-12 bg-theme-bg-secondary border border-theme-border rounded-xl outline-none focus:border-gfg-primary focus:shadow-sm transition-all text-sm text-theme-text placeholder:text-theme-text-muted/60"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredBlogs.map((blog, i) => (
            <motion.div
              key={blog.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-[2.5rem] overflow-hidden bg-theme-bg-secondary border border-theme-border hover:border-gfg-primary/30 transition-all duration-300 shadow-sm flex flex-col h-full"
            >
              <EditorialImage 
                src={blog.image} 
                alt={blog.title} 
                variant="thumbnail"
                figNumber={`FIG. 0${i + 1}`}
                badge={blog.category}
                aspectClassName="aspect-[16/10]"
              />
              
              <div className="p-8 flex flex-col flex-grow text-left">
                <div className="flex items-center space-x-4 mb-4 text-[9px] font-black uppercase tracking-widest text-theme-text-muted">
                  <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-gfg-primary" /> {blog.date}</span>
                  <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-gfg-primary" /> {blog.author}</span>
                </div>
                <h3 className="text-xl font-black text-theme-text mb-3 group-hover:text-gfg-primary transition-colors leading-tight uppercase tracking-tight">
                  {blog.title}
                </h3>
                <p className="text-theme-text-secondary text-xs leading-relaxed font-semibold mb-6 line-clamp-2">{blog.excerpt}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-theme-border">
                  <span className="text-[9px] font-black tracking-widest text-theme-text-muted uppercase font-mono">{blog.readTime}</span>
                  <button className="flex items-center text-gfg-primary font-black text-[10px] uppercase tracking-widest hover:text-theme-text transition-colors group/link cursor-pointer">
                    Read Story <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
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
          className="p-10 md:p-12 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 left-0 w-80 h-80 bg-gfg-primary/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-left relative z-10">
            <div className="w-16 h-16 rounded-[2rem] bg-gfg-primary/10 border border-gfg-primary/25 flex items-center justify-center text-gfg-primary shrink-0 shadow-sm">
              <Tag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-theme-text mb-1 tracking-tighter uppercase leading-tight">Want to contribute?</h3>
              <p className="text-theme-text-secondary text-sm font-semibold">Share your technical knowledge with the community. Submit your article today.</p>
            </div>
          </div>
          <button className="relative z-10 px-8 py-4 bg-gfg-primary text-black font-black rounded-xl hover:bg-theme-text hover:text-theme-bg transition-all whitespace-nowrap flex items-center uppercase tracking-widest text-[10px] shadow-sm select-none cursor-pointer">
            Submit Article <ArrowRight className="ml-1.5 w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
