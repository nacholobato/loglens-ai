import { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onClear: () => void;
  preview: string | null;
  isLoading: boolean;
}

export const ImageUpload = ({ onImageSelect, onClear, preview, isLoading }: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please upload a JPEG or PNG image.',
      });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Please upload an image smaller than 10MB.',
      });
      return false;
    }
    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageSelect(file, preview);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (preview) {
    return (
      <div className="relative animate-scale-in">
        <div className="glass-card overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-[400px] object-contain"
          />
          {!isLoading && (
            <button
              onClick={onClear}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-glass hover:bg-destructive/20 hover:border-destructive/50 transition-all duration-200"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone p-12 ${isDragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-glow" />
          <div className="relative p-6 rounded-full bg-secondary/50 border border-glass">
            {isDragOver ? (
              <ImageIcon className="h-10 w-10 text-primary" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {isDragOver ? 'Drop your image here' : 'Drag & drop your image'}
          </p>
          <p className="text-sm text-muted-foreground">
            or <span className="text-primary hover:underline cursor-pointer">browse files</span>
          </p>
        </div>
        
        <p className="text-xs text-muted-foreground/70">
          Supports JPEG, PNG • Max 10MB
        </p>
      </div>
    </div>
  );
};
