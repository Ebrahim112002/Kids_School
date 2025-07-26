import React from 'react';
import { motion } from 'framer-motion';

const Teachers = ({ teacher }) => {
  const { name, position, phone, image } = teacher;

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.03, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', transition: { duration: 0.3 } }
  };

  // Animation variants for tags
  const tagVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <motion.div
      className="w-96 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <figure className="h-64 relative">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </figure>

      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 font-['Inter',system-ui,sans-serif]">
            {name}
          </h2>
          <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
            {position}
          </span>
        </div>

        <p className="text-gray-600 text-sm font-['Inter',system-ui,sans-serif]">
          📞 {phone}
        </p>

        <div className="flex gap-2 mt-4">
          {['Teacher', 'Contact'].map((label, index) => (
            <motion.span
              key={label}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
              variants={tagVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              {label}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Teachers;