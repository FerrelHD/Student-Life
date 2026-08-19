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

  // Live values stored in refs to avoid stale-closure bugs in event handlers
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  // State only drives re-render / slider UI
  const [displayScale, setDisplayScale] = useState(1);
  const [, forceRedraw] = useState(0);

  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const touchStart = useRef<{ tx: number; ty: number; ox: number; oy: number } | null>(null);

  // Clamp so image always covers the circle
  const clamp = useCallback((ox: number, oy: number, s: number, img: HTMLImageElement) => {
    const iw = img.naturalWidth * s;
    const ih = img.naturalHeight * s;
    return {
      x: Math.min(CX - RADIUS, Math.max(CX + RADIUS - iw, ox)),
      y: Math.min(CY - RADIUS, Math.max(CY + RADIUS - ih, oy)),
    };
  }, []);

  // Commit live refs → trigger React re-render + UI sync
  const commit = useCallback((newScale: number, newOffset: { x: number; y: number }) => {
    scaleRef.current = newScale;
    offsetRef.current = newOffset;
    setDisplayScale(newScale);
    forceRedraw(n => n + 1);
  }, []);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const fitScale = Math.max(CANVAS_SIZE / img.naturalWidth, CANVAS_SIZE / img.naturalHeight);
      const initOffset = {
        x: (CANVAS_SIZE - img.naturalWidth * fitScale) / 2,
        y: (CANVAS_SIZE - img.naturalHeight * fitScale) / 2,
      };
      commit(fitScale, initOffset);
    };
    img.src = imageSrc;
  }, [imageSrc, commit]);

  // Draw on canvas whenever refs update
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d')!;
    const { x, y } = offsetRef.current;
    const s = scaleRef.current;

    // Image
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.drawImage(img, x, y, img.naturalWidth * s, img.naturalHeight * s);

    // Dark overlay with circle cutout
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Circle border
    ctx.save();
    ctx.strokeStyle = 'rgba(209,196,233,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  // ── Drag (mouse) ──────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.current = {
      mx: e.clientX, my: e.clientY,
      ox: offsetRef.current.x, oy: offsetRef.current.y,
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
  const onMouseUp = () => { dragStart.current = null; };

  // ── Drag (touch) ──────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = {
      tx: t.clientX, ty: t.clientY,
      ox: offsetRef.current.x, oy: offsetRef.current.y,
    };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current || !imgRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const next = clamp(
      touchStart.current.ox + (t.clientX - touchStart.current.tx),
      touchStart.current.oy + (t.clientY - touchStart.current.ty),
      scaleRef.current,
      imgRef.current,
    );
    offsetRef.current = next;
    forceRedraw(n => n + 1);
  };

  // ── Scroll to zoom ────────────────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent) => {
    if (!imgRef.current) return;
    e.preventDefault();
    // Read from refs — always current even during rapid scroll
    const prevScale = scaleRef.current;
    const prevOffset = offsetRef.current;
    const newScale = Math.max(0.5, Math.min(5, prevScale * (1 - e.deltaY * 0.001)));
    const ratio = newScale / prevScale;
    const nx = CX - (CX - prevOffset.x) * ratio;
    const ny = CY - (CY - prevOffset.y) * ratio;
    commit(newScale, clamp(nx, ny, newScale, imgRef.current));
  };

  // ── Slider ────────────────────────────────────────────────────────────────
  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!imgRef.current) return;
    const newScale = Number(e.target.value);
    const ratio = newScale / scaleRef.current;
    const nx = CX - (CX - offsetRef.current.x) * ratio;
    const ny = CY - (CY - offsetRef.current.y) * ratio;
    commit(newScale, clamp(nx, ny, newScale, imgRef.current));
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;
    const OUT = 512;
    const out = document.createElement('canvas');
    out.width = OUT;
    out.height = OUT;
    const ctx = out.getContext('2d')!;
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
    title:  lang === 'id' ? 'Crop Foto Profil'             : 'Crop Profile Photo',
    hint:   lang === 'id' ? 'Geser & scroll untuk menyesuaikan' : 'Drag & scroll to adjust',
    save:   lang === 'id' ? 'Simpan Foto'                  : 'Save Photo',
    cancel: lang === 'id' ? 'Batal'                        : 'Cancel',
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1b1b1d] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/10 flex flex-col items-center gap-5">
        {/* Title */}
        <div className="w-full flex items-center justify-between">
          <h3 className="font-jakarta font-black text-white text-lg">{L.title}</h3>
          <button onClick={onCancel} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="rounded-full cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onWheel={onWheel}
        />

        {/* Zoom slider */}
        <div className="w-full flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-400 text-base">zoom_out</span>
          <input
            type="range" min={0.5} max={5} step={0.01}
            value={displayScale}
            onChange={onSliderChange}
            className="flex-1 accent-[#d1c4e9] cursor-pointer"
          />
          <span className="material-symbols-outlined text-gray-400 text-base">zoom_in</span>
        </div>

        <p className="text-xs text-gray-400 font-jakarta">{L.hint}</p>

        {/* Actions */}
        <div className="w-full flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3 font-bold font-jakarta transition-colors cursor-pointer">
            {L.cancel}
          </button>
          <button onClick={handleSave} className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black rounded-full py-3 font-jakarta hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
            {L.save}
          </button>
        </div>
      </div>
    </div>
  );
};
