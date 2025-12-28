export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
        
        {/* Spinning ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-secondary" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          
          {/* Inner pulse */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary to-accent opacity-50 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground">Analyzing Image</p>
        <p className="text-sm text-muted-foreground">Detecting logs with AI...</p>
      </div>
    </div>
  );
};
