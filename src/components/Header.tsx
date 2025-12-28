import { Layers } from 'lucide-react';
import { ApiStatusBadge } from './ApiStatusBadge';

export const Header = () => {
  return (
    <header className="w-full border-b border-glass backdrop-blur-xl bg-background/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-primary/30 blur-lg" />
              <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Layers className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">LogVision AI</h1>
              <p className="text-xs text-muted-foreground">Intelligent Log Detection</p>
            </div>
          </div>
          
          <ApiStatusBadge />
        </div>
      </div>
    </header>
  );
};
