import React from 'react';

const Videos = () => {
    return (
        <div>
           {/* Video Section BELOW the above */}
      <div className="mt-10 w-full max-w-6xl mx-auto">
        <div className="relative" style={{ paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
          <iframe
            src="https://streamable.com/e/lay4yp?autoplay=1&muted=1"
            title="Facilities Tour Video"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0 rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div> 
        </div>
    );
};

export default Videos;