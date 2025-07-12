import React from 'react';
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';

const Card_details = () => {
  const story = useLoaderData();
  const { title, image, description } = story;

  return (
    <motion.div
      className="my-12 flex items-center justify-center bg-gray-50 p-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-3xl w-full"
        whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      >
        <motion.img 
          src={image} 
          alt={title} 
          className="w-full h-80 object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1>
          <p className="text-gray-600 text-lg">{description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Card_details;
