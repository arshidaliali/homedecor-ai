
type Props = {
    selectedPreset: string;
    setSelectedPreset: (preset: string) => void;
    setPrompt: (prompt: string) => void;
};

const styles = [
    {
        name: 'Japandi',
        icon: '🎋',
        promptText: 'Serene Japandi style with light oak wood, beige linen sofa, low platform furniture, textured plaster walls, and bonsai plants',
    },
    {
        name: 'Bohemian',
        icon: '🪴',
        promptText: 'Cozy Bohemian chic style with rattan furniture, emerald green velvet couch, textured macrame, warm lighting, and tropical indoor plants',
    },
    {
        name: 'Minimalist',
        icon: '✨',
        promptText: 'Clean Ultra-Minimalist luxury design with hidden accent lighting, polished concrete floor, monochrome palette, and sleek Italian furniture',
    },
    {
        name: 'Industrial',
        icon: '🏭',
        promptText: 'Raw Industrial Loft aesthetic with exposed brick accent wall, black metal beams, cognac leather couch, Edison bulb chandeliers, and large glass windows',
    },
    {
        name: 'Scandi',
        icon: '❄️',
        promptText: 'Bright Nordic Scandinavian decor with light pine wood, cozy knitted throws, white walls, minimalist floor lamps, and pastel accents',
    },
    {
        name: 'Luxury',
        icon: '🏛️',
        promptText: 'High-end contemporary interior with Italian marble coffee table, brass metal trim, plush velvet furniture, built-in library shelves, and designer ambient lighting',
    },
];

export default function StyleSelector({
    selectedPreset,
    setSelectedPreset,
    setPrompt,
}: Props) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
                3. Select Aesthetics & Style
            </label>
            <div className="grid grid-cols-3 gap-2">
                {styles.map((style) => (
                    <button
                        key={style.name}
                        onClick={() => {
                            setSelectedPreset(style.name);
                            setPrompt(style.promptText);
                        }}
                        className={`group border rounded-lg p-2 text-center transition-all bg-white ${selectedPreset === style.name
                                ? 'border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                                : 'border-slate-200 hover:border-emerald-500'
                            }`}
                    >
                        <div className="w-full h-10 rounded bg-slate-50 mb-1 flex items-center justify-center text-lg">
                            {style.icon}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-700 group-hover:text-emerald-600">
                            {style.name}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
