import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, Download, Trash2, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { DetectionCanvas } from '@/components/DetectionCanvas';
import { StatsCards } from '@/components/StatsCards';
import { DetectionList } from '@/components/DetectionList';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const API_BASE_URL = 'http://127.0.0.1:8000';

interface Detection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  class_id: number;
}

interface PredictionResult {
  log_count: number;
  detections: Detection[];
}

const Index = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const [showBoxes, setShowBoxes] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
    setResult(null);
    setProcessingTime(0);
  }, []);

  const handleClear = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setProcessingTime(0);
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile) {
      toast.error('No image selected', {
        description: 'Please upload an image first.',
      });
      return;
    }

    setIsLoading(true);
    const startTime = performance.now();

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: PredictionResult = await response.json();
      const endTime = performance.now();

      setResult(data);
      setProcessingTime(endTime - startTime);

      toast.success('Analysis Complete', {
        description: `Detected ${data.log_count} log${data.log_count !== 1 ? 's' : ''} in the image.`,
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Analysis Failed', {
        description: 'Could not connect to the API. Make sure the server is running.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'log-detection-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Image Downloaded', {
      description: 'Annotated image saved successfully.',
    });
  };

  const avgConfidence = result && result.detections.length > 0
    ? (result.detections.reduce((sum, d) => sum + d.confidence, 0) / result.detections.length) * 100
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!imagePreview && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">AI-Powered</span> Log Detection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload an image of logs and let our advanced computer vision model detect and count them with precision.
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <ImageUpload
            onImageSelect={handleImageSelect}
            onClear={handleClear}
            preview={imagePreview}
            isLoading={isLoading}
          />

          {/* Analyze Button */}
          {imagePreview && !result && !isLoading && (
            <div className="flex justify-center animate-fade-in">
              <button onClick={handleAnalyze} className="btn-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Analyze Image
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="glass-card">
              <LoadingSpinner />
            </div>
          )}

          {/* Results Section */}
          {result && !isLoading && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats */}
              <StatsCards
                logCount={result.log_count}
                avgConfidence={avgConfidence}
                processingTime={processingTime}
              />

              {/* Canvas with Detections */}
              {imagePreview && (
                <div className="glass-card p-4">
                  <DetectionCanvas
                    imageUrl={imagePreview}
                    detections={result.detections}
                    showBoxes={showBoxes}
                  />
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className="btn-secondary flex items-center gap-2"
                >
                  {showBoxes ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hide Boxes
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Show Boxes
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Result
                </button>

                <button
                  onClick={handleClear}
                  className="btn-secondary flex items-center gap-2 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear & Upload New
                </button>
              </div>

              {/* Detection List */}
              {result.detections.length > 0 && (
                <DetectionList detections={result.detections} />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-glass py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            LogVision AI • Powered by Computer Vision
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
