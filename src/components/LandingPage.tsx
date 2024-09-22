import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, MotionValue } from 'framer-motion';
import Image from 'next/image';
import Logo from './mentforment (2).svg';

const LandingPage = () => {
  const [coinFlipped, setCoinFlipped] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [currentWord, setCurrentWord] = useState('product');

  const { scrollYProgress } = useScroll();

  const howItWorksRef = useRef(null);
  const coinFlipRef = useRef(null);

  // Parallax effect for background shapes
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 300]);


  const ScrollIndicator = () => {
    return (
        <div className="flex flex-col items-center absolute h-200 bg-darkGrey bottom-20 pb-10">
          <motion.svg   
          initial={{ opacity: 0, y: '-10' }}
          animate={{ opacity: [0, 1, 0], y: 0 }}
          transition={{ duration: 3, repeat: Infinity }} 
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 absolute">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path 
              d="M11.9997 13.1716L7.04996 8.22186L5.63574 9.63607L11.9997 16L18.3637 9.63607L16.9495 8.22186L11.9997 13.1716Z"
              className="fill-darkGrey dark:fill-cream border-red"
            ></path>
          </motion.svg>
          <motion.svg        
          initial={{ opacity: 0, y: '-10' }}
          animate={{ opacity: [1, 0, 1], y: 0 }}
          transition={{ duration: 3, repeat: Infinity }} 
         viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 absolute mt-5">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M11.9997 13.1716L7.04996 8.22186L5.63574 9.63607L11.9997 16L18.3637 9.63607L16.9495 8.22186L11.9997 13.1716Z"
              className="fill-darkGrey dark:fill-cream"
            ></path>
          </motion.svg>
        </div>
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prevWord => {
        const words = ['product', 'service', 'company', 'idea', 'business'];
        return words[Math.floor(Math.random() * words.length)];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animation progress for "How It Works" section
  const howItWorksProgress = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    [0, 1]
  );

  // Animation progress for "Coin Flip" section
  const coinFlipProgress = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    [0, 1]
  );

  return (
    <div className="bg-light dark:bg-dark bg-[url('https://www.transparenttextures.com/patterns/otis-redding.png')]">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/otis-redding.png')]">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-14 z-10">
          Get instant feedback on your <br /><span className="bg-gradient-to-r from-primary to-pink-500 text-transparent bg-clip-text">{currentWord}</span>
        </h1>
        <motion.button
          className="bg-primary text-white text-2xl font-bold py-4 px-8 rounded-lg z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Find a Match
        </motion.button>

        {/* Fixed blob */}
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] min-w-[500px] z-0">
          <path fill="#EAE7E4" d="M18.4,-33.5C23.6,-25.2,27.5,-19.8,30.5,-13.8C33.4,-7.8,35.5,-1.2,41.2,10.7C46.9,22.6,56.3,39.7,51.8,45C47.4,50.3,29.2,43.8,13.7,49.8C-1.8,55.8,-14.5,74.3,-24.7,75.3C-34.8,76.3,-42.4,59.8,-44.6,45.3C-46.8,30.8,-43.6,18.3,-43.9,7.2C-44.1,-4,-47.8,-13.8,-48.7,-26.6C-49.6,-39.4,-47.6,-55.2,-39,-61.9C-30.4,-68.7,-15.2,-66.3,-4.3,-59.5C6.6,-52.8,13.1,-41.7,18.4,-33.5Z" transform="translate(100 100)" />
        </svg>

        {/* Parallax background shapes */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: yBg }}
        >
          {/* Add thin lines, small circles, and triangles here for parallax effect */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-primary opacity-20 rounded-full"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary opacity-20 transform rotate-45"></div>
          <div className="absolute top-1/2 left-3/4 w-32 h-1 bg-tertiary opacity-20 transform -rotate-45"></div>
        </motion.div>

        <h1 className="text-primary text-2xl font-bold z-10 absolute bottom-[15vh]">This is how it works</h1>
        <ScrollIndicator />
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="relative bg-laccent dark:bg-daccent h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
          <motion.h2 
            className="text-7xl font-bold text-center mt-[8vh]"
          >
            {useTransform(howItWorksProgress, value => {
              if (value < 0.33) return "We go over current players";
              if (value < 0.66) return "We find the best match for you";
              return "We connect you";
            })}
          </motion.h2>

          <div className="relative h-[60vh] w-full max-w-4xl">
            <motion.div
              className="absolute w-32 h-32 bg-primary dark:bg-purple-400 rounded-lg"
              style={{
                top: useTransform(howItWorksProgress, [0, 1], ['0%', '50%']),
                left: useTransform(howItWorksProgress, [0, 1], ['10%', 'calc(50% - 40%)']),
                y: useTransform(howItWorksProgress, [0, 1], ['0%', '-50%']),
              }}
            />

            <motion.div
              className="absolute w-32 h-32 bg-green-400 rounded-lg z-20"
              style={{
                bottom: useTransform(howItWorksProgress, [0, 1], ['10%', '50%']),
                right: useTransform(howItWorksProgress, [0, 1], ['10%', 'calc(50% - 40%)']),
                y: useTransform(howItWorksProgress, [0, 1], ['0%', '50%']),
              }}
            />

            <motion.div
              className="absolute left-1/2 h-1 bg-red-500  transform -translate-x-1/2"
              style={{
                top: '50%',
                width: useTransform(howItWorksProgress, [0, 0.5, 1], ['0%', '0%', '100%']),
              }}
            />

            {/* Background squares with different parallax speeds */}
            <motion.div
              className="absolute w-16 h-16 bg-blue-950 rounded-lg opacity-30"
              style={{
                top: '10%',
                left: '20%',
                y: useTransform(howItWorksProgress, [0, 1], ['0%', '100%']),
              }}
            />
              <motion.div
              className="absolute w-24 h-24 bg-orange-500 rounded-lg opacity-30"
              style={{
                top: '20%',
                left: '0%',
                y: useTransform(howItWorksProgress, [0, 1], ['15%', '-60%']),
              }}
            />
            <motion.div
              className="absolute w-24 h-24 bg-green-400 rounded-lg opacity-30"
              style={{
                top: '80%',
                left: '15%',
                y: useTransform(howItWorksProgress, [0, 1], ['15%', '-60%']),
              }}
            />
              <motion.div
              className="absolute w-20 h-20 bg-green-300 rounded-lg opacity-30"
              style={{
                top: '40%',
                left: '85%',
                y: useTransform(howItWorksProgress, [0, 1], ['15%', '-60%']),
              }}
            />
              <motion.div
              className="absolute w-16 h-16 bg-blue-600 rounded-lg opacity-30"
              style={{
                top: '10%',
                left: '40%',
                y: useTransform(howItWorksProgress, [0, 1], ['15%', '-60%']),
              }}
            />
            <motion.div
              className="absolute w-24 h-24 bg-pink-400 rounded-lg opacity-30"
              style={{
                bottom: '50%',
                right: '25%',
                y: useTransform(howItWorksProgress, [0, 1], ['0%', '-150%']),
              }}
            />
            <motion.div
              className="absolute w-20 h-20 bg-red-200 rounded-lg opacity-30"
              style={{
                top: '30%',
                right: '30%',
                y: useTransform(howItWorksProgress, [0, 1], ['0%', '200%']),
              }}
            />
          </div>
        </div>
      </section>

      {/* Coin Flip Section */}
      <section ref={coinFlipRef} className="relative bg-light dark:bg-dark h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          <motion.h2 
            className="text-6xl font-bold mb-10 text-dark dark:text-light"
            style={{
              opacity: useTransform(coinFlipProgress, [0, 0.1, 0.6, 1], [1, 1, 1, 1]),
            }}
          >
            {useTransform(coinFlipProgress, value => {
              const text = value < 0.9 ? "Then we flip a coin" : "You go first!";
              return text;
            })}
          </motion.h2>

          <motion.div
            className="w-[40vh] h-[40vh] mb-8 "
            style={{
              rotateY: useTransform(coinFlipProgress, [0.5, 1], [0, 360]), // 4 full rotations
            }}
          >
            <Image 
              src={Logo} 
              alt="Coin" 
              width={800} 
              height={800} 
              className="dark:invert"
            />
          </motion.div>
        </div>
      </section>

      {/* User Input Section */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-light dark:bg-dark relative overflow-hidden">
        <h2 className="text-3xl font-bold mb-4 text-dark dark:text-light">
          {isInputDisabled ? "And now you wait for feedback on the other side" : "Write what you need help with"}
        </h2>
        <textarea
          className={`w-11/12 h-1/4 p-6 text-2xl border-[4px] border-dark rounded-[6px] ${
            isInputDisabled ? 'bg-red-100' : 'bg-laccent'
          } dark:bg-daccent dark:border-[4px] dark:border-light dark:border-opacity-5 border-opacity-5 focus:outline-none focus:ring-2 focus:ring-primary placeholder-dark dark:placeholder-light z-10`}
          placeholder="Enter your message here..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          disabled={isInputDisabled}
          style={{ fontSize: '1.5rem' }}
        />
        <motion.button
          className="mt-8 bg-primary text-white text-2xl font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-primarylight transition duration-300 ease-in-out z-10"
          onClick={() => {
            setIsInputDisabled(true);
            // We don't clear the message immediately to allow for a smooth transition
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isInputDisabled ? "Waiting for feedback..." : "I'm done"}
        </motion.button>

        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            backgroundColor: isInputDisabled ? 'rgba(254, 202, 202, 0.5)' : 'rgba(243, 244, 246, 0.5)',
          }}
          transition={{ duration: 0.5 }}
        />
      </section>
    </div>
  );
};

export default LandingPage;
