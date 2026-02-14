export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute inset-0 border-4 border-t-transparent border-white/20 rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">Loading CompoundVerse...</p>
        </div>
    );
}
