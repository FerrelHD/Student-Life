import React, { useRef, useState, useEffect, useCallback } from 'react';

interface ImageCropModalProps {
  imageSrc: string;
  onSave: (croppedDataUrl: string) => void;
  onCancel: () => void;
  lang?: 'id' | 'en';
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  onSave,
  onCancel,
  lang = 'en',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);

  const CANVAS_SIZE = 300;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const fitScale = Math.max(CANVAS_SIZE / img.naturalWidth, CANVAS_SIZE / img.naturalHeight);
      setScale(fitScale);
      setOffset({
        x: (CANVAS_SIZE - img.naturalWidth * fitScale) / 2,
        y: (CANVAS_SIZE - img.naturalHeight * fitScale) / 2,
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const clamp = useCallback((ox: number, oy: number, s: number, img: HTMLImageElement) => {
    const r = CANVAS_SIZE / 2 - 4;
    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const iw = img.naturalWidth * s;
    const ih = img.naturalHeight * s;
    return {
      x: Math.min(cx - r, Math.max(cx + r - iw, ox)),
      y: Math.min(cy - r, Math.max(cy + r - ih, oy)),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.save();
    ctx.drawImage(img, offset.x, offset.y, img.naturalWidth * scale, img.naturalHeight * scale);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(209,196,233,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }, [offset, scale]);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart.current || !imgRef.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setOffset(clamp(dragStart.current.ox + dx, dragStart.current.oy + dy, scale, imgRef.current));
  };
  const onMouseUp = () => setDragging(false);

  const touchStart = useRef<{ tx: number; ty: number; ox: number; oy: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { tx: t.clientX, ty: t.clientY, ox: offset.x, oy: offset.y };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current || !imgRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    setOffset(clamp(
      touchStart.current.ox + (t.clientX - touchStart.current.tx),
      touchStart.current.oy + (t.clientY - touchStart.current.ty),
      scale,
      imgRef.current,
    ));
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!imgRef.current) return;
    e.preventDefault();
    const newScale = Math.max(0.5, Math.min(5, scale + (-e.deltaY * 0.001) * scale));
    const ratio = newScale / scale;
    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const clamped = clamp(cx - (cx - offset.x) * ratio, cy - (cy - offset.y) * ratio, newScale, imgRef.current);
    setScale(newScale);
    setOffset(clamped);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!imgRef.current) return;
    const newScale = Number(e.target.value);
    const ratio = newScale / scale;
    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const clamped = clamp(cx - (cx - offset.x) * ratio, cy - (cy - offset.y) * ratio, newScale, imgRef.current);
    setScale(newScale);
    setOffset(clamped);
  };

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
    ctx.drawImage(img, offset.x * ratio, offset.y * ratio, img.naturalWidth * scale * ratio, img.naturalHeight * scale * ratio);
    ctx.restore();
    onSave(out.toDataURL('image/jpeg', 0.92));
  };

  const labels = {
    title: lang === 'id' ? 'Crop Foto Profil' : 'Crop Profile Photo',
    hint: lang === 'id' ? 'Geser & scroll untuk menyesuaikan' : 'Drag & scroll to adjust',
    save: lang === 'id' ? 'Simpan Foto' : 'Save Photo',
    cancel: lang === 'id' ? 'Batal' : 'Cancel',
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1b1b1d] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/10 flex flex-col items-center gap-5">
        <div className="w-full flex items-center justify-between">
          <h3 className="font-jakarta font-black text-white text-lg">{labels.title}</h3>
          <button onClick={onCancel} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

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

        <div className="w-full flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-400 text-base">zoom_out</span>
          <input type="range" min={0.5} max={5} step={0.01} value={scale} onChange={handleSliderChange} className="flex-1 accent-[#d1c4e9] cursor-pointer" />
          <span className="material-symbols-outlined text-gray-400 text-base">zoom_in</span>
        </div>

        <p className="text-xs text-gray-400 font-jakarta">{labels.hint}</p>

        <div className="w-full flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3 font-bold font-jakarta transition-colors cursor-pointer">
            {labels.cancel}
          </button>
          <button onClick={handleSave} className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black rounded-full py-3 font-jakarta hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
            {labels.save}
          </button>
        </div>
      </div>
    </div>
  );
};
