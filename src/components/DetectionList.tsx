import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Detection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  class_id: number;
}

interface DetectionListProps {
  detections: Detection[];
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

export const DetectionList = ({ detections }: DetectionListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Detection Details</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
            {detections.length} items
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-glass">
          <div className="max-h-[300px] overflow-y-auto">
            {detections.map((det, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border-b border-glass/50 last:border-0 hover:bg-secondary/20 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-sm">Log #{index + 1}</span>
                    <span
                      className="text-sm font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${COLORS[index % COLORS.length]}20`,
                        color: COLORS[index % COLORS.length],
                      }}
                    >
                      {(det.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground font-mono">
                    ({det.x1.toFixed(0)}, {det.y1.toFixed(0)}) → ({det.x2.toFixed(0)}, {det.y2.toFixed(0)})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
