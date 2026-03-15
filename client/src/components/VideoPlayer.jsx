import { useState } from 'react';

const VideoPlayer = ({ videoId, title }) => {
  const [loaded, setLoaded] = useState(false);

  if (!videoId) {
    return (
      <div className="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
        <p className="text-slate-500">Select a lesson to start watching</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 animate-pulse">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <iframe
        key={videoId}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0&origin=${encodeURIComponent(window.location.origin)}`}
        title={title || 'Lesson Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
        onLoad={() => setLoaded(true)}
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default VideoPlayer;
