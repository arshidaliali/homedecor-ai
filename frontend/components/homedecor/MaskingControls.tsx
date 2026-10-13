
type Props = {
    isMaskingActive: boolean;
    setIsMaskingActive: (active: boolean) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    clearMaskCanvas: () => void;
};

export default function MaskingControls({
    isMaskingActive,
    setIsMaskingActive,
    brushSize,
    setBrushSize,
    clearMaskCanvas,
}: Props) {
    return (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <i className="fa-solid fa-paintbrush text-emerald-600"></i>
                    Target Specific Area (Optional)
                </label>
                <button
                    onClick={() => setIsMaskingActive(!isMaskingActive)}
                    className={`text-[11px] px-2 py-1 border rounded-md font-medium transition-colors ${isMaskingActive
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                >
                    <i className="fa-solid fa-pen-ruler"></i>{' '}
                    {isMaskingActive ? 'Brush Active' : 'Enable Brush'}
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
                        <span className="text-[11px] font-mono text-slate-500 w-6">
                            {brushSize}px
                        </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">
                            Paint red mask over items to replace
                        </span>
                        <button
                            onClick={clearMaskCanvas}
                            className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                            <i className="fa-solid fa-trash-can"></i> Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
