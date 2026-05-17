import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-32 bg-[#000] min-h-screen text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest text-[#00ff88] uppercase bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
            <span>Support & Inquiries</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]"
          >
            Get in <span className="text-[#00ff88] neon-glow">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed font-medium uppercase tracking-widest text-[10px]"
          >
            Have questions about events or collaborations? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[40px] bg-[#0a0a0a] border border-white/5 hover:border-[#00ff88]/30 transition-all shadow-2xl group"
            >
              <div className="w-14 h-14 mb-8 rounded-2xl bg-[#00ff88]/5 border border-[#00ff88]/20 text-[#00ff88] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00ff88] group-hover:text-black transition-all">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter transition-colors group-hover:text-[#00ff88]">Email Us</h3>
              <p className="text-white/40 text-[10px] font-black tracking-widest uppercase">meetkhakhkhar05@gmail.com</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-10 rounded-[40px] bg-[#0a0a0a] border border-white/5 hover:border-[#00ff88]/30 transition-all shadow-2xl group"
            >
              <div className="w-14 h-14 mb-8 rounded-2xl bg-[#00ff88]/5 border border-[#00ff88]/20 text-[#00ff88] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00ff88] group-hover:text-black transition-all">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter transition-colors group-hover:text-[#00ff88]">Call Us</h3>
              <p className="text-white/40 text-[10px] font-black tracking-widest uppercase">+91 98765 43210</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-10 rounded-[40px] bg-[#0a0a0a] border border-white/5 hover:border-[#00ff88]/30 transition-all shadow-2xl group"
            >
              <div className="w-14 h-14 mb-8 rounded-2xl bg-[#00ff88]/5 border border-[#00ff88]/20 text-[#00ff88] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00ff88] group-hover:text-black transition-all">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter transition-colors group-hover:text-[#00ff88]">Visit Us</h3>
              <p className="text-white/40 text-[10px] font-black tracking-widest uppercase line-clamp-2">Marwadi University, Rajkot, Gujarat, India</p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 md:p-16 rounded-[60px] bg-[#0a0a0a] border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff88]/5 rounded-full blur-[150px] pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#00ff88]/50 focus:bg-[#111] transition-all peer placeholder-transparent text-sm"
                      placeholder="Name"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-8 top-5 text-white/20 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-5 peer-focus:top-[-10px] peer-focus:left-6 peer-focus:text-[10px] peer-focus:text-[#00ff88] peer-focus:bg-[#0a0a0a] peer-focus:px-2 font-black uppercase tracking-widest"
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#00ff88]/50 focus:bg-[#111] transition-all peer placeholder-transparent text-sm"
                      placeholder="Email"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-8 top-5 text-white/20 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-5 peer-focus:top-[-10px] peer-focus:left-6 peer-focus:text-[10px] peer-focus:text-[#00ff88] peer-focus:bg-[#0a0a0a] peer-focus:px-2 font-black uppercase tracking-widest"
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white outline-none focus:border-[#00ff88]/50 focus:bg-[#111] transition-all peer placeholder-transparent resize-none text-sm"
                    placeholder="Message"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-8 top-5 text-white/20 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-5 peer-focus:top-[-10px] peer-focus:left-6 peer-focus:text-[10px] peer-focus:text-[#00ff88] peer-focus:bg-[#0a0a0a] peer-focus:px-2 font-black uppercase tracking-widest"
                  >
                    Your Message
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={cn(
                    "w-full py-6 bg-[#00ff88] text-black font-black rounded-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_30px_rgba(0,255,136,0.3)] uppercase tracking-widest text-[10px]",
                    status === "success" && "bg-green-500",
                    status === "error" && "bg-red-500 text-white"
                  )}
                >
                  {status === "idle" && (
                    <>
                      Send Message <Send className="ml-3 w-4 h-4" />
                    </>
                  )}
                  {status === "loading" && (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  )}
                  {status === "success" && (
                    <>
                      Success! <CheckCircle2 className="ml-3 w-4 h-4" />
                    </>
                  )}
                  {status === "error" && (
                    <>
                      Try Again <AlertCircle className="ml-3 w-4 h-4" />
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="text-red-500 text-[10px] text-center mt-4 font-black uppercase tracking-widest">{errorMsg}</p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
