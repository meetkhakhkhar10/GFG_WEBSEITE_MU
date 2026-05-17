import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, Calendar, TrendingUp, Award, ArrowUpRight, Activity } from "lucide-react";

interface AnalyticsProps {
  stats: any;
}

export default function AdminAnalytics({ stats }: AnalyticsProps) {
  const chartData = [
    { name: 'Jan', attendance: 400, events: 2 },
    { name: 'Feb', attendance: 300, events: 4 },
    { name: 'Mar', attendance: 600, events: 5 },
    { name: 'Apr', attendance: 800, events: 3 },
  ];

  return (
    <div className="space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", val: "2,543", icon: Users, color: "text-blue-400" },
          { label: "Check-ins Today", val: "142", icon: Activity, color: "text-[#00ff88]" },
          { label: "Active Events", val: "12", icon: Calendar, color: "text-purple-400" },
          { label: "Points Awarded", val: "45.2k", icon: Award, color: "text-yellow-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#111] border border-white/5 p-8 rounded-[32px] hover:border-white/20 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black">{stat.val}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Attendance Trends */}
        <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[40px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Attendance Velocity</h3>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Participation trends across semester</p>
            </div>
            <TrendingUp className="text-[#00ff88] w-5 h-5" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff10" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#00ff88" fillOpacity={1} fill="url(#colorAtt)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Impact */}
        <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[40px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Event Distribution</h3>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Operational volume per month</p>
            </div>
            <Calendar className="text-purple-400 w-5 h-5" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff10" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
                <Bar dataKey="events" fill="#a855f7" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
