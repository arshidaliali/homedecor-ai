
type Props = {
    placement: 'generate' | 'footer';
    onGenerate?: () => void;
    isGenerating?: boolean;
};

export default function StudioActions({
    placement,
    onGenerate,
    isGenerating = false,
}: Props) {
    if (placement === 'generate') {
        return (
            <button
                type="button"
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
            >
                <i
                    className={`fa-solid ${isGenerating
                            ? 'fa-spinner fa-spin'
                            : 'fa-wand-magic-sparkles'
                        }`}
                />
                <span>
                    {isGenerating
                        ? 'Sending to backend...'
                        : 'Generate AI Redesign'}
                </span>
            </button>
        );
    }

    return (
        <div className="flex items-center space-x-3">
            <button
                type="button"
                className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
                <i className="fa-regular fa-bookmark" /> Save Project
            </button>

            <button
                type="button"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
                <i className="fa-solid fa-download" /> Download HD Redesign
            </button>
        </div>
    );
}
