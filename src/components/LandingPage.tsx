import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Logo from './mentforment (2).svg';



const LandingPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [currentWord, setCurrentWord] = useState('product');

  const { scrollYProgress } = useScroll();


  const howItWorksRef = useRef(null);
  const coinFlipRef = useRef(null);

  // Parallax effect for background shapes
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 300]);

  const scrollDown = () => {
    setTimeout(() => {
      window.scrollTo({ top: 100 * window.innerHeight, behavior: 'smooth' });
    }, 250)
  }

  


  const ScrollIndicator = () => {
    return (
        <div className="flex flex-col items-center absolute h-200 bottom-20 pb-10">
          <motion.svg   
          initial={{ opacity: 0, y: '-10' }}
          animate={{ opacity: [0, 1, 0], y: 0 }}
          transition={{ duration: 3, repeat: Infinity }} 
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 absolute">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path 
              d="M11.9997 13.1716L7.04996 8.22186L5.63574 9.63607L11.9997 16L18.3637 9.63607L16.9495 8.22186L11.9997 13.1716Z"
              className="dark:fill-laccent fill-daccent border-red"
            ></path>
          </motion.svg>
          <motion.svg        
          initial={{ opacity: 0, y: '-10' }}
          animate={{ opacity: [1, 0, 1], y: 0 }}
          transition={{ duration: 3, repeat: Infinity }} 
         viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 absolute mt-5           dark:fill-laccent fill-daccent border-red">
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
      setCurrentWord(() => {
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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };
  
  
  const slideVariants = {
    hidden: { y: 500, opacity: 0 },
    visible: { y: 50, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <div className="bg-light dark:bg-dark">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden ">
        <motion.h1 className="sm:text-2xl text-4xl md:text-6xl font-bold text-center mb-14 z-10 px-4" variants={textVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          Get instant feedback on your <br /><motion.span className="bg-gradient-to-r from-primary to-pink-500 text-transparent bg-clip-text sm:text-3xl md:text-7xl text-6xl"
          key={currentWord} // Change key to trigger exit/enter animation
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.5 }} // Adjust duration for timing
          >{currentWord}</motion.span>
        </motion.h1>
        <motion.button className="before:ease relative h-16 w-50 overflow-hidden border border-primary bg-primary text-white text-2xl font-bold py-4 px-8 shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-16 before:w-6 before:translate-x-16 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-primary hover:before:-translate-x-40 z-20 rounded-[6px]">
      <span className="relative z-20">Find a Match</span>
    </motion.button>

        {/* Fixed blob */}
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="sm:w-[2000px] sm:h-[2000px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-[100vw] md:h-[100vh] min-w-[500px] z-0 dark:fill-daccent fill-laccent">
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feFlood floodColor="rgba(0, 0, 0, 0.2)" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
          <path d="M18.4,-33.5C23.6,-25.2,27.5,-19.8,30.5,-13.8C33.4,-7.8,35.5,-1.2,41.2,10.7C46.9,22.6,56.3,39.7,51.8,45C47.4,50.3,29.2,43.8,13.7,49.8C-1.8,55.8,-14.5,74.3,-24.7,75.3C-34.8,76.3,-42.4,59.8,-44.6,45.3C-46.8,30.8,-43.6,18.3,-43.9,7.2C-44.1,-4,-47.8,-13.8,-48.7,-26.6C-49.6,-39.4,-47.6,-55.2,-39,-61.9C-30.4,-68.7,-15.2,-66.3,-4.3,-59.5C6.6,-52.8,13.1,-41.7,18.4,-33.5Z" transform="translate(100 100)" filter="url(#shadow)"/>
          <defs>

    </defs>
        </svg>

        {/* Parallax background shapes */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: yBg }}
        >
          {/* Add thin lines, small circles, and triangles here for parallax effect */}
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary opacity-20 transform rotate-45"></div>
          <div className="absolute top-1/2 left-3/4 w-32 h-1 bg-tertiary opacity-20 transform -rotate-45"></div>
        </motion.div>

        <motion.h1 className="text-daccent dark:text-laccent text-2xl font-bold z-10 absolute bottom-[15vh]"
        variants={textVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>This is how it works</motion.h1>
        <ScrollIndicator />
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="relative bg-laccent dark:bg-daccent h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col  overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
          <motion.h2 
            className="md:text-7xl font-bold text-center mt-[12vh] text-4xl"
          >
          {useTransform(howItWorksProgress, [0, 0.33, 0.66, 1], [
            "We go over current players",
            "We go over current players",
            "We find the best match for you",
            "We connect you"
          ])}
          </motion.h2>

          <div className="relative h-[60vh] w-full max-w-4xl ml-auto mr-auto mt-auto mb-auto">
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
      <section 
  ref={coinFlipRef} 
  className="relative bg-laccent dark:bg-daccent h-[300vh] bg-gradient-to-b from-laccent to-daccent"
>
  <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-opacity-50">
    
    {/* Heading with shadow */}
    <motion.h2 
      className="text-6xl font-bold mb-10 text-dark dark:text-light drop-shadow-lg"
      style={{
        opacity: useTransform(coinFlipProgress, [0, 0.1, 0.6, 1], [1, 1, 1, 1]),
      }}
    >
      {useTransform(coinFlipProgress, [0, 0.9, 1], ["Then we flip a coin", "Then we flip a coin", "You go first!"])}
    </motion.h2>

    {/* Coin with shadow and smoother animation */}
    <motion.div
      className="w-[40vh] h-[40vh] mb-8 shadow-xl rounded-full transition-transform ease-out duration-700"
      style={{
        rotate: useTransform(coinFlipProgress, [0.5, 1], [0, 1440]), // 4 full rotations
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
      <section className="h-[100vh] flex flex-col items-center justify-center bg-laccent dark:bg-daccent relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
        <motion.h2 className="text-3xl font-bold mb-4 text-dark dark:text-light" 
        variants={textVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {isInputDisabled ? "And now you wait for feedback on the other side" : "Write what you need help with"}
        </motion.h2>
        <motion.textarea
          className={`w-11/12 h-1/4 p-6 text-2xl border-[4px] border-dark rounded-[6px] ${
            isInputDisabled ? 'bg-red-100' : 'bg-laccent'
          } dark:bg-daccent dark:border-[4px] dark:border-light dark:border-opacity-5 border-opacity-5 focus:outline-none focus:ring-2 focus:ring-primary placeholder-dark dark:placeholder-light z-10`}
          placeholder="Enter your message here..."
          value={userMessage}
          disabled={isInputDisabled}
          variants={inputVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ fontSize: '1.5rem' }}
          onChange={(e) => {
            setUserMessage(e.target.value);
          }}
        />
        <motion.button
          data-modal-target="default-modal" data-modal-toggle="default-modal"
          className="mt-8 bg-primary text-white text-2xl font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-primarylight transition duration-300 ease-in-out z-10"
          variants={buttonVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          onClick={() => {
            setIsInputDisabled(true);

          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isInputDisabled ? "Waiting for feedback..." : "I'm done"}
        </motion.button>

        

        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            backgroundColor: isInputDisabled ? 'rgba(254, 202, 202, 0.5)' : '',
          }}
          transition={{ duration: 0.5 }}
        />
      </section>

      <motion.div id="default-modal" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <h1 className="text-9xl">Hey guys</h1>
      </motion.div>

      

    <footer className="bg-laccent dark:bg-daccent shadow-lg">
  <div className="mx-auto w-full max-w-screen-xl">
    <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
      <div>
        <h2 className="mb-6 text-sm font-semibold text-primary uppercase dark:text-primarylight">Company</h2>
        <ul className="text-gray-500 dark:text-gray-400 font-medium">
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">About</a>
          </li>
          <li className="mb-4">
            <a href="/contributors" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Contributors</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Brand Center</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Blog</a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="mb-6 text-sm font-semibold text-primary uppercase dark:text-primarylight">Help center</h2>
        <ul className="text-gray-500 dark:text-gray-400 font-medium">
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Discord Server</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Twitter</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Facebook</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Contact Us</a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="mb-6 text-sm font-semibold text-primary uppercase dark:text-primarylight">Legal</h2>
        <ul className="text-gray-500 dark:text-gray-400 font-medium">
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Privacy Policy</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Licensing</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Terms &amp; Conditions</a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="mb-6 text-sm font-semibold text-primary uppercase dark:text-primarylight">Download</h2>
        <ul className="text-gray-500 dark:text-gray-400 font-medium">
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">iOS</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Android</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">Windows</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:underline hover:text-primarylight dark:hover:text-laccent">MacOS</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="px-4 py-6 bg-laccent dark:bg-daccent md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
        © 2024 <a href="https://flowbite.com/" className="hover:underline text-dark dark:text-light hover:text-primarylight">ChatAPP™</a>. All Rights Reserved.
      </span>
      <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
        <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-primarylight">
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
            <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
          </svg>
          <span className="sr-only">Facebook page</span>
        </a>
        <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-primarylight">
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
            <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
          </svg>
          <span className="sr-only">Discord community</span>
        </a>
        <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-primarylight">
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
            <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.034 4.71 11.67 11.67 0 0 1-8.482-4.267 4.045 4.045 0 0 0-.546 2.033c0 1.57.798 2.934 2.005 3.745a4.035 4.035 0 0 1-1.828-.502v.05c0 2.035 1.436 3.74 3.349 4.131-.352.094-.725.146-1.106.146-.27 0-.532-.026-.788-.075a4.04 4.04 0 0 0 3.759 2.793A8.157 8.157 0 0 1 0 14.42a11.466 11.466 0 0 0 6.29 1.84c7.547 0 11.655-6.256 11.655-11.653 0-.177 0-.354-.013-.53A8.372 8.372 0 0 0 20 1.892Z" clipRule="evenodd"/>
          </svg>
          <span className="sr-only">Twitter page</span>
        </a>
      </div>
    </div>
  </div>
</footer>


    </div>
  );
};

export default LandingPage;