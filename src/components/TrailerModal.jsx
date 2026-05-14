import { X, ExternalLink } from "lucide-react";
import { useState } from "react";

function TrailerModal({ isOpen, trailerUrl, onClose, movieTitle = "Movie" }) {
  const [embedError, setEmbedError] = useState(false);

  if (!isOpen) return null;

  // Extract YouTube video ID from URL
  const extractVideoId = (url) => {
    if (!url) return null;
    
    const urlStr = String(url).trim();
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    if (urlStr.includes("youtube.com/watch?v=")) {
      const match = urlStr.match(/v=([A-Za-z0-9_-]{11})/);
      if (match) return match[1];
    }
    
    // Format: https://youtu.be/VIDEO_ID
    if (urlStr.includes("youtu.be/")) {
      const match = urlStr.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
      if (match) return match[1];
    }
    
    // Format: https://www.youtube.com/embed/VIDEO_ID
    if (urlStr.includes("youtube.com/embed/")) {
      const match = urlStr.match(/embed\/([A-Za-z0-9_-]{11})/);
      if (match) return match[1];
    }
    
    // Try to find any 11-character alphanumeric pattern
    const match = urlStr.match(/[A-Za-z0-9_-]{11}/);
    if (match) return match[0];
    
    return null;
  };

  const getEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&fs=1&controls=1`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(trailerUrl);
  const watchUrl = trailerUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + ' trailer')}`;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2 rounded-full z-20 transition"
          title="Close"
        >
          <X size={24} className="text-white" />
        </button>

        {/* Embed YouTube Video */}
        {embedUrl && !embedError ? (
          <>
            <iframe
              src={embedUrl}
              title={`${movieTitle} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full bg-black"
              onError={() => setEmbedError(true)}
              style={{ display: 'block' }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col gap-6 p-8 bg-gray-900">
            {!embedUrl && (
              <div className="text-center">
                <p className="text-white text-lg font-bold mb-2">Trailer Not Available Locally</p>
                <p className="text-gray-400 text-sm mb-6">Watch the trailer on YouTube instead.</p>
              </div>
            )}
            
            {embedError && (
              <div className="text-center">
                <p className="text-white text-lg font-bold mb-2">Couldn't Load Embed</p>
                <p className="text-gray-400 text-sm mb-6">Try opening on YouTube directly.</p>
              </div>
            )}
            
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => window.open(watchUrl, "_blank", "noopener,noreferrer")}
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold transition flex items-center gap-2 text-white"
              >
                <ExternalLink size={20} />
                Open on YouTube
              </button>
              
              {!embedUrl && (
                <button
                  onClick={() => {
                    const query = encodeURIComponent(`${movieTitle} trailer`);
                    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank", "noopener,noreferrer");
                  }}
                  className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-bold transition text-white"
                >
                  Search YouTube
                </button>
              )}
              
              <button
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-bold transition text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrailerModal;
