import React from 'react';

const Facilities = () => {
  return (
    <div className="w-[90%] mx-auto my-10">
      <section
        className="relative bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
        style={{
          backgroundImage: 'url("https://i.ibb.co.com/LXt2mtGz/image.png")',
          height: '850px',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-10"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center px-6 md:px-20 text-center text-white">
          <h2 className="text-5xl font-extrabold mb-8 tracking-wide drop-shadow-lg">
            Our School Facilities
          </h2>

          <div className="space-y-6 max-w-4xl">
            <p className="bg-white/40 backdrop-blur-md p-5 rounded-lg text-lg md:text-xl leading-relaxed shadow-lg transition-all duration-300 hover:scale-105">
              At our school, we believe the right environment sparks curiosity and unlocks potential. 
              Our modern infrastructure is built to support learning and innovation at every level.
            </p>

            <p className="bg-white/40 backdrop-blur-md p-5 rounded-lg text-lg md:text-xl leading-relaxed shadow-lg transition-all duration-300 hover:scale-105">
              Interactive classrooms, high-tech computer labs, and a rich library foster a love for 
              discovery. Outdoor playgrounds, sports courts, and creative spaces provide balance through movement and play.
            </p>

            <p className="bg-white/40 backdrop-blur-md p-5 rounded-lg text-lg md:text-xl leading-relaxed shadow-lg transition-all duration-300 hover:scale-105">
              We ensure a safe and nurturing environment with surveillance, medical facilities, and wellness support. 
              Our campus also reflects environmental responsibility, with solar power, greenery, and rainwater harvesting systems.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg shadow-md text-lg">
              View Gallery
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg shadow-md text-lg">
              Take a Tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Facilities;
