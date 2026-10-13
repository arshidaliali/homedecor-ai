
import ImageUpload from './ImageUpload';
import CategorySelector from './CategorySelector';
import StyleSelector from './StyleSelector';
import MaskingControls from './MaskingControls';
import PromptEditor from './PromptEditor';
import StudioActions from './StudioActions';

type SampleKey = 'room' | 'kitchen' | 'garden';

type Props = {
    sampleImages: Record<SampleKey, { before: string; after: string }>;
    loadSample: (key: SampleKey) => void;
    onImageSelected: (file: File) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedPreset: string;
    setSelectedPreset: (preset: string) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    isMaskingActive: boolean;
    setIsMaskingActive: (active: boolean) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
    clearMaskCanvas: () => void;
    generateRandomPrompt: () => void;
    onGenerate: () => void;
    isGenerating: boolean;
    apiMessage: string;
    apiError: string;
};

export default function ControlPanel(props: Props) {
    return (
        <section className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
            <ImageUpload
                sampleImages={props.sampleImages}
                loadSample={props.loadSample}
                onImageSelected={props.onImageSelected}
            />

            <CategorySelector
                selectedCategory={props.selectedCategory}
                setSelectedCategory={props.setSelectedCategory}
            />

            <StyleSelector
                selectedPreset={props.selectedPreset}
                setSelectedPreset={props.setSelectedPreset}
                setPrompt={props.setPrompt}
            />

            <MaskingControls
                isMaskingActive={props.isMaskingActive}
                setIsMaskingActive={props.setIsMaskingActive}
                brushSize={props.brushSize}
                setBrushSize={props.setBrushSize}
                clearMaskCanvas={props.clearMaskCanvas}
            />

            <PromptEditor
                prompt={props.prompt}
                setPrompt={props.setPrompt}
                generateRandomPrompt={props.generateRandomPrompt}
            />

            <StudioActions
                placement="generate"
                onGenerate={props.onGenerate}
                isGenerating={props.isGenerating}
            />

            {props.apiError && (
                <p className="text-sm text-red-600" role="alert">
                    {props.apiError}
                </p>
            )}
        </section>
    );
}
