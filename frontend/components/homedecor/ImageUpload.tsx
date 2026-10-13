
type SampleKey = 'room' | 'kitchen' | 'garden';

type Props = {
    sampleImages: Record<SampleKey, { before: string; after: string }>;
    loadSample: (key: SampleKey) => void;
    onImageSelected: (file: File) => void;
};

export default function ImageUpload({
    sampleImages,
    loadSample,
    onImageSelected,
}: Props) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-800">
                    1. Upload Space Photo
                </label>
                <span className="text-xs text-slate-400">JPG, PNG up to 10MB</span>
            </div>

            <div
                onClick={() => document.getElementById('fileInput')?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 rounded-xl p-5 text-center cursor-pointer transition-all duration-200 group"
            >
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                            onImageSelected(file);
                        }

                        event.target.value = '';
                    }}
                />
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-500 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-all">
                    <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
                </div>
                <p className="text-xs font-medium text-slate-700">Drag and drop your photo here</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                    or <span className="text-emerald-600 font-semibold underline">browse files</span>
                </p>
            </div>

            <div className="mt-3">
                <p className="text-[11px] font-medium text-slate-500 mb-2">
                    Or try sample spaces:
                </p>
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
    );
}
