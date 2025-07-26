import React from 'react';
import { Link } from 'react-router-dom'; // changed to react-router-dom
import { motion } from 'framer-motion';

const Facilities = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const itemHover = {
    scale: 1.05,
    transition: { duration: 0.3, ease: 'easeOut' },
  };

  return (
    <motion.div
      className="w-[90%] mx-auto my-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Existing Background Image Section */}
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
          <motion.h2
            className="text-5xl font-extrabold mb-8 tracking-wide drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our School Facilities
          </motion.h2>

          <div className="space-y-6 max-w-4xl">
            {[
              `At our school, we believe the right environment sparks curiosity and unlocks potential.
               Our modern infrastructure is built to support learning and innovation at every level.`,
              `Interactive classrooms, high-tech computer labs, and a rich library foster a love for
               discovery. Outdoor playgrounds, sports courts, and creative spaces provide balance through movement and play.`,
              `We ensure a safe and nurturing environment with surveillance, medical facilities, and wellness support.
               Our campus also reflects environmental responsibility, with solar power, greenery, and rainwater harvesting systems.`,
            ].map((text, idx) => (
              <motion.p
                key={idx}
                className="bg-white/40 backdrop-blur-md p-5 rounded-lg text-lg md:text-xl leading-relaxed shadow-lg cursor-pointer"
                whileHover={itemHover}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {text}
              </motion.p>
            ))}
          </div>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg shadow-md text-lg transition"
              >
                Contact us
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Facilities;
