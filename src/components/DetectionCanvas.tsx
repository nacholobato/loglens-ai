import { useEffect, useRef, useState } from 'react';

interface Detection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  class_id: number;
}

interface DetectionCanvasProps {
  imageUrl: string;
  detections: Detection[];
  showBoxes: boolean;
}

const COLORS = [
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#14B8A6', // Teal
];

export const DetectionCanvas = ({ imageUrl, detections, showBoxes }: DetectionCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      
      const container = containerRef.current;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      const scale = containerWidth / img.naturalWidth;
      const scaledHeight = img.naturalHeight * scale;
      
      setDimensions({
        width: containerWidth,
        height: scaledHeight,
      });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const scale = dimensions.width / img.naturalWidth;

    // Clear and draw image
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

    // Draw bounding boxes if enabled
    if (showBoxes && detections.length > 0) {
      detections.forEach((det, index) => {
        const color = COLORS[index % COLORS.length];
        const x = det.x1 * scale;
        const y = det.y1 * scale;
        const width = (det.x2 - det.x1) * scale;
        const height = (det.y2 - det.y1) * scale;

        // Draw box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Draw semi-transparent fill
        ctx.fillStyle = `${color}15`;
        ctx.fillRect(x, y, width, height);

        // Draw label background
        const label = `${(det.confidence * 100).toFixed(1)}%`;
        ctx.font = 'bold 14px Inter, sans-serif';
        const textWidth = ctx.measureText(label).width;
        const labelHeight = 24;
        const padding = 8;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - 1, y - labelHeight - 4, textWidth + padding * 2, labelHeight, 4);
        ctx.fill();

        // Draw label text
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + padding - 1, y - labelHeight / 2 - 4);
      });
    }
  }, [imageLoaded, dimensions, detections, showBoxes]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'log-detection-result.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full rounded-xl"
        style={{ maxHeight: '500px', objectFit: 'contain' }}
      />
    </div>
  );
};

export const useCanvasDownload = () => {
  return (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'log-detection-result.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };
};
