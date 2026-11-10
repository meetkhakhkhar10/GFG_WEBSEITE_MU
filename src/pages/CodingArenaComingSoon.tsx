import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Code2, 
  Terminal, 
  Trophy, 
  Zap, 
  Swords, 
  Flame, 
  Award, 
  Sparkles, 
  ArrowLeft, 
  Bell, 
  CheckCircle2, 
  ChevronRight,
  Laptop,
  Cpu,
  Layers,
  Star
} from "lucide-react";
import { motion } from "motion/react";

const GFG_LOGO_PRIMARY = "/gfg-logo.png";
const GFG_LOGO_FALLBACK = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png";

const MU_LOGO_PRIMARY = "/marwadi-university-logo.svg";
const MU_LOGO_FALLBACK = "https://www.marwadiuniversity.ac.in/wp-content/themes/marwadi-university/assets/img/logomain.svg";

interface FeaturePreview {
  id: string;
  num: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  badge: string;
}

const FEATURE_PREVIEWS: FeaturePreview[] = [
  {
    id: "challenges",
    num: "01",
    title: "Daily Coding Challenges",
    tagline: "Consistent 24-Hour Problem Sets",
    description: "Curated algorithmic problems released every 24 hours across easy, medium, and hard tiers. Build unshakeable daily problem-solving discipline.",
    icon: Terminal,
    accent: "#00A86B",
    badge: "Daily Drop"
  },
  {
    id: "cp",
    num: "02",
    title: "Competitive Programming",
    tagline: "Speed, Rigor & Edge Cases",
    description: "Rigorous timed coding battles under strict time and memory constraints. Level up DSA mastery with test cases modeled after top tier technical interviews.",
    icon: Swords,
    accent: "#2563EB",
    badge: "Timed Contests"
  },
  {
    id: "leaderboards",
    num: "03",
    title: "Leaderboards & Rankings",
    tagline: "Campus-Wide Real-Time Standings",
    description: "Transparent, real-time Elo rating and scoring system for all students of Marwadi University. Claim the coveted #1 rank on campus.",
    icon: Trophy,
    accent: "#D97706",
    badge: "Real-Time Elo"
  },
  {
    id: "rewards",
    num: "04",
    title: "XP, Rewards & Achievements",
    tagline: "Gamified Chapter Progression",
    description: "Earn XP points, unlock rare chapter badges, collect solving streaks, and redeem exclusive GFG MU chapter merchandise and digital credentials.",
    icon: Zap,
    accent: "#7C3AED",
    badge: "Badges & Streaks"
  },
  {
    id: "contests",
    num: "05",
    title: "Coding Contests",
    tagline: "Inter-College Hackathons & Sprints",
    description: "Bi-weekly flagship hack sprints, algorithmic showdowns, and live-streamed finals organized exclusively by the GeeksforGeeks Student Chapter MU.",
    icon: Flame,
    accent: "#DC2626",
    badge: "Live Showdowns"
  }
];

