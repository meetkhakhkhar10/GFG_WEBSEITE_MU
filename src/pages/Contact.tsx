import React, { useState, useEffect } from "react";
import { 
  Mail, Phone, MapPin, Send, AlertCircle, Sparkles, 
  Terminal, ArrowUpRight, CheckCircle2, MessageSquare, Clock
} from "lucide-react";
import { apiService } from "../services/apiService";

export default function Contact() {
  const [formUrl, setFormUrl] = useState("https://docs.google.com/forms/d/e/1FAIpQLSfQ5QSIqCn8AsRV_1CL76UXdPI3JABfhd7NC8tbGlih9ZQ8KA/viewform?embedded=true");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormUrl = async () => {
      try {
        setIsLoading(true);
        const res = await apiService.getSetting("contactFormUrl");
        if (res.success && res.data?.value) {
          setFormUrl(res.data.value);
        }
      } catch (err) {
        console.error("Failed to load contact form setting:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormUrl();
  }, []);

  return (
    <div className="bg-[#F4F4F0] min-h-screen text-[#111318] select-none">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

      {/* HEADER SECTION */}
      <section className="relative py-16 md:py-24 border-b border-[#E2E2DC] bg-[#F4F4F0]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="flex flex-wrap items-center justify-between border-b border-[#E2E2DC] pb-4 mb-10 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8B9198]">
            <div className="flex items-center space-x-2">
              <span className="text-[#00A86B] font-bold">05 / CORRESPONDENCE DESK</span>
              <span>·</span>
              <span className="text-[#111318]">OFFICIAL TRANSMISSION</span>
            </div>
            <div>STATUS: ONLINE</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-black text-[#111318] tracking-tight leading-[0.98]">
                Connect with our <br />
                <span className="font-editorial-italic font-normal text-[#00A86B]">
                  Campus Secretariat
                </span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#555B63] max-w-2xl leading-relaxed border-l-2 border-[#111318] pl-4">
                Have questions regarding upcoming hackathons, speaker invitations, chapter memberships, 
                or technical event partnerships? Reach out directly using the official transmission channels below.
              </p>
            </div>

            <div className="lg:col-span-4 font-mono text-[11px] space-y-2 bg-[#FFFFFF] border border-[#E2E2DC] p-5 shadow-sm">
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>RESPONSE CADENCE</span>
                <span className="text-[#00A86B] font-bold">&lt; 24 HOURS</span>
              </div>
              <div className="flex justify-between border-b border-[#E2E2DC] pb-2 text-[#8B9198]">
                <span>LOCATION</span>
                <span className="text-[#111318]">Rajkot, Gujarat</span>
              </div>
              <div className="flex justify-between text-[#8B9198]">
                <span>PRIMARY CLEARANCE</span>
                <span className="text-[#111318] font-bold">Campus Mantri</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE CONTACT MATRIX & EMBEDDED FORM */}
      <section className="py-16 md:py-24 border-b border-[#E2E2DC] bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left 5 Cols: Technical Telemetry & Addresses */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-8 space-y-6 shadow-[0_4px_20px_rgba(17,19,24,0.03)]">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00A86B] font-bold border-b border-[#E2E2DC] pb-3">
                  NODE TELEMETRY & CHANNELS
                </div>

                {/* Campus Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 border border-[#E2E2DC] bg-[#FAF9F5] flex items-center justify-center text-[#111318] shrink-0">
                    <MapPin className="w-4 h-4 text-[#00A86B]" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#8B9198] block">CAMPUS VENUE</span>
                    <p className="font-sans text-xs text-[#111318] font-semibold mt-0.5 leading-relaxed">
                      Marwadi University, Rajkot-Morbi Highway, Gauridad, Rajkot, Gujarat 360003, India
                    </p>
                  </div>
                </div>

                {/* Chapter Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 border border-[#E2E2DC] bg-[#FAF9F5] flex items-center justify-center text-[#111318] shrink-0">
                    <Mail className="w-4 h-4 text-[#00A86B]" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#8B9198] block">OFFICIAL DISPATCH EMAIL</span>
                    <a 
                      href="mailto:gfg@marwadiuniversity.ac.in"
                      className="font-mono text-xs text-[#111318] hover:text-[#00A86B] font-bold mt-0.5 block transition-colors"
                    >
                      gfg@marwadiuniversity.ac.in
                    </a>
                  </div>
                </div>

                {/* Campus Mantri Direct Contact */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 border border-[#E2E2DC] bg-[#FAF9F5] flex items-center justify-center text-[#111318] shrink-0">
                    <Terminal className="w-4 h-4 text-[#00A86B]" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#8B9198] block">CAMPUS MANTRI CLEARANCE</span>
                    <p className="font-sans text-xs text-[#111318] font-bold mt-0.5">Meet Khakhkhar</p>
                    <a 
                      href="mailto:meetkhakhkhar05@gmail.com"
                      className="font-mono text-[11px] text-[#00A86B] hover:underline block"
                    >
                      meetkhakhkhar05@gmail.com
                    </a>
                  </div>
                </div>

                {/* WhatsApp Community */}
                <div className="pt-4 border-t border-[#E2E2DC]">
                  <a
                    href="https://chat.whatsapp.com/F7RcXCTLYJ4Ije5NiL6sDM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 text-center"
                  >
                    <span>[ JOIN OFFICIAL WHATSAPP HUB ]</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Technical Operating Hours */}
              <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-6 font-mono text-xs space-y-3">
                <div className="flex items-center space-x-2 text-[#00A86B] font-bold text-[10px] uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>CAMPUS LAB HOURS</span>
                </div>
                <div className="space-y-1 text-[#555B63]">
                  <div className="flex justify-between">
                    <span>Monday – Friday:</span>
                    <span className="text-[#111318]">09:00 – 17:30 IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday (Hackathons):</span>
                    <span className="text-[#111318]">10:00 – 16:00 IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="text-[#8B9198]">Remote Community</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 7 Cols: Embedded Google Form in Paper Frame */}
            <div className="lg:col-span-7">
              <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-6 sm:p-8 shadow-[0_4px_20px_rgba(17,19,24,0.03)] space-y-4">
                
                <div className="flex items-center justify-between border-b border-[#E2E2DC] pb-3 font-mono text-[10px] uppercase tracking-widest text-[#8B9198]">
                  <span>TRANSMISSION PORTAL / GOOGLE FORMS</span>
                  <span className="text-[#00A86B] font-bold">SECURE SSL</span>
                </div>

                <div className="w-full overflow-hidden border border-[#E2E2DC] bg-[#FAF9F5] min-h-[640px]">
                  <iframe
                    src={formUrl}
                    width="100%"
                    height="680"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="w-full bg-[#FFFFFF]"
                    title="GeeksforGeeks Marwadi University Chapter Contact Form"
                  >
                    Loading Transmission Interface…
                  </iframe>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
