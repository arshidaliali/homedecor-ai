
import type { MouseEvent, RefObject } from 'react';

type Props = {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    maskCanvasRef: RefObject<HTMLCanvasElement | null>;
    currentMode: 'split' | 'side';
    isMaskingActive: boolean;
    handleMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMove: (e: MouseEvent<HTMLCanvasElement>) => void;
    handleMouseUp: () => void;
};

export default function ComparisonCanvas({
    canvasRef,
    maskCanvasRef,
    currentMode,
    isMaskingActive,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
}: Props) {
    return (
        <div className="relative my-4 flex-1 w-full bg-slate-900 rounded-xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center justify-center select-none shadow-inner">
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="max-w-full max-h-[550px] object-contain cursor-crosshair rounded-lg"
            />

            <canvas
                ref={maskCanvasRef}
                className="absolute top-0 left-0 pointer-events-none"
            />

            {currentMode === 'split' && (
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700 text-white text-[11px] px-3 py-1.5 rounded-lg pointer-events-none flex items-center gap-2">
                    <i className="fa-solid fa-arrows-left-right text-emerald-400"></i>
                    Drag center line to compare Before & After
                </div>
            )}
        </div>
    );
}
