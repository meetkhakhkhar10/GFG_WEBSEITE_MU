import { motion } from "motion/react";
import { BookOpen, Users, Target, ArrowUpRight, Sparkles } from "lucide-react";

const courses = [
  {
    title: "MongoDB Overview",
    geeksCount: "18k+",
    level: "Beginner to Advanced",
    link: "https://www.geeksforgeeks.org/courses/mongodb-overview",
    image: "https://media.geeksforgeeks.org/img-practice/prod/courses/1028/Web/Content/mongodb_overview_webp_1760440738.webp"
  },
  {
    title: "CRUD Operations in MongoDB",
    geeksCount: "5k+",
    level: "Beginner to Advanced",
    link: "https://www.geeksforgeeks.org/courses/crud-operations-in-mongodb",
    image: "https://media.geeksforgeeks.org/img-practice/prod/courses/994/Web/Content/crud_operations_in_mongodb_1758600430.webp"
  },
  {
    title: "RAG with MongoDB",
    geeksCount: "5k+",
    level: "Beginner to Advanced",
    link: "https://www.geeksforgeeks.org/courses/rag-with-mongodb",
    image: "https://media.geeksforgeeks.org/img-practice/prod/courses/997/Web/Content/rag_with_mongodb_1758600921.webp"
  },
  {
    title: "Schema Design Patterns and Anti-patterns",
    geeksCount: "5k+",
    level: "Beginner to Advanced",
    link: "https://www.geeksforgeeks.org/courses/schema-design-patterns-and-antipatterns",
    image: "https://media.geeksforgeeks.org/img-practice/prod/courses/990/Web/Content/schema_design_patterns_webp_1758600211.webp"
  }
];

export default function Resources() {
  const handleNavigation = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-[#000] min-h-screen text-white"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest text-[#00ff88] uppercase bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full"
          >
            <Sparkles className="w-3 h-3" />
            <span>Curated Learning Paths</span>
          </motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6"
          >
            GfG FREE <span className="text-[#00ff88] neon-glow">COURSES HUB</span>
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-24 h-1 bg-[#00ff88] mx-auto rounded-full mb-8 shadow-[0_0_10px_#00ff88]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden hover:border-[#00ff88]/30 transition-all flex flex-col"
            >
              <div className="aspect-[4/3] relative overflow-hidden shrink-0">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[8px] font-black tracking-widest uppercase text-[#00ff88] rounded-lg">
                    Free Course
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 text-[8px] font-black uppercase tracking-widest text-[#00ff88]/60 mb-4">
                  <Users className="w-3 h-3" />
                  <span>{course.geeksCount} Interested Geeks</span>
                </div>

                <h2 className="text-xl font-black mb-4 uppercase tracking-tighter leading-tight group-hover:text-[#00ff88] transition-colors">
                  {course.title}
                </h2>

                <div className="flex items-center space-x-2 text-[8px] font-black uppercase tracking-widest text-white/20 mb-8">
                  <Target className="w-3 h-3" />
                  <span>{course.level}</span>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handleNavigation(course.link)}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88] flex items-center justify-center group/btn shadow-xl hover:shadow-[#00ff88]/20"
                  >
                    Start Learning <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
