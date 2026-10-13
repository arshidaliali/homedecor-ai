
export default function StudioHeader() {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                        <i className="fa-solid font-bold fa-wand-magic-sparkles text-lg"></i>
                    </div>
                    <div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            Aura<span className="text-emerald-600">Home</span>
                        </span>
                        <span className="hidden sm:inline-block text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full ml-2">
                            AI Studio
                        </span>
                    </div>
                </div>

                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                    <a href="#" className="text-emerald-600 font-semibold flex items-center gap-1.5">
                        <i className="fa-solid fa-paintbrush"></i> Studio
                    </a>
                    <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
                        <i className="fa-solid fa-images"></i> Gallery
                    </a>
                    <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
                        <i className="fa-solid fa-layer-group"></i> My Projects
                    </a>
                </nav>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                            alt="User Profile"
                            className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/30"
                        />
                        <div className="hidden lg:block text-left pr-2">
                            <div className="text-xs font-semibold text-slate-800">Rahamd Ullah</div>
                            <div className="text-[10px] text-emerald-600 font-medium">Pro Plan (120 Credits)</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
