import { useState } from "react";
import { motion } from "motion/react";
import { 
  Server, 
  Globe, 
  RefreshCw, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Code, 
  Info, 
  ExternalLink,
  Cpu,
  Layers,
  ChevronRight,
  Sparkle
} from "lucide-react";

export default function NetlifyDeploy() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"web" | "cli">("web");
  
  // Custom redirection generator inputs
  const [customRules, setCustomRules] = useState<Array<{ from: string; to: string; status: number }>>([
    { from: "/*", to: "/index.html", status: 200 },
    { from: "/api/*", to: "/api/:splat", status: 200 }
  ]);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newStatus, setNewStatus] = useState<number>(200);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom || !newTo) return;
    setCustomRules([...customRules, { from: newFrom, to: newTo, status: newStatus }]);
    setNewFrom("");
    setNewTo("");
    setNewStatus(200);
  };

  const handleRemoveRule = (index: number) => {
    setCustomRules(customRules.filter((_, i) => i !== index));
  };

  const generateRedirectsContent = () => {
    return customRules
      .map(rule => `${rule.from.padEnd(20)} ${rule.to.padEnd(20)} ${rule.status}`)
      .join("\n");
  };

  const handleDownloadRedirects = () => {
    const text = generateRedirectsContent();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "_redirects";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-24 sm:py-32 bg-theme-bg relative overflow-hidden min-h-screen theme-transition">
      {/* Visual background accents */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,136,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-gfg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        {/* Main Title Badge */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gfg-primary/10 border border-gfg-primary/20 rounded-full mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-gfg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gfg-primary">Netlify Publishing & Redirection</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black text-theme-text italic tracking-tighter uppercase mb-6 leading-none">
            TSX COMPILATION & <span className="text-gfg-primary">REDIRECTS</span>
          </h1>
          
          <p className="text-theme-text-secondary text-base font-semibold max-w-2xl mx-auto leading-relaxed">
            Browsers cannot execute TypeScript or React (TSX) directly. Learn how to bundle your modern Vite application into native HTML/JS/CSS assets and deploy them instantly to Netlify with fully working SPA redirects.
          </p>
        </div>

        {/* Section 1: The Core Problem & Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 flex flex-col justify-between p-8 md:p-10 rounded-[2rem] bg-theme-bg-secondary border border-theme-border/80 shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-500">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-theme-text uppercase italic mb-4">
                Why <span className="text-amber-500">TSX</span> Won't Run Raw
              </h2>
              <p className="text-sm text-theme-text-secondary leading-relaxed font-semibold mb-4 text-left">
                Browsers only speak HTML, CSS, and standardized Javascript. When your app contains TSX components, Vite performs compilation (or bundling) to translate this highly structures component state into fully optimal vanilla assets.
              </p>
              <div className="font-mono text-[10px] bg-black/40 border border-white/5 p-4 rounded-xl text-theme-text-secondary text-left space-y-1">
                <p className="text-[#00ff88]"># Development</p>
                <p className="text-white">/src/App.tsx (React + TS)</p>
                <p className="text-amber-500">↓ Run: npm run build</p>
                <p className="text-[#00ff88]"># Production Build Output</p>
                <p className="text-white">/dist/index.html (Static Linker)</p>
                <p className="text-white">/dist/assets/index-D5f392.js (Precompiled Raw Javascript)</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-between p-8 md:p-10 rounded-[2rem] bg-theme-bg-secondary border border-theme-border/80 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gfg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center mb-6 text-[#00ff88]">
                <RefreshCw className="w-6 h-6 animate-spin-reverse" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-theme-text uppercase italic mb-4">
                The Single Page App <span className="text-gfg-primary">404 Challenge</span>
              </h2>
              <p className="text-sm text-theme-text-secondary leading-relaxed font-semibold mb-6 text-left">
                In modern SPAs, routing is managed internally by JavaScript inside the browser via client-side routing. If you navigate to <code className="px-1.5 py-0.5 bg-black/30 border border-white/5 rounded text-gfg-primary">/events</code> and hit <strong>Refresh</strong>, Netlify searches for a physical file at <code className="font-mono">/events/index.html</code>. Seeing none, it returns a dry 404 Error!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-black/30 border border-theme-border/50 p-5 rounded-2xl">
                  <h4 className="text-xs font-black uppercase text-red-400 tracking-wider mb-2">❌ Without redirects</h4>
                  <p className="text-xs text-theme-text-secondary font-medium leading-relaxed">
                    Hitting Reload on subpages (e.g. yoursite.com/about) signals the hosting server to fetch a directory index, causing broken linkages and dead-end blank screens.
                  </p>
                </div>
                
                <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 p-5 rounded-2xl">
                  <h4 className="text-xs font-black uppercase text-gfg-primary tracking-wider mb-2">✅ With HTML redirects</h4>
                  <p className="text-xs text-theme-text-secondary font-medium leading-relaxed">
                    Netlify captures all sub-paths and serves your central <code className="text-[#00ff88]">index.html</code> under a 200 rewrite, enabling your React router to display correct component screens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Redirect Generator */}
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border/80 shadow-md mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-gfg-primary via-[#00ff88] to-transparent" />
          
          <div className="flex flex-col lg:flex-row items-stretch gap-8">
            <div className="lg:w-1/2 flex flex-col justify-between text-left">
              <div>
                <span className="text-[10px] font-mono font-black py-1 px-3 bg-gfg-primary/10 border border-gfg-primary/20 text-gfg-primary rounded-full uppercase tracking-wider">
                  Utility Tool
                </span>
                <h3 className="text-3xl font-black uppercase tracking-tight text-theme-text italic mt-3 mb-4">
                  Netlify <span className="text-gfg-primary">_redirects</span> Generator
                </h3>
                <p className="text-sm text-theme-text-secondary font-semibold leading-relaxed mb-6">
                  Build and customize rules to handle routing easily. By default, Vite apps only require the root rewrite <code className="text-white">/* /index.html 200</code>. If you have active API proxies, append them above the master wildcard rewrite!
                </p>

                {/* Interactive rule inputs */}
                <form onSubmit={handleAddRule} className="space-y-4 bg-black/20 p-5 rounded-2xl border border-theme-border/50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#00ff88] mb-1">Add Redirection Entry</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-bold uppercase tracking-wider text-theme-text-muted">From Route</label>
                      <input 
                        type="text" 
                        placeholder="e.g. /custom-route"
                        value={newFrom}
                        onChange={(e) => setNewFrom(e.target.value)}
                        className="w-full h-10 px-3 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold focus:outline-none focus:border-gfg-primary text-theme-text" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-bold uppercase tracking-wider text-theme-text-muted">Target File / Query</label>
                      <input 
                        type="text" 
                        placeholder="e.g. /index.html"
                        value={newTo}
                        onChange={(e) => setNewTo(e.target.value)}
                        className="w-full h-10 px-3 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold focus:outline-none focus:border-gfg-primary text-theme-text" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-bold uppercase tracking-wider text-theme-text-muted">HTTP Status Code</label>
                      <select 
                        value={newStatus}
                        onChange={(e) => setNewStatus(Number(e.target.value))}
                        className="w-full h-10 px-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold focus:outline-none focus:border-gfg-primary text-theme-text"
                      >
                        <option value={200}>200 (Rewrite/SPA Redirect)</option>
                        <option value={301}>301 (Permanent Redirect)</option>
                        <option value={302}>302 (Temporary Redirect)</option>
                        <option value={404}>404 (Fallback Page)</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-10 bg-[#00ff88] hover:bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  >
                    Insert Rule Entry
                  </button>
                </form>
              </div>

              {/* Active Rules List */}
              <div className="mt-6 space-y-2">
                <span className="text-[8px] font-mono font-black uppercase tracking-wider text-theme-text-muted block">Active Redirection Chain</span>
                {customRules.map((r, i) => (
                  <div key={i} className="flex items-center justify-between bg-black/40 border border-theme-border/60 py-2.5 px-4 rounded-xl text-[11px] font-mono">
                    <div className="flex items-center space-x-2 text-theme-text">
                      <span className="text-gfg-primary">{r.from}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-500" />
                      <span className="text-white">{r.to}</span>
                      <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-[#00ff88] font-bold">{r.status}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveRule(i)} 
                      className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[9px] cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Output Preview Section */}
            <div className="lg:w-1/2 flex flex-col justify-between bg-black/40 border border-theme-border/60 rounded-[2rem] p-6 lg:p-8 text-left">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                  <div className="flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-gfg-primary animate-pulse" />
                    <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">public/_redirects output</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleCopy(generateRedirectsContent(), "generator")}
                      className="inline-flex items-center text-[9px] font-mono font-bold text-gfg-primary hover:text-white uppercase transition-colors shrink-0 cursor-pointer"
                    >
                      {copiedText === "generator" ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copy Syntax
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownloadRedirects}
                      className="inline-flex items-center text-[9px] font-mono font-bold text-gfg-primary hover:text-white uppercase transition-colors shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Download File
                    </button>
                  </div>
                </div>

                <p className="text-xs text-theme-text-secondary leading-relaxed font-semibold mb-4">
                  Make sure you save this configuration at <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 border border-white/10 rounded">/public/_redirects</code>. When Vite bundles, the asset is automatically moved to <code className="text-gfg-primary font-mono">/dist/_redirects</code>, which Netlify captures perfectly!
                </p>

                <pre className="font-mono text-xs text-white bg-black p-5 rounded-2xl border border-white/5 overflow-x-auto min-h-[160px] whitespace-pre select-all leading-relaxed">
                  {generateRedirectsContent()}
                </pre>
              </div>

              <div className="mt-6 flex items-center space-x-2 text-[10px] text-zinc-500 font-mono">
                <Info className="w-3.5 h-3.5 text-gfg-primary shrink-0" />
                <span>Format is simple: [source-route] [destination-route] [status-code]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Tabbed Deploy Instructions */}
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-theme-bg-secondary border border-theme-border/80 shadow-md text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-theme-border/60">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-theme-text italic">
                How to deploy to <span className="text-gfg-primary">Netlify</span>
              </h3>
              <p className="text-xs text-theme-text-muted font-bold tracking-widest uppercase mt-1">Instant publication checklist</p>
            </div>
            
            <div className="flex p-1 bg-black/35 border border-theme-border rounded-xl mt-4 sm:mt-0">
              <button
                onClick={() => setActiveTab("web")}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${activeTab === "web" ? "bg-gfg-primary text-black font-black" : "text-theme-text-muted hover:text-theme-text"}`}
              >
                Web Dashboard
              </button>
              <button
                onClick={() => setActiveTab("cli")}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${activeTab === "cli" ? "bg-gfg-primary text-black font-black" : "text-theme-text-muted hover:text-theme-text"}`}
              >
                Netlify CLI
              </button>
            </div>
          </div>

          {activeTab === "web" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/20 p-6 rounded-2xl border border-theme-border/50">
                  <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 flex items-center justify-center font-black text-xs mb-4">1</div>
                  <h4 className="text-sm font-black uppercase text-white tracking-wider mb-2">Build the Project</h4>
                  <p className="text-xs text-theme-text-secondary leading-relaxed font-semibold mb-3">
                    Compile the React/Vite code into static files located in the output folder.
                  </p>
                  <div className="relative font-mono text-[10.5px] bg-black p-3.5 rounded-xl border border-white/5 text-gfg-primary flex items-center justify-between">
                    <span>npm run build</span>
                    <button 
                      onClick={() => handleCopy("npm run build", "cmdBuild")} 
                      className="text-zinc-500 hover:text-white"
                    >
                      {copiedText === "cmdBuild" ? <Check className="w-3.5 h-3.5 text-[#00ff88]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-black/20 p-6 rounded-2xl border border-theme-border/50">
                  <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 flex items-center justify-center font-black text-xs mb-4">2</div>
                  <h4 className="text-sm font-black uppercase text-white tracking-wider mb-2">Drop /dist Folder</h4>
                  <p className="text-xs text-theme-text-secondary leading-relaxed font-semibold">
                    Login to <a href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer" className="text-[#00ff88] underline inline-flex items-center">app.netlify.com <ExternalLink className="w-2.5 h-2.5 ml-0.5 inline" /></a>. Drag and drop your compiled <code className="text-white font-mono bg-white/5 py-0.5 px-1 border border-white/10 rounded">dist/</code> folder into the Netlify Drag-and-Drop panel.
                  </p>
                </div>

                <div className="bg-black/20 p-6 rounded-2xl border border-theme-border/50">
                  <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 flex items-center justify-center font-black text-xs mb-4">3</div>
                  <h4 className="text-sm font-black uppercase text-white tracking-wider mb-2">Dynamic Success</h4>
                  <p className="text-xs text-theme-text-secondary leading-relaxed font-semibold">
                    Netlify assigns a secure SSL domain and parses <code className="text-white font-mono">dist/_redirects</code> dynamically to ensure routing across all subpages works flawlessly!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-2xl border border-theme-border/50 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <Terminal className="w-4 h-4 text-gfg-primary" />
                  <span>Interactive Netlify CLI Quick Deployment</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {/* Step 1 */}
                  <div className="flex items-start space-x-3 bg-black/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[#00ff88] font-black">Step 1: Install Netlify globally</span>
                    <div className="flex-grow text-right text-zinc-500">npm install -g netlify-cli</div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-start space-x-3 bg-black/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[#00ff88] font-black">Step 2: Authenticate terminal login</span>
                    <div className="flex-grow text-right text-zinc-500">netlify login</div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex items-start space-x-3 bg-black/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[#00ff88] font-black">Step 3: Compile and initiate site link</span>
                    <div className="flex-grow text-right text-zinc-500">npm run build && netlify init</div>
                  </div>
                  {/* Step 4 */}
                  <div className="flex items-start space-x-3 bg-black/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[#00ff88] font-black">Step 4: Deploy and push production</span>
                    <div className="flex-grow text-right text-zinc-500">netlify deploy --dir=dist --prod</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
