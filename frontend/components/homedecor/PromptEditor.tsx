
type Props = {
    prompt: string;
    setPrompt: (prompt: string) => void;
    generateRandomPrompt: () => void;
};

export default function PromptEditor({
    prompt,
    setPrompt,
    generateRandomPrompt,
}: Props) {
    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <label
                    htmlFor="promptInput"
                    className="block text-sm font-semibold text-slate-800"
                >
                    4. AI Redesign Instructions
                </label>
                <button
                    onClick={generateRandomPrompt}
                    className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1"
                >
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
    );
}
