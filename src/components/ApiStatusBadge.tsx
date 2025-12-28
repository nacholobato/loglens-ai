import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const ApiStatusBadge = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          mode: 'cors',
        });
        const data = await response.json();
        setIsConnected(data.status === 'ok');
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className="status-badge animate-shimmer">
        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
        <span>Checking...</span>
      </div>
    );
  }

  return isConnected ? (
    <div className="status-connected animate-fade-in">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      <Wifi className="h-3.5 w-3.5" />
      <span>API Connected</span>
    </div>
  ) : (
    <div className="status-disconnected animate-fade-in">
      <span className="relative flex h-2 w-2">
        <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
      </span>
      <WifiOff className="h-3.5 w-3.5" />
      <span>Disconnected</span>
    </div>
  );
};
