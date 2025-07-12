import React from 'react';
import './explore.css'; // Make sure to import your CSS file

const Explore = () => {
  const images = [
    "https://i.ibb.co.com/nMkMVLLs/pexels-bhupindra-international-public-school-440721663-31864438.jpg",
    "https://i.ibb.co.com/KpRq2q1X/pexels-naomi-shi-374023-1001914.jpg",
    "https://i.ibb.co.com/MkMyLg53/pexels-panditwiguna-3401403.jpg",
    "https://i.ibb.co.com/zWGLXWNz/pexels-rebecca-zaal-252062-764681.jpg"
  ];

  return (
    <div className="w-[98%] max-w-7xl mx-auto my-16 py-10 overflow-hidden">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-[#1e293b]">
        Explore Our Campus – Where Learning Comes to Life
      </h2>

      {/* Marquee Container */}
      <div className="marquee-container">
        <div className="marquee-track">
          {[...images, ...images].map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Slide ${idx}`}
              className="marquee-image"
            />
          ))}
        </div>
      </div>

      <p className="mt-12 text-lg md:text-2xl text-center max-w-3xl mx-auto text-[#334155]">
        Step into a world designed to spark imagination and support growth. Our vibrant campus offers engaging classrooms, creative play zones, and safe outdoor spaces—perfect for curious young learners to explore, learn, and thrive every day.
      </p>
    </div>
  );
};

export default Explore;
