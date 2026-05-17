import { motion } from "motion/react";
import { Trophy, Medal, Award, User } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "../services/apiService";

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const result = await apiService.getLeaderboard();
        if (result.success) setData(result.data);
      } catch (error) {
        console.error("Leaderboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-[#111] border border-white/10 rounded-[32px] p-8 overflow-hidden relative">
      <div className="flex items-center space-x-4 mb-8">
        <Trophy className="w-8 h-8 text-[#00ff88]" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Leaderboard</h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-white/20 font-black uppercase tracking-widest text-[10px]">
            Calculating Ranks...
          </div>
        ) : data.length > 0 ? (
          data.map((user, i) => (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/[0.05] hover:border-[#00ff88]/30 transition-all hover:bg-white/[0.07] group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center font-black text-xs">
                  {i === 0 ? <Trophy className="w-5 h-5 text-yellow-500" /> : 
                   i === 1 ? <Medal className="w-5 h-5 text-gray-400" /> :
                   i === 2 ? <Award className="w-5 h-5 text-amber-600" /> : 
                   `#${i + 1}`}
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-white/20" />
                </div>
                <div>
                  <h3 className="font-bold uppercase text-sm tracking-tight">{user.name}</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">{user.department}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#00ff88] group-hover:neon-glow transition-all">{user.points}</span>
                <span className="block text-[8px] text-white/20 uppercase font-black tracking-widest">Points</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 text-white/20 italic">No data yet. Start attending events to earn points!</div>
        )}
      </div>
    </div>
  );
}
