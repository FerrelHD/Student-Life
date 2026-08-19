import React, { useRef, useState, useEffect, useCallback } from 'react';

interface ImageCropModalProps {
  imageSrc: string;
  onSave: (croppedDataUrl: string) => void;
  onCancel: () => void;
  lang?: 'id' | 'en';
}

const CANVAS_SIZE = 300;
const RADIUS = CANVAS_SIZE / 2 - 4;
const CX = CANVAS_SIZE / 2;
const CY = CANVAS_SIZE / 2;

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  onSave,
  onCancel,
  lang = 'en',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Dynamic scale limits based on image dimensions
  const minScaleRef = useRef(1);
  const maxScaleRef = useRef(5);

  // Live values stored in refs to avoid stale closures
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  // UI state for range slider
  const [scaleBounds, setScaleBounds] = useState({ min: 1, max: 5 });
  const [displayScale, setDisplayScale] = useState(1);
  const [, forceRedraw] = useState(0);

  // Touch & Drag Tracking
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const touchStart = useRef<{ tx: number; ty: number; ox: number; oy: number } | null>(null);
  const pinchStart = useRef<{ dist: number; scale: number; ox: number; oy: number; cx: number; cy: number } | null>(null);

  // Clamp offset so image always completely covers the cropping circle
  const clamp = useCallback((ox: number, oy: number, s: number, img: HTMLImageElement) => {
    const iw = img.naturalWidth * s;
    const ih = img.naturalHeight * s;
    return {
      x: Math.min(CX - RADIUS, Math.max(CX + RADIUS - iw, ox)),
      y: Math.min(CY - RADIUS, Math.max(CY + RADIUS - ih, oy)),
    };
  }, []);

  // Update scale & offset synchronously and trigger re-render
  const commit = useCallback((newScale: number, newOffset: { x: number; y: number }) => {
    const boundedScale = Math.max(minScaleRef.current, Math.min(maxScaleRef.current, newScale));
    scaleRef.current = boundedScale;
    offsetRef.current = newOffset;
    setDisplayScale(boundedScale);
    forceRedraw(n => n + 1);
  }, []);

  // Load image & set dynamic min/max scale
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const fitScale = Math.max(CANVAS_SIZE / img.naturalWidth, CANVAS_SIZE / img.naturalHeight);
      const minS = fitScale;
      const maxS = fitScale * 4;

      minScaleRef.current = minS;
      maxScaleRef.current = maxS;
      setScaleBounds({ min: minS, max: maxS });

      const initOffset = {
        x: (CANVAS_SIZE - img.naturalWidth * fitScale) / 2,
        y: (CANVAS_SIZE - img.naturalHeight * fitScale) / 2,
      };
      commit(fitScale, initOffset);
    };
    img.src = imageSrc;
  }, [imageSrc, commit]);

  // Render on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = offsetRef.current;
    const s = scaleRef.current;

    // Draw Image
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.drawImage(img, x, y, img.naturalWidth * s, img.naturalHeight * s);

    // Overlay with cutout circle
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Circle border guide
    ctx.save();
    ctx.strokeStyle = 'rgba(209, 196, 233, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }, []);

  useEffect(() => {
    draw();
  });

  // Native non-passive Wheel listener (fixes browser console warning + page scroll)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!imgRef.current) return;

      const prevScale = scaleRef.current;
      const prevOffset = offsetRef.current;

      // Smooth zoom factor
      const zoomFactor = Math.pow(1.002, -e.deltaY);
      const targetScale = prevScale * zoomFactor;
      const newScale = Math.max(minScaleRef.current, Math.min(maxScaleRef.current, targetScale));

      const ratio = newScale / prevScale;
      const nx = CX - (CX - prevOffset.x) * ratio;
      const ny = CY - (CY - prevOffset.y) * ratio;

      commit(newScale, clamp(nx, ny, newScale, imgRef.current));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [clamp, commit]);

  // ── Mouse Drag ────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      ox: offsetRef.current.x,
      oy: offsetRef.current.y,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragStart.current || !imgRef.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    const next = clamp(dragStart.current.ox + dx, dragStart.current.oy + dy, scaleRef.current, imgRef.current);
    offsetRef.current = next;
    forceRedraw(n => n + 1);
  };

  const onMouseUp = () => {
    dragStart.current = null;
  };

  // ── Touch Drag & Pinch-to-Zoom ────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (!imgRef.current) return;

    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStart.current = {
        tx: t.clientX,
        ty: t.clientY,
        ox: offsetRef.current.x,
        oy: offsetRef.current.y,
      };
      pinchStart.current = null;
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      const rect = canvasRef.current?.getBoundingClientRect();
      const canvasMidX = rect ? midX - rect.left : CX;
      const canvasMidY = rect ? midY - rect.top : CY;

      pinchStart.current = {
        dist,
        scale: scaleRef.current,
        ox: offsetRef.current.x,
        oy: offsetRef.current.y,
        cx: canvasMidX,
        cy: canvasMidY,
      };
      touchStart.current = null;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!imgRef.current) return;

    if (e.touches.length === 1 && touchStart.current) {
      const t = e.touches[0];
      const dx = t.clientX - touchStart.current.tx;
      const dy = t.clientY - touchStart.current.ty;
      const next = clamp(touchStart.current.ox + dx, touchStart.current.oy + dy, scaleRef.current, imgRef.current);
      offsetRef.current = next;
      forceRedraw(n => n + 1);
    } else if (e.touches.length === 2 && pinchStart.current) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      if (pinchStart.current.dist === 0) return;

      const ratio = dist / pinchStart.current.dist;
      const newScale = Math.max(minScaleRef.current, Math.min(maxScaleRef.current, pinchStart.current.scale * ratio));
      const scaleRatio = newScale / pinchStart.current.scale;

      const nx = pinchStart.current.cx - (pinchStart.current.cx - pinchStart.current.ox) * scaleRatio;
      const ny = pinchStart.current.cy - (pinchStart.current.cy - pinchStart.current.oy) * scaleRatio;

      commit(newScale, clamp(nx, ny, newScale, imgRef.current));
    }
  };

  const onTouchEnd = () => {
    touchStart.current = null;
    pinchStart.current = null;
  };

  // ── Range Slider ──────────────────────────────────────────────────────────
  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!imgRef.current) return;
    const newScale = Number(e.target.value);
    const prevScale = scaleRef.current;
    const ratio = newScale / prevScale;

    const nx = CX - (CX - offsetRef.current.x) * ratio;
    const ny = CY - (CY - offsetRef.current.y) * ratio;

    commit(newScale, clamp(nx, ny, newScale, imgRef.current));
  };

  // ── Save Crop Result ──────────────────────────────────────────────────────
  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const OUT = 512;
    const out = document.createElement('canvas');
    out.width = OUT;
    out.height = OUT;
    const ctx = out.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
    ctx.clip();

    const ratio = OUT / CANVAS_SIZE;
    const { x, y } = offsetRef.current;
    const s = scaleRef.current;

    ctx.drawImage(img, x * ratio, y * ratio, img.naturalWidth * s * ratio, img.naturalHeight * s * ratio);
    ctx.restore();

    onSave(out.toDataURL('image/jpeg', 0.92));
  };

  const L = {
    title:  lang === 'id' ? 'Crop Foto Profil'                  : 'Crop Profile Photo',
    hint:   lang === 'id' ? 'Geser & cubit/scroll untuk menyesuaikan' : 'Drag & pinch/scroll to adjust',
    save:   lang === 'id' ? 'Simpan Foto'                       : 'Save Photo',
    cancel: lang === 'id' ? 'Batal'                             : 'Cancel',
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1b1b1d] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/10 flex flex-col items-center gap-5">
        {/* Title */}
        <div className="w-full flex items-center justify-between">
          <h3 className="font-jakarta font-black text-white text-lg">{L.title}</h3>
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Canvas Area */}
        <div className="relative overflow-hidden rounded-full touch-none select-none">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="cursor-grab active:cursor-grabbing"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        </div>

        {/* Zoom Slider with Dynamic Min & Max */}
        <div className="w-full flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!imgRef.current) return;
              const newS = Math.max(scaleBounds.min, scaleRef.current * 0.85);
              const ratio = newS / scaleRef.current;
              const nx = CX - (CX - offsetRef.current.x) * ratio;
              const ny = CY - (CY - offsetRef.current.y) * ratio;
              commit(newS, clamp(nx, ny, newS, imgRef.current));
            }}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">zoom_out</span>
          </button>

          <input
            type="range"
            min={scaleBounds.min}
            max={scaleBounds.max}
            step={(scaleBounds.max - scaleBounds.min) / 100}
            value={displayScale}
            onChange={onSliderChange}
            className="flex-1 accent-[#d1c4e9] cursor-pointer"
          />

          <button
            type="button"
            onClick={() => {
              if (!imgRef.current) return;
              const newS = Math.min(scaleBounds.max, scaleRef.current * 1.15);
              const ratio = newS / scaleRef.current;
              const nx = CX - (CX - offsetRef.current.x) * ratio;
              const ny = CY - (CY - offsetRef.current.y) * ratio;
              commit(newS, clamp(nx, ny, newS, imgRef.current));
            }}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">zoom_in</span>
          </button>
        </div>

        <p className="text-xs text-gray-400 font-jakarta text-center">{L.hint}</p>

        {/* Actions */}
        <div className="w-full flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3 font-bold font-jakarta transition-colors cursor-pointer text-sm"
          >
            {L.cancel}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black rounded-full py-3 font-jakarta hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-sm"
          >
            {L.save}
          </button>
        </div>
      </div>
    </div>
  );
};
