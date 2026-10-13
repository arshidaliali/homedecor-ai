
type Props = {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
};

export default function CategorySelector({
    selectedCategory,
    setSelectedCategory,
}: Props) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
                2. Space Category
            </label>
            <div className="grid grid-cols-2 gap-2">
                {['Living Room', 'Kitchen', 'Bedroom', 'Garden / Patio'].map((cat) => {
                    const icon = cat.includes('Living')
                        ? 'fa-couch'
                        : cat.includes('Kitchen')
                            ? 'fa-utensils'
                            : cat.includes('Bed')
                                ? 'fa-bed'
                                : 'fa-tree';

                    const active = selectedCategory === cat;

                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`font-medium border text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${active
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <i className={`fa-solid ${icon}`}></i> {cat}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
