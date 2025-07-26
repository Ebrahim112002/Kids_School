import React from 'react';
import { motion } from 'framer-motion';

const Admission_info = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: (i) => ({ opacity: 0, x: i === 0 ? -60 : 60 }),
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.6,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  };

  const features = [
    'Experienced and caring faculty',
    'Modern classrooms and facilities',
    'Holistic curriculum with co-curricular activities',
    'Safe and secure campus',
    'Digital learning tools and smart boards',
  ];

  return (
    <motion.section
      className="bg-blue-50 py-20 px-4"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14 rounded-2xl shadow-lg overflow-hidden p-6 lg:p-10 bg-white/40 backdrop-blur-sm border border-blue-100">
        {/* Image */}
        <motion.div
          className="w-full lg:w-1/2"
          custom={0}
          variants={childVariants}
        >
          <motion.img
            src="https://i.ibb.co/pBwtWJP6/58422295-9424417.jpg"
            alt="Admission"
            className="w-full rounded-xl object-cover shadow-md"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          className="w-full lg:w-1/2"
          custom={1}
          variants={childVariants}
        >
          <motion.h2
            className="text-4xl font-bold text-blue-800 mb-6 leading-snug"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Admission Information
          </motion.h2>

          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            We welcome students from <strong>Playgroup</strong> to <strong>Class 12</strong> to be part of our vibrant learning community.
          </p>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Our school is committed to providing quality education in a nurturing and inclusive environment. Admissions are now open for the academic year. We offer:
          </p>

          <ul className="space-y-2 mb-6">
            {features.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start text-gray-800 text-md"
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          <p className="text-md text-gray-600 mb-6">
            Visit our <strong>Admission Form</strong> page to apply or contact our admin office for more details.
          </p>

          <motion.a
            href="/admission"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            whileTap={{ scale: 0.95 }}
          >
            Apply Now
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Admission_info;
