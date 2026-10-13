
'use client';

import { useState, useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';

import StudioHeader from '@/components/homedecor/StudioHeader';
import ControlPanel from '@/components/homedecor/ControlPanel';
import RedesignPreview from '@/components/homedecor/RedesignPreview';

type SampleKey = 'room' | 'kitchen' | 'garden';

const sampleImages: Record<SampleKey, { before: string; after: string }> = {
  room: {
    before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
  },
  kitchen: {
    before: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
    after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  },
  garden: {
    before: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
    after: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=1200',
  },
};

export default function Home() {
  const [currentMode, setCurrentMode] = useState<'split' | 'side'>('split');
  const [isMaskingActive, setIsMaskingActive] = useState(false);
  const [brushSize, setBrushSize] = useState(35);
  const [selectedCategory, setSelectedCategory] = useState('Living Room');
  const [selectedPreset, setSelectedPreset] = useState('Japandi');
  const [prompt, setPrompt] = useState(
    'Serene Japandi style with light oak wood, beige linen sofa, low platform furniture, textured plaster walls, and bonsai plants'
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const imagesLoadedRef = useRef(0);
  const imgBeforeRef = useRef<HTMLImageElement | null>(null);
  const imgAfterRef = useRef<HTMLImageElement | null>(null);
  const hasAfterImageRef = useRef(true);

  const sliderPosRef = useRef(0.5);
  const isDraggingSliderRef = useRef(false);
  const isDrawingMaskRef = useRef(false);

  const loadSample = (key: SampleKey) => {
    imagesLoadedRef.current = 0;
    hasAfterImageRef.current = true;
    const sample = sampleImages[key];

    const imgBefore = imgBeforeRef.current;
    const imgAfter = imgAfterRef.current;

    if (!imgBefore || !imgAfter) return;

    imgBefore.crossOrigin = 'anonymous';
    imgAfter.crossOrigin = 'anonymous';

    imgBefore.onload = onImageLoaded;
    imgAfter.onload = onImageLoaded;

    imgBefore.src = sample.before;
    imgAfter.src = sample.after;
  };

  const handleImageSelected = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      window.alert('Please select a JPG, PNG, or WebP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      window.alert('Please select an image smaller than 10 MB.');
      return;
    }

    setSelectedFile(file);

    const imgBefore = imgBeforeRef.current;

    if (!imgBefore) return;

    // A new upload has no AI-generated result yet.
    hasAfterImageRef.current = false;
    imagesLoadedRef.current = 0;
    sliderPosRef.current = 0.5;

    // Ignore any unfinished sample-image load.
    imgBefore.onload = null;
    imgAfterRef.current!.onload = null;

    clearMaskCanvas();

    const objectUrl = URL.createObjectURL(file);

    imgBefore.onload = () => {
      URL.revokeObjectURL(objectUrl);

      imagesLoadedRef.current = 1;
      resizeCanvasToFit();
      renderCanvas();
    };

    imgBefore.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      imagesLoadedRef.current = 0;
      window.alert('The selected image could not be loaded.');
    };

    imgBefore.src = objectUrl;
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
    if (!imgBefore) return;

    const w = imgBefore.width || 800;
    const h = imgBefore.height || 600;

    const ratio = Math.min(maxW / w, maxH / h);

    canvas.width = w * ratio;
    canvas.height = h * ratio;

    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;

    renderCanvas();
  };

  const renderCanvas = () => {
    if (imagesLoadedRef.current < 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgBefore = imgBeforeRef.current;
    const imgAfter = imgAfterRef.current;

    if (!imgBefore) return;

    ctx.clearRect(0, 0, w, h);

    // Until a redesign exists, show only the original photo.
    if (!hasAfterImageRef.current) {
      ctx.drawImage(imgBefore, 0, 0, w, h);
      return;
    }

    // Sample comparisons require both images.
    if (!imgAfter || imagesLoadedRef.current < 2) return;

    if (currentMode === 'split') {
      ctx.drawImage(imgAfter, 0, 0, w, h);

      const splitX = w * sliderPosRef.current;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, h);
      ctx.clip();
      ctx.drawImage(imgBefore, 0, 0, w, h);
      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.stroke();

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

  useEffect(() => {
    imgBeforeRef.current = new Image();
    imgAfterRef.current = new Image();

    loadSample('room');
    const handleResize = () => {
      resizeCanvasToFit();
      renderCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
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

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
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

  const drawMask = (e: MouseEvent<HTMLCanvasElement>) => {
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

  const handleGenerate = async () => {
    if (!selectedFile) {
      setApiError('Please upload an image first.');
      setApiMessage('');
      return;
    }

    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      setApiError('Please enter a design prompt.');
      setApiMessage('');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('prompt', cleanPrompt);

    setIsGenerating(true);
    setApiError('');
    setApiMessage('');

    try {
      const response = await fetch(
        'http://localhost:8000/api/redesign',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          typeof result?.detail === 'string'
            ? result.detail
            : 'The backend request failed.'
        );
      }

      // The backend returns image bytes, not JSON.
      const contentType = response.headers.get('content-type') ?? '';

      if (!contentType.startsWith('image/')) {
        throw new Error('The backend did not return an image.');
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      const imgAfter = imgAfterRef.current;

      if (!imgAfter) {
        URL.revokeObjectURL(imageUrl);
        throw new Error('The preview image is not initialized.');
      }

      // Load the backend response into the existing preview canvas.
      await new Promise<void>((resolve, reject) => {
        imgAfter.onload = () => {
          URL.revokeObjectURL(imageUrl);

          hasAfterImageRef.current = true;
          imagesLoadedRef.current = 2;

          resizeCanvasToFit();
          renderCanvas();

          setApiMessage('');

          resolve();
        };

        imgAfter.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          reject(new Error('The returned image could not be displayed.'));
        };

        imgAfter.src = imageUrl;
      });
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Could not connect to the backend.'
      );
    } finally {
      setIsGenerating(false);
    }
  };
  const generateRandomPrompt = () => {
    const prompts = [
      'Cozy Bohemian chic style with rattan furniture, emerald green velvet couch, textured macrame, warm lighting',
      'Clean Ultra-Minimalist luxury design with hidden accent lighting, polished concrete floor, monochrome palette',
      'Raw Industrial Loft aesthetic with exposed brick accent wall, black metal beams, cognac leather couch',
      'Bright Nordic Scandinavian decor with light pine wood, cozy knitted throws, white walls, minimalist floor lamps',
    ];

    const random = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(random);
  };

  const resetView = () => {
    sliderPosRef.current = 0.5;
    renderCanvas();
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <StudioHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ControlPanel
          sampleImages={sampleImages}
          loadSample={loadSample}
          onImageSelected={handleImageSelected}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
          prompt={prompt}
          setPrompt={setPrompt}
          isMaskingActive={isMaskingActive}
          setIsMaskingActive={setIsMaskingActive}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          clearMaskCanvas={clearMaskCanvas}
          generateRandomPrompt={generateRandomPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          apiMessage={apiMessage}
          apiError={apiError}
        />
        {(apiMessage || apiError) && (
          <div className="lg:col-span-5 xl:col-span-4 min-w-0">
            {apiMessage && (
              <p className="text-sm text-green-700" role="status">
                {apiMessage}
              </p>
            )}

            {apiError && (
              <p className="text-sm text-red-600" role="alert">
                {apiError}
              </p>
            )}
          </div>
        )}

        <RedesignPreview
          containerRef={containerRef}
          canvasRef={canvasRef}
          maskCanvasRef={maskCanvasRef}
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
          isMaskingActive={isMaskingActive}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          resetView={resetView}
        />
      </main>
    </div>
  );
}
