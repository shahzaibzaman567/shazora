import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { aboutHighlights } from '../data/fashionData';

const About = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-anim', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 });
    }, aboutRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={aboutRef} className="container mx-auto px-6 max-w-7xl py-16 text-slate-900 dark:text-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="about-anim text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-heading font-bold uppercase tracking-widest mb-4">About Shazora</h1>
        <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
          Shazora is a modern e-commerce fashion platform focused on premium styling and easy shopping.
          Our brand combines contemporary aesthetics with trusted service, helping customers buy quality
          fashion products online with confidence.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
        {aboutHighlights.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="about-anim glass rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
            <p className="text-slate-600 dark:text-gray-400">{item.text}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default About;

