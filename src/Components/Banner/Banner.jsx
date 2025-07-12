import React from 'react';
import Marque from './Marque';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const Banner = () => {
  const navigate = useNavigate();

  const imageVariant = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  const textVariant = {
    hidden: { y: 50, opacity: 0 },
    visible: (i = 1) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.8,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="w-[98%] mx-auto my-5">
      <div className="w-full mt-10">
        <Marque />
      </div>

      <div className="hero pb-10">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <motion.img
            src="https://i.ibb.co.com/tMDk84LB/hero-kids.png"
            alt="Hero"
            variants={imageVariant}
            initial="hidden"
            animate="visible"
            className="max-w-md"
          />

          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            <motion.h1
              className="text-6xl font-semibold"
              variants={textVariant}
              custom={1}
            >
              <span className="text-[rgb(254,163,1)]">Empowering</span> students
              <br /> from small age <br />
              <span className="text-[rgb(5,212,223)]">towards vision</span>
            </motion.h1>

            <motion.p className="text-xl" variants={textVariant} custom={2}>
              With the courage, Confidence, Creativity and Compassion to make their Unique Contribution in a Diverse and Dynamic World.
            </motion.p>

            <motion.button
              onClick={() => navigate("/admission")}
              className="btn btn-lg text-white text-2xl border-none bg-black px-10 rounded-2xl"
              variants={textVariant}
              custom={3}
            >
              Enroll Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
