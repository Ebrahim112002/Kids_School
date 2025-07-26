import React from 'react';
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';

const Card_details = () => {
  const story = useLoaderData();
  const { title, image, description, more } = story;

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <motion.img
          src={image}
          alt={title}
          className="w-full h-[320px] object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        />

        <div className="p-8 sm:p-10">
          <motion.h1
            className="text-4xl font-extrabold text-green-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="text-base text-gray-600 leading-relaxed space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {more.split('. ').map((line, idx) => (
              <p key={idx}>{line.trim().endsWith('.') ? line.trim() : line.trim() + '.'}</p>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Card_details;
