
import type { RefObject, MouseEvent } from 'react';
import ComparisonCanvas from './ComparisonCanvas';
import StudioActions from './StudioActions';

type Props = {
    containerRef: RefObject<HTMLDivElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    maskCanvasRef: RefObject<HTMLCanvasElement | null>;
    currentMode: 'split' | 'side';
    setCurrentMode: (mode: 'split' | 'side') => void;
    isMaskingActive: boolean;
    handleMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMove: (e: MouseEvent<HTMLCanvasElement>) => void;
    handleMouseUp: () => void;
    resetView: () => void;
};

export default function RedesignPreview({
    containerRef,
    canvasRef,
    maskCanvasRef,
    currentMode,
    setCurrentMode,
    isMaskingActive,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
}: Props) {
    return (
        <section
            ref={containerRef}
            className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col justify-between min-h-[500px]"
        >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                    <h2 className="font-bold text-slate-800 text-base">Redesign Preview</h2>
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full border border-slate-200">
                        <i className="fa-solid fa-circle text-[8px] text-emerald-500 mr-1"></i>
                        Ready
                    </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                    <button
                        onClick={() => setCurrentMode('split')}
                        className={`px-3 py-1.5 font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all ${currentMode === 'split'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        <i className="fa-solid fa-sliders"></i> Split Comparison
                    </button>

                    <button
                        onClick={() => setCurrentMode('side')}
                        className={`px-3 py-1.5 font-medium rounded-lg flex items-center gap-1.5 transition-colors ${currentMode === 'side'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        <i className="fa-solid fa-columns"></i> Side-by-Side
                    </button>
                </div>
            </div>

            <ComparisonCanvas
                canvasRef={canvasRef}
                maskCanvasRef={maskCanvasRef}
                currentMode={currentMode}
                isMaskingActive={isMaskingActive}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={resetView}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs transition-colors"
                        title="Reset View"
                    >
                        <i className="fa-solid fa-rotate-left mr-1"></i> Reset View
                    </button>
                </div>

                <StudioActions placement="footer" />
            </div>
        </section>
    );
}