export default function CodingArenaComingSoon() {
  const [gfgLogo, setGfgLogo] = useState(GFG_LOGO_PRIMARY);
  const [muLogo, setMuLogo] = useState(MU_LOGO_PRIMARY);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111318] selection:bg-[#00A86B] selection:text-white relative overflow-hidden">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-technical-grid opacity-50" />

      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#00A86B]/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-[400px] h-[400px] bg-blue-500/5 blur-3xl pointer-events-none -z-10" />

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20">
        
        {/* TOP BRANDING BAR & BACK TO HOME BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-[#E2E2DC]">
          
          {/* Institutional Brand Lockup */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 sm:gap-3 group py-1 flex-shrink-0"
              aria-label="GeeksforGeeks Marwadi University Home"
            >
              <div className="flex-shrink-0 flex items-center justify-center h-[28px] sm:h-[34px] w-auto">
                <img 
                  src={gfgLogo} 
                  alt="GeeksforGeeks" 
                  className="h-full w-auto max-h-[34px] object-contain block select-none"
                  referrerPolicy="no-referrer"
                  onError={() => setGfgLogo(GFG_LOGO_FALLBACK)}
                />
              </div>

              <span className="flex-shrink-0 text-[#8B9198] font-mono text-[12px] font-light select-none leading-none">
                ×
              </span>

              <div className="flex-shrink-0 flex items-center justify-center h-[30px] sm:h-[38px] w-auto">
                <img 
                  src={muLogo} 
                  alt="Marwadi University" 
                  className="h-full w-auto max-h-[38px] object-contain block select-none"
                  referrerPolicy="no-referrer"
                  onError={() => setMuLogo(MU_LOGO_FALLBACK)}
                />
              </div>
            </Link>

            <span className="hidden md:inline-block h-5 w-[1px] bg-[#E2E2DC] flex-shrink-0" />
            <span className="hidden md:inline-block font-mono text-[10px] uppercase tracking-widest text-[#8B9198]">
              STUDENT CHAPTER · MU RAJKOT
            </span>
          </div>

          {/* Action: Back to Home Button */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-[#111318] bg-white hover:bg-[#111318] hover:text-[#F4F4F0] border border-[#111318] transition-all duration-200 shadow-xs group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="pt-12 sm:pt-16 pb-14 text-center max-w-4xl mx-auto">
          
          {/* Prominent Launching Soon Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#00A86B]/30 shadow-xs mb-6"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A86B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A86B]" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00A86B] font-bold">
              LAUNCHING SOON · CHAPTER ARENA
            </span>
          </motion.div>

          {/* Large Headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-[#555B63] mb-3"
          >
            Something Exciting Is Coming!
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-black text-[#111318] tracking-tight leading-[0.95] mb-6"
          >
            CODING <span className="text-[#00A86B] italic font-serif">ARENA</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl text-[#555B63] font-editorial italic max-w-2xl mx-auto leading-relaxed mb-10"
          >
            "Your next destination to practice, compete, and grow."
          </motion.p>

          {/* Quick Stats / Highlights Pill Strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto font-mono text-[11px] uppercase tracking-wider text-[#555B63]"
          >
            <div className="bg-white/80 backdrop-blur-xs border border-[#E2E2DC] p-3 rounded-lg text-center">
              <span className="text-[#00A86B] font-bold block text-sm sm:text-base">500+</span>
              <span>STUDENT CODERS</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-[#E2E2DC] p-3 rounded-lg text-center">
              <span className="text-[#00A86B] font-bold block text-sm sm:text-base">24/7</span>
              <span>PRACTICE RIG</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-[#E2E2DC] p-3 rounded-lg text-center">
              <span className="text-[#00A86B] font-bold block text-sm sm:text-base">ELO</span>
              <span>LIVE RANKINGS</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-[#E2E2DC] p-3 rounded-lg text-center">
              <span className="text-[#00A86B] font-bold block text-sm sm:text-base">GFG × MU</span>
              <span>VERIFIED BADGES</span>
            </div>
          </motion.div>
        </section>

        {/* PREMIUM CODING-THEMED ILLUSTRATION & ANIMATION */}
        <section className="my-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative bg-[#111318] text-[#F4F4F0] rounded-2xl sm:rounded-3xl border border-[#22252C] shadow-2xl overflow-hidden p-6 sm:p-10"
          >
            {/* Ambient colored lighting inside terminal */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00A86B]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
                <span className="ml-3 font-mono text-xs text-[#8B9198] hidden sm:inline-block">
                  arena.marwadiuniversity.ac.in — bash — 80×24
                </span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px] text-[#00A86B] bg-[#00A86B]/10 px-3 py-1 rounded-full border border-[#00A86B]/30">
                <Code2 className="w-3.5 h-3.5" />
                <span>BUILD STATUS: COMPILING ARENA V1.0</span>
              </div>
            </div>

            {/* Laptop and Interactive Code Workspace Mockup */}
            <div className="pt-8 pb-4 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Animated Code Snippet */}
              <div className="md:col-span-7 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 space-y-2 bg-black/40 p-5 rounded-xl border border-white/5">
                <div className="text-emerald-400 flex items-center space-x-2">
                  <span className="text-[#8B9198]">$</span>
                  <span>gfg-chapter-mu --init arena</span>
                </div>
                <p className="text-[#8B9198] text-[11px]">// Initializing GeeksforGeeks Student Chapter MU Coding Arena</p>
                <div className="text-slate-400">
                  <span className="text-purple-400">const</span> arena = <span className="text-blue-400">new</span> <span className="text-amber-300">CodingArena</span>({`{`}
                </div>
                <div className="pl-4 text-slate-300">
                  chapter: <span className="text-emerald-400">"GeeksforGeeks × Marwadi University"</span>,
                </div>
                <div className="pl-4 text-slate-300">
                  features: [<span className="text-emerald-400">"DailyQuiz"</span>, <span className="text-emerald-400">"LiveLeaderboard"</span>, <span className="text-emerald-400">"Contests"</span>],
                </div>
                <div className="pl-4 text-slate-300">
                  targetAudience: <span className="text-emerald-400">"MU Engineers & Coders"</span>,
                </div>
                <div className="pl-4 text-slate-300">
                  state: <span className="text-amber-400 animate-pulse">"FINALIZING_BENCHMARKS"</span>
                </div>
                <div className="text-slate-400">{`}`});</div>
                <div className="pt-2 text-emerald-400 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Ready for campus deployment. Launching soon...</span>
                </div>
              </div>

              {/* Right Column: Visual Laptop & Code Rig */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4">
                <div className="relative">
                  {/* Floating Elements */}
                  <motion.div 
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#00A86B] to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-[#00A86B]/30 mx-auto mb-4 border border-emerald-300/30"
                  >
                    <Laptop className="w-12 h-12 sm:w-14 sm:h-14" />
                  </motion.div>

                  {/* Satellite Floating Badges */}
                  <motion.div 
                    animate={{ y: [4, -4, 4] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-2 -right-4 bg-amber-500/90 text-slate-950 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1"
                  >
                    <Trophy className="w-3 h-3 text-slate-950" />
                    <span>RANK #1</span>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [-3, 5, -3] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-2 -left-4 bg-emerald-500/90 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>+100 XP</span>
                  </motion.div>
                </div>

                <h3 className="font-editorial text-lg text-white font-bold mt-2">Engineered For Developers</h3>
                <p className="text-[#8B9198] text-xs max-w-xs mt-1">
                  Built specifically for students of Marwadi University by the GFG Student Chapter technical team.
                </p>
              </div>

            </div>

            {/* Bottom Status Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#8B9198]">
              <div className="flex items-center space-x-3">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Cpu className="w-3.5 h-3.5" /> High Performance Sandboxing
                </span>
                <span>•</span>
                <span>Sub-50ms Evaluation</span>
              </div>
              <div className="text-[11px] text-slate-400">
                MU CHAPTER RELEASE CANDIDATE
              </div>
            </div>
          </motion.div>
        </section>

        {/* FEATURE PREVIEWS SECTION */}
        <section className="pt-16 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E2E2DC]">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00A86B] font-bold block mb-1">
                IN THE PIPELINE
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-black text-[#111318] tracking-tight">
                Arena Capabilities
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#555B63] max-w-md font-sans">
              Take a closer look at what the GeeksforGeeks Student Chapter MU is engineering to elevate coding standards on campus.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_PREVIEWS.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * idx }}
                  className="bg-white border border-[#E2E2DC] rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#00A86B] hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle Accent Stripe on top */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 transition-transform origin-left group-hover:scale-x-100 scale-x-0 duration-300" 
                    style={{ backgroundColor: feature.accent }}
                  />

                  <div>
                    {/* Top Row: Index number & Tag Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-xs text-[#8B9198] font-bold">
                        {feature.num}
                      </span>
                      <span 
                        className="font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border"
                        style={{ 
                          backgroundColor: `${feature.accent}12`, 
                          color: feature.accent,
                          borderColor: `${feature.accent}30`
                        }}
                      >
                        {feature.badge}
                      </span>
                    </div>

                    {/* Icon Container */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-105"
                      style={{ backgroundColor: `${feature.accent}15`, color: feature.accent }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Titles */}
                    <h3 className="font-editorial text-2xl font-black text-[#111318] group-hover:text-[#00A86B] transition-colors mb-1">
                      {feature.title}
                    </h3>
                    <p className="font-mono text-xs text-[#8B9198] uppercase tracking-wider mb-3">
                      {feature.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-[#555B63] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Card Footer: Status indicator */}
                  <div className="pt-6 mt-6 border-t border-[#E2E2DC] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8B9198]">FEATURE PREVIEW</span>
                    <span className="text-[#00A86B] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>COMING SOON</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Final Highlight Card: Chapter Community Callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-gradient-to-br from-[#111318] to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between border border-[#22252C]"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs text-emerald-400 font-bold">06</span>
                  <span className="font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Get Early Access
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center mb-5">
                  <Bell className="w-6 h-6" />
                </div>

                <h3 className="font-editorial text-2xl font-black text-white mb-2">
                  Be The First To Enter The Arena
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Join our official GeeksforGeeks Marwadi University WhatsApp circle to receive instantaneous notifications the moment the Coding Arena goes live.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <a
                  href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#00A86B] hover:bg-[#008f5a] text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 rounded-lg transition-colors shadow-sm"
                >
                  <span>Join Announcement Group</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* BOTTOM ACTION / NOTIFY ME & BACK TO HOME CTA */}
        <section className="pt-10 pb-6 border-t border-[#E2E2DC]">
          <div className="bg-white border border-[#E2E2DC] rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00A86B] font-bold block mb-2">
              CHAPTER NOTIFICATIONS
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-black text-[#111318] mb-3">
              Stay In The Loop
            </h3>
            <p className="text-sm sm:text-base text-[#555B63] max-w-lg mx-auto mb-8">
              Drop your email address below to receive an official invitation to the closed beta release of the Coding Arena.
            </p>

            {subscribed ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#00A86B]" />
                <span>You're on the list! We'll notify you when the arena launches.</span>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="name@marwadiuniversity.ac.in"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F4F4F0] border border-[#E2E2DC] rounded-xl text-sm font-mono text-[#111318] focus:outline-none focus:border-[#00A86B]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  Notify Me
                </button>
              </form>
            )}

            {/* Back to Home CTA */}
            <div className="mt-8 pt-8 border-t border-[#E2E2DC]/80 flex items-center justify-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#555B63] hover:text-[#00A86B] transition-colors py-1 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Return to Chapter Homepage</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
