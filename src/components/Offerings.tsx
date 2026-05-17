import { motion } from "motion/react";
import { Code2, Globe, Cpu, Cloud, Database, Shield, ArrowRight } from "lucide-react";

const offerings = [
  {
    title: "DSA Mastery",
    description: "Master algorithms and data structures with our intensive coding sessions and contests.",
    icon: Code2,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Web Development",
    description: "Build modern, responsive web applications using the latest frameworks and technologies.",
    icon: Globe,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "AI & ML",
    description: "Explore the future of technology with our artificial intelligence and machine learning workshops.",
    icon: Cpu,
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Cloud Computing",
    description: "Learn to deploy and manage applications at scale using AWS, Azure, and Google Cloud.",
    icon: Cloud,
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    title: "Database Systems",
    description: "Understand the core principles of data storage, retrieval, and management.",
    icon: Database,
    color: "from-indigo-500/20 to-blue-500/20",
  },
  {
    title: "Cyber Security",
    description: "Learn to protect systems and networks from digital attacks and vulnerabilities.",
    icon: Shield,
    color: "from-yellow-500/20 to-orange-500/20",
  },
];

export default function Offerings() {
  return (
    <section className="py-24 relative overflow-hidden bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-4"
          >
            Our Core <span className="text-[#2f9e44]">Domains</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto"
          >
            We provide a comprehensive learning ecosystem for students to excel in various technical domains.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((offering, index) => (
            <motion.div
              key={offering.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 rounded-[40px] bg-white border border-gray-100 hover:border-[#2f9e44]/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl"
            >
              {/* Animated Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${offering.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#2f9e44]/5 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-16 h-16 mb-8 rounded-2xl bg-gray-50 border border-gray-100 text-[#2f9e44] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                  <offering.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#2f9e44] transition-colors">{offering.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{offering.description}</p>
                
                <div className="mt-8 flex items-center text-[#2f9e44] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Explore Domain <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
