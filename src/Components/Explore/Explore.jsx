import React from 'react';

const Explore = () => {
    return (
        <div className="w-[90%] max-w-7xl mx-auto my-16 py-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-[#1e293b]">
          Explore Our Campus – Where Learning Comes to Life
        </h2>
      
        <div className="carousel w-full h-[400px] md:h-[500px] rounded-xl shadow-lg overflow-hidden">
          <div id="slide1" className="carousel-item relative w-full h-full">
            <img
              src="https://i.ibb.co.com/nMkMVLLs/pexels-bhupindra-international-public-school-440721663-31864438.jpg"
              className="w-full h-full object-cover"
              alt="Slide 1"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide4" className="btn btn-circle bg-white text-black shadow">❮</a>
              <a href="#slide2" className="btn btn-circle bg-white text-black shadow">❯</a>
            </div>
          </div>
      
          <div id="slide2" className="carousel-item relative w-full h-full">
            <img
              src="https://i.ibb.co.com/KpRq2q1X/pexels-naomi-shi-374023-1001914.jpg"
              className="w-full h-full object-cover"
              alt="Slide 2"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide1" className="btn btn-circle bg-white text-black shadow">❮</a>
              <a href="#slide3" className="btn btn-circle bg-white text-black shadow">❯</a>
            </div>
          </div>
      
          <div id="slide3" className="carousel-item relative w-full h-full">
            <img
              src="https://i.ibb.co.com/MkMyLg53/pexels-panditwiguna-3401403.jpg"
              className="w-full h-full object-cover"
              alt="Slide 3"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide2" className="btn btn-circle bg-white text-black shadow">❮</a>
              <a href="#slide4" className="btn btn-circle bg-white text-black shadow">❯</a>
            </div>
          </div>
      
          <div id="slide4" className="carousel-item relative w-full h-full">
            <img
              src="https://i.ibb.co.com/zWGLXWNz/pexels-rebecca-zaal-252062-764681.jpg"
              className="w-full h-full object-cover"
              alt="Slide 4"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide3" className="btn btn-circle bg-white text-black shadow">❮</a>
              <a href="#slide1" className="btn btn-circle bg-white text-black shadow">❯</a>
            </div>
          </div>
        </div>
      
        <p className="mt-12 text-lg md:text-2xl text-center max-w-3xl mx-auto text-[#334155]">
          Step into a world designed to spark imagination and support growth. Our vibrant campus offers engaging classrooms, creative play zones, and safe outdoor spaces—perfect for curious young learners to explore, learn, and thrive every day.
        </p>
      </div>
      
    );
};

export default Explore;