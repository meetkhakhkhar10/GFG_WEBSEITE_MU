import { motion } from "motion/react";
import { Calendar, MapPin, Clock, Trophy, ArrowRight, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

import { apiService } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await apiService.getEvents();
        if (result.success) {
          setEvents(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: number, externalLink?: string) => {
    if (!user) {
      alert("Please login to register for events!");
      return;
    }

    if (externalLink) {
      window.open(externalLink, '_blank');
      return;
    }

    try {
      const result = await apiService.registerForEvent(eventId);
      if (result.success) {
        alert("Successfully registered for the event!");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      alert("Error registering for event");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-32 bg-[#000] min-h-screen text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest text-[#00ff88] uppercase bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full shadow-[0_0_15px_rgba(0,255,136,0.1)]"
          >
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
            <span>Campus Innovation Hub</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
            Campus <br />
            <span className="text-[#00ff88] neon-glow">Events</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed uppercase tracking-widest text-[10px]">
            Join our immersive hackathons, competitive coding jams, and collaborative workshops.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#00ff88] animate-spin mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Live Database...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {events.map((event, i) => (
              <motion.div
                key={event.id || event.EventID || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-[#111] border border-white/5 rounded-[40px] overflow-hidden hover:border-[#00ff88]/30 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row min-h-[500px]">
                  {/* Left Side: Image/Poster */}
                  <div className="lg:w-1/2 relative bg-[#0a0a0a] flex items-center justify-center min-h-[400px] lg:min-h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 p-6 lg:p-12">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.05)_0%,transparent_70%)]" />
                    {(event.poster_url || event.PosterURL) ? (
                      <img 
                        src={event.poster_url || event.PosterURL} 
                        alt={event.title || event.Title}
                        className="relative z-10 w-full h-full max-h-[500px] object-contain drop-shadow-[0_0_30px_rgba(0,255,136,0.15)] transition-transform duration-700 group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-[#00ff88]/20 bg-[#111] rounded-[24px] p-12 text-center relative z-10">
                        <ImageIcon className="w-16 h-16 text-[#00ff88]/20 mb-6" />
                        <span className="text-[#00ff88]/40 font-black uppercase tracking-[0.5em] text-[10px]">No Poster Uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Content */}
                  <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-[#00ff88] text-[10px] font-black uppercase tracking-[0.3em] block"> Event #{event.id || event.EventID} </span>
                      </div>
                      <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-tight group-hover:text-[#00ff88] transition-colors">
                        {event.title || event.Title}
                      </h2>
                      <p className="text-white/40 text-base leading-relaxed font-medium mb-10 max-w-xl">
                        {event.description || event.Description}
                      </p>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-2 gap-y-8 gap-x-12 mb-12">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00ff88]">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Date</div>
                          <div className="text-white font-bold text-sm tracking-tight">{event.date || event.Date}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00ff88]">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Status</div>
                          <div className="text-[#00ff88] font-bold text-sm tracking-tight uppercase">Registration Open</div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRegister(event.id || event.EventID, event.registration_link || event.RegistrationLink)}
                      className="w-full lg:w-max px-12 py-5 bg-[#00ff88] text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white transition-all flex items-center justify-center group/btn shadow-[0_0_20px_rgba(0,255,136,0.15)]"
                    >
                      {(event.registration_link || event.RegistrationLink) ? "Register Externally" : "Register Now"} 
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {events.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2">No active events found</h3>
                <p className="text-white/40 text-sm italic">Stay tuned for upcoming hackathons and workshops.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
