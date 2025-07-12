import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const Card = ({ card }) => {
  const { title, image, description,_id } = card;

  return (
    <motion.div 
      className="mx-auto w-[90%] max-w-5xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
    >
      <div className="card lg:card-side bg-base-100 shadow-lg">
        <figure className="w-full lg:w-1/2">
          <motion.img
            src={image}
            alt={title}
            className="object-cover w-full h-80"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </figure>
        <div className="card-body flex flex-col justify-center">
          <h2 className="card-title text-2xl font-bold">{title}</h2>
          <p className="text-gray-700">{description}</p>
          <div className="card-actions justify-end mt-4">
            <Link to={`/cardDetails/${_id}`}>
            <motion.button
              className="btn btn-primary"
              whileTap={{ scale: 0.95 }}
            >
              Show More
            </motion.button>
            </Link>
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
