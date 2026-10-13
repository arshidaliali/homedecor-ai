'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
    // State variables
    const [currentMode, setCurrentMode] = useState<'split' | 'side'>('split');
    const [isMaskingActive, setIsMaskingActive] = useState(false);
    const [brushSize, setBrushSize] = useState(35);
    const [selectedCategory, setSelectedCategory] = useState('Living Room');
    const [selectedPreset, setSelectedPreset] = useState('Japandi');
    const [prompt, setPrompt] = useState(
        'Serene Japandi style with light oak wood, beige linen sofa, low platform furniture, textured plaster walls, and bonsai plants'
    );

    // Refs for canvas and DOM elements
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const imagesLoadedRef = useRef(0);
    const imgBeforeRef = useRef<HTMLImageElement>(new Image());
    const imgAfterRef = useRef<HTMLImageElement>(new Image());

    const sliderPosRef = useRef(0.5);
    const isDraggingSliderRef = useRef(false);
    const isDrawingMaskRef = useRef(false);

    // Sample Images Repository
    const sampleImages = {
        room: {
            before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
            after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200'
        },
        kitchen: {
            before: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
            after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
        },
        garden: {
            before: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
            after: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=1200'
        }
    };

    // Load sample space
    const loadSample = (key: 'room' | 'kitchen' | 'garden') => {
        imagesLoadedRef.current = 0;
        const sample = sampleImages[key] || sampleImages.room;

        const imgBefore = imgBeforeRef.current;
        const imgAfter = imgAfterRef.current;

        imgBefore.crossOrigin = 'anonymous';
        imgAfter.crossOrigin = 'anonymous';

        imgBefore.onload = onImageLoaded;
        imgAfter.onload = onImageLoaded;

        imgBefore.src = sample.before;
        imgAfter.src = sample.after;
    };

    const onImageLoaded = () => {
        imagesLoadedRef.current += 1;
        if (imagesLoadedRef.current >= 2) {
            resizeCanvasToFit();
            renderCanvas();
        }
    };

    const resizeCanvasToFit = () => {
        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const container = containerRef.current;
        if (!canvas || !maskCanvas || !container) return;

        const maxW = container.clientWidth - 32;
        const maxH = container.clientHeight - 32;

        const imgBefore = imgBeforeRef.current;
        let w = imgBefore.width || 800;
        let h = imgBefore.height || 600;

        const ratio = Math.min(maxW / w, maxH / h);
        canvas.width = w * ratio;
        canvas.height = h * ratio;

        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        renderCanvas();
    };

    const renderCanvas = () => {
        if (imagesLoadedRef.current < 2) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const imgBefore = imgBeforeRef.current;
        const imgAfter = imgAfterRef.current;

        ctx.clearRect(0, 0, w, h);

        if (currentMode === 'split') {
            ctx.drawImage(imgAfter, 0, 0, w, h);

            const splitX = w * sliderPosRef.current;
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, splitX, h);
            ctx.clip();
            ctx.drawImage(imgBefore, 0, 0, w, h);
            ctx.restore();

            // Divider line
            ctx.beginPath();
            ctx.moveTo(splitX, 0);
            ctx.lineTo(splitX, h);
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Handle circle
            ctx.beginPath();
            ctx.arc(splitX, h / 2, 18, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#22c55e';
            ctx.stroke();

            ctx.fillStyle = '#15803d';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('↔', splitX, h / 2);
        } else {
            const halfW = w / 2;
            ctx.drawImage(imgBefore, 0, 0, halfW - 2, h);
            ctx.drawImage(imgAfter, halfW + 2, 0, halfW - 2, h);

            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(halfW - 2, 0, 4, h);
        }
    };

    // Setup Initial load & resize listeners
    useEffect(() => {
        loadSample('room');

        const handleResize = () => {
            resizeCanvasToFit();
            renderCanvas();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mouse / Touch handlers for Split Slider or Mask Drawing
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (isMaskingActive) {
            isDrawingMaskRef.current = true;
            drawMask(e);
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const splitX = canvas.width * sliderPosRef.current;

        if (Math.abs(x - splitX) < 40) {
            isDraggingSliderRef.current = true;
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (isMaskingActive && isDrawingMaskRef.current) {
            drawMask(e);
            return;
        }

        if (!isDraggingSliderRef.current || currentMode !== 'split') return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        let pos = x / canvas.width;
        if (pos < 0.05) pos = 0.05;
        if (pos > 0.95) pos = 0.95;

        sliderPosRef.current = pos;
        renderCanvas();
    };

    const handleMouseUp = () => {
        isDraggingSliderRef.current = false;
        isDrawingMaskRef.current = false;
    };

    const drawMask = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;
        const ctx = maskCanvas.getContext('2d');
        if (!ctx) return;

        const rect = maskCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    };

    const clearMaskCanvas = () => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;
        const ctx = maskCanvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        }
    };

    const generateRandomPrompt = () => {
        const prompts = [
            'Cozy Bohemian chic style with rattan furniture, emerald green velvet couch, textured macrame, warm lighting',
            'Clean Ultra-Minimalist luxury design with hidden accent lighting, polished concrete floor, monochrome palette',
            'Raw Industrial Loft aesthetic with exposed brick accent wall, black metal beams, cognac leather couch',
            'Bright Nordic Scandinavian decor with light pine wood, cozy knitted throws, white walls, minimalist floor lamps'
        ];
        const random = prompts[Math.floor(Math.random() * prompts.length)];
        setPrompt(random);
    };

    return (
        <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col">
            {/* Load FontAwesome CDN dynamically for Next.js */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />

            {/* Navigation Header */}
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
                                <div className="text-xs font-semibold text-slate-800">Sarah Jenkins</div>
                                <div className="text-[10px] text-emerald-600 font-medium">Pro Plan (120 Credits)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Studio Workspace */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT PANEL: Controls & Settings */}
                <section className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)]">

                    {/* 1. Photo Upload & Sample Presets */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-slate-800">1. Upload Space Photo</label>
                            <span className="text-xs text-slate-400">JPG, PNG up to 10MB</span>
                        </div>

                        <div
                            onClick={() => document.getElementById('fileInput')?.click()}
                            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 rounded-xl p-5 text-center cursor-pointer transition-all duration-200 group"
                        >
                            <input type="file" id="fileInput" className="hidden" accept="image/*" />
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-500 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-all">
                                <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
                            </div>
                            <p className="text-xs font-medium text-slate-700">Drag and drop your photo here</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                or <span className="text-emerald-600 font-semibold underline">browse files</span>
                            </p>
                        </div>

                        {/* Sample Presets Picker */}
                        <div className="mt-3">
                            <p className="text-[11px] font-medium text-slate-500 mb-2">Or try sample spaces:</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => loadSample('room')}
                                    className="group border border-slate-200 hover:border-emerald-500 rounded-lg overflow-hidden relative text-left transition-all"
                                >
                                    <img src={sampleImages.room.before} className="w-full h-12 object-cover" alt="Living Room" />
                                    <div className="p-1 bg-white text-[10px] font-medium text-slate-700 truncate group-hover:text-emerald-600">Living Room</div>
                                </button>
                                <button
                                    onClick={() => loadSample('kitchen')}
                                    className="group border border-slate-200 hover:border-emerald-500 rounded-lg overflow-hidden relative text-left transition-all"
                                >
                                    <img src={sampleImages.kitchen.before} className="w-full h-12 object-cover" alt="Kitchen" />
                                    <div className="p-1 bg-white text-[10px] font-medium text-slate-700 truncate group-hover:text-emerald-600">Kitchen</div>
                                </button>
                                <button
                                    onClick={() => loadSample('garden')}
                                    className="group border border-slate-200 hover:border-emerald-500 rounded-lg overflow-hidden relative text-left transition-all"
                                >
                                    <img src={sampleImages.garden.before} className="w-full h-12 object-cover" alt="Garden" />
                                    <div className="p-1 bg-white text-[10px] font-medium text-slate-700 truncate group-hover:text-emerald-600">Patio / Garden</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. Space Category Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">2. Space Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Living Room', 'Kitchen', 'Bedroom', 'Garden / Patio'].map((cat) => {
                                const icon = cat.includes('Living') ? 'fa-couch' : cat.includes('Kitchen') ? 'fa-utensils' : cat.includes('Bed') ? 'fa-bed' : 'fa-tree';
                                const active = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`font-medium border text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${active ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <i className={`fa-solid ${icon}`}></i> {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Design Style Presets */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">3. Select Aesthetics & Style</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { name: 'Japandi', icon: '🎋', promptText: 'Serene Japandi style with light oak wood, beige linen sofa, low platform furniture, textured plaster walls, and bonsai plants' },
                                { name: 'Bohemian', icon: '🪴', promptText: 'Cozy Bohemian chic style with rattan furniture, emerald green velvet couch, textured macrame, warm lighting, and tropical indoor plants' },
                                { name: 'Minimalist', icon: '✨', promptText: 'Clean Ultra-Minimalist luxury design with hidden accent lighting, polished concrete floor, monochrome palette, and sleek Italian furniture' },
                                { name: 'Industrial', icon: '🏭', promptText: 'Raw Industrial Loft aesthetic with exposed brick accent wall, black metal beams, cognac leather couch, Edison bulb chandeliers, and large glass windows' },
                                { name: 'Scandi', icon: '❄️', promptText: 'Bright Nordic Scandinavian decor with light pine wood, cozy knitted throws, white walls, minimalist floor lamps, and pastel accents' },
                                { name: 'Luxury', icon: '🏛️', promptText: 'High-end contemporary interior with Italian marble coffee table, brass metal trim, plush velvet furniture, built-in library shelves, and designer ambient lighting' }
                            ].map((style) => (
                                <button
                                    key={style.name}
                                    onClick={() => {
                                        setSelectedPreset(style.name);
                                        setPrompt(style.promptText);
                                    }}
                                    className={`group border rounded-lg p-2 text-center transition-all bg-white ${selectedPreset === style.name ? 'border-emerald-500 shadow-sm ring-1 ring-emerald-500' : 'border-slate-200 hover:border-emerald-500'
                                        }`}
                                >
                                    <div className="w-full h-10 rounded bg-slate-50 mb-1 flex items-center justify-center text-lg">{style.icon}</div>
                                    <div className="text-[11px] font-semibold text-slate-700 group-hover:text-emerald-600">{style.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Masking & Targeted Edit Tools */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                                <i className="fa-solid fa-paintbrush text-emerald-600"></i> Target Specific Area (Optional)
                            </label>
                            <button
                                onClick={() => setIsMaskingActive(!isMaskingActive)}
                                className={`text-[11px] px-2 py-1 border rounded-md font-medium transition-colors ${isMaskingActive ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <i className="fa-solid fa-pen-ruler"></i> {isMaskingActive ? 'Brush Active' : 'Enable Brush'}
                            </button>
                        </div>

                        {isMaskingActive && (
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between gap-3 text-xs">
                                    <span className="text-slate-600 text-[11px]">Brush Size:</span>
                                    <input
                                        type="range"
                                        min="10"
                                        max="80"
                                        value={brushSize}
                                        onChange={(e) => setBrushSize(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                    />
                                    <span className="text-[11px] font-mono text-slate-500 w-6">{brushSize}px</span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-slate-500">Paint red mask over items to replace</span>
                                    <button onClick={clearMaskCanvas} className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                                        <i className="fa-solid fa-trash-can"></i> Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 5. Prompt Customization */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="promptInput" className="block text-sm font-semibold text-slate-800">
                                4. AI Redesign Instructions
                            </label>
                            <button onClick={generateRandomPrompt} className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1">
                                <i className="fa-solid fa-dice"></i> Surprise me
                            </button>
                        </div>
                        <textarea
                            id="promptInput"
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-all text-slate-700"
                            placeholder="Describe what you want to change..."
                        />
                    </div>

                    {/* 6. Generate Action Button */}
                    <button className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        <span>Generate AI Redesign</span>
                    </button>
                </section>

                {/* RIGHT PANEL: Preview Canvas & Before/After Interactive Comparison */}
                <section ref={containerRef} className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col justify-between min-h-[500px]">

                    {/* Canvas Header Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                            <h2 className="font-bold text-slate-800 text-base">Redesign Preview</h2>
                            <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full border border-slate-200">
                                <i className="fa-solid fa-circle text-[8px] text-emerald-500 mr-1"></i> Ready
                            </span>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                            <button
                                onClick={() => {
                                    setCurrentMode('split');
                                    renderCanvas();
                                }}
                                className={`px-3 py-1.5 font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all ${currentMode === 'split' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white text-slate-600 border border-slate-200'
                                    }`}
                            >
                                <i className="fa-solid fa-sliders"></i> Split Comparison
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentMode('side');
                                    renderCanvas();
                                }}
                                className={`px-3 py-1.5 font-medium rounded-lg flex items-center gap-1.5 transition-colors ${currentMode === 'side' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white text-slate-600 border border-slate-200'
                                    }`}
                            >
                                <i className="fa-solid fa-columns"></i> Side-by-Side
                            </button>
                        </div>
                    </div>

                    {/* Interactive Canvas Area */}
                    <div className="relative my-4 flex-1 w-full bg-slate-900 rounded-xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center justify-center select-none shadow-inner">
                        <canvas
                            ref={canvasRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className="max-w-full max-h-[550px] object-contain cursor-crosshair rounded-lg"
                        />
                        <canvas ref={maskCanvasRef} className="absolute top-0 left-0 pointer-events-none" />

                        {currentMode === 'split' && (
                            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700 text-white text-[11px] px-3 py-1.5 rounded-lg pointer-events-none flex items-center gap-2">
                                <i className="fa-solid fa-arrows-left-right text-emerald-400"></i> Drag center line to compare Before & After
                            </div>
                        )}
                    </div>

                    {/* Canvas Footer Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => {
                                    sliderPosRef.current = 0.5;
                                    renderCanvas();
                                }}
                                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs transition-colors"
                                title="Reset View"
                            >
                                <i className="fa-solid fa-rotate-left mr-1"></i> Reset View
                            </button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center gap-2">
                                <i className="fa-regular fa-bookmark"></i> Save Project
                            </button>
                            <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-md transition-all flex items-center gap-2">
                                <i className="fa-solid fa-download"></i> Download HD Redesign
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}