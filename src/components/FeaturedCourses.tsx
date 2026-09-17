import React from "react";
import { motion } from "motion/react";
import { 
  Brain, 
  Code, 
  Cloud, 
  BarChart3, 
  ArrowUpRight, 
  Clock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const COURSES = [
  {
    num: "01",
    id: "gen-ai",
    title: "Generative AI Engineering",
    icon: Brain,
    description: "LLMs, prompt architectures, agentic workflows, RAG indexing pipelines, and production inference deployments.",
    tags: ["Live Program", "AI Agents", "RAG"],
    link: "https://www.geeksforgeeks.org/courses/generative-ai-program",
    level: "All Levels",
    duration: "10 Weeks"
  },
  {
    num: "02",
    id: "sde-interview",
    title: "SDE Technical Interview Suite",
    icon: Code,
    description: "Algorithmic patterns, distributed system design, operating systems, and high-frequency problem sets.",
    tags: ["DSA Mastery", "System Design", "Core CS"],
    link: "https://www.geeksforgeeks.org/courses/complete-interview-preparation-course",
    level: "Intermediate",
    duration: "12 Weeks"
  },
  {
    num: "03",
    id: "devops",
    title: "DevOps & Cloud Infrastructure",
    icon: Cloud,
    description: "Containerization with Docker & Kubernetes, CI/CD automated testbeds, AWS primitives, and infrastructure as code.",
    tags: ["Kubernetes", "AWS", "CI/CD"],
    link: "https://www.geeksforgeeks.org/courses/devops-live",
    level: "Intermediate",
    duration: "8 Weeks"
  },
  {
    num: "04",
    id: "data-analytics",
    title: "Data Analytics & Machine Intelligence",
    icon: BarChart3,
    description: "Analytical SQL modeling, exploratory Python data analysis, predictive statistical models, and live executive dashboards.",
    tags: ["Python", "SQL", "Predictive ML"],
    link: "https://www.geeksforgeeks.org/courses/data-analytics-live",
    level: "Beginner Friendly",
    duration: "6 Weeks"
  }
];

export default function FeaturedCourses() {
  return (
    <section className="py-20 md:py-28 border-b border-[#E2E2DC] bg-[#F4F4F0] relative overflow-hidden select-none">
      
      {/* Background Technical Grid */}
      <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        
        {/* Section Heading Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-12 border-b border-[#E2E2DC] gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold">
              <span>03 / CURRICULUM</span>
              <span className="text-[#8B9198]">·</span>
              <span className="text-[#8B9198]">GEEKSFORGEEKS ACADEMY</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl font-black text-[#111318] tracking-tight">
              Featured Programs
            </h2>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-[#111318] hover:text-[#00A86B] transition-colors"
          >
            <span>View All Curated Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {COURSES.map((course, i) => {
            const IconComponent = course.icon;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-[#FFFFFF] border border-[#E2E2DC] p-6 flex flex-col justify-between hover:border-[#111318] transition-colors duration-200 shadow-[0_4px_20px_rgba(17,19,24,0.03)] group"
              >
                <div>
                  {/* Top card metadata */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E2DC] font-mono text-[10px] text-[#8B9198]">
                    <span className="font-bold text-[#111318]">{course.num}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00A86B]" />
                      {course.duration}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 border border-[#E2E2DC] bg-[#FAF9F5] flex items-center justify-center text-[#111318] mb-4 group-hover:border-[#00A86B] group-hover:text-[#00A86B] transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className="font-editorial text-xl font-bold text-[#111318] tracking-tight mb-3 leading-snug group-hover:text-[#00A86B] transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs text-[#555B63] leading-relaxed mb-6">
                    {course.description}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pb-4 mb-4 border-b border-[#E2E2DC]">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] uppercase px-2 py-0.5 bg-[#FAF9F5] border border-[#E2E2DC] text-[#555B63]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Link action */}
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#111318] group-hover:text-[#00A86B] transition-colors pt-1"
                  >
                    <span>Enroll Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* EDITORIAL QUOTE / STRIP */}
        <div className="p-8 sm:p-10 border border-[#E2E2DC] bg-[#FAF9F5] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#00A86B] font-bold">
              COMMUNITY DIRECTIVE
            </span>
            <div className="font-editorial italic text-2xl text-[#111318]">
              "Every engineer learns by shipping real production software."
            </div>
            <p className="font-sans text-xs text-[#555B63]">
              Curated GeeksforGeeks learning pathways tailored for Marwadi University students.
            </p>
          </div>

          <a
            href="https://practice.geeksforgeeks.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors shrink-0 flex items-center space-x-2"
          >
            <span>Practice Problems</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
