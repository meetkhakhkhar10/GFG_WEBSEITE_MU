import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogIn, Terminal, Loader2, AlertCircle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/src/contexts/AuthContext";
import { apiService } from "@/src/services/apiService";

export default function StudentLogin() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", enrollment: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const result = await apiService.login({
        email: loginData.email,
        enrollment_no: loginData.enrollment
      });
      
      if (result.success) {
        setLoginSuccess(true);
        setTimeout(() => {
          navigate("/student/portal");
        }, 1500);
      } else {
        throw new Error(result.message || "Invalid Email or Enrollment Number");
      }
    } catch (err: any) {
      setLoginError(err.message || "Invalid Email or Enrollment Number");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00ff88]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00ff88]/3 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#111] border border-white/5 rounded-[40px] p-10 shadow-2xl overflow-hidden"
      >
        <div className="relative text-center mb-10">
          <div className="w-16 h-16 bg-[#00ff88]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#00ff88]/10 shadow-sm">
            <Terminal className="w-8 h-8 text-[#00ff88]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Student <span className="text-[#00ff88]">Portal</span></h1>
          <p className="text-white/40 font-medium">Welcome to GFG MU chapter student gateway.</p>
        </div>

        <AnimatePresence mode="wait">
          {loginSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center"
            >
              <div className="w-20 h-20 bg-[#00ff88]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#00ff88]/20">
                <Check className="w-10 h-10 text-[#00ff88]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Authenticated</h3>
              <p className="text-[#00ff88] font-bold">Redirecting to project portal...</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleLogin}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Email ID</label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#00ff88]/30 transition-all font-medium shadow-sm"
                    placeholder="student@marwadiuniversity.ac.in"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Enrollment No.</label>
                  <input
                    type="text"
                    required
                    value={loginData.enrollment}
                    onChange={(e) => setLoginData({ ...loginData, enrollment: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:outline-none focus:border-[#00ff88]/30 transition-all font-medium shadow-sm"
                    placeholder="MU21BECS000"
                  />
                </div>
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{loginError}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="group w-full bg-[#00ff88] text-black font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-[#00ff88]/20 uppercase tracking-widest"
              >
                {loginLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-6 h-6 shadow-sm group-hover:translate-x-1 transition-transform" />
                    <span>Access Portal</span>
                  </>
                )}
              </button>

              <p className="text-center text-white/20 text-sm font-medium">
                Need help? <a href="/contact" className="text-[#00ff88] font-bold hover:underline">Contact Administrator</a>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
