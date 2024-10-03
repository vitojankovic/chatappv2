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

  const [isInputFilled, setIsInputFilled] = useState()


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

  return (
    <div className="bg-light dark:bg-dark bg-[url('https://www.transparenttextures.com/patterns/otis-redding.png')]">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/otis-redding.png')]">
        <h1 className="sm:text-2xl text-4xl md:text-6xl font-bold text-center mb-14 z-10 px-4">
          Get instant feedback on your <br /><span className="bg-gradient-to-r from-primary to-pink-500 text-transparent bg-clip-text sm:text-3xl md:text-7xl text-6xl">{currentWord}</span>
        </h1>
        <motion.button
          className="bg-primary text-white text-2xl font-bold py-4 px-8 rounded-lg z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Find a Match
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

        <h1 className="text-daccent dark:text-laccent text-2xl font-bold z-10 absolute bottom-[15vh]">This is how it works</h1>
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
      <section ref={coinFlipRef} className="relative bg-light dark:bg-dark h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          <motion.h2 
            className="text-6xl font-bold mb-10 text-dark dark:text-light"
            style={{
              opacity: useTransform(coinFlipProgress, [0, 0.1, 0.6, 1], [1, 1, 1, 1]),
            }}
          >
          {useTransform(coinFlipProgress, [0, 0.9, 1], ["Then we flip a coin", "Then we flip a coin", "You go first!"])}
          </motion.h2>

          <motion.div
            className="w-[40vh] h-[40vh] mb-8 "
            style={{
              rotateX: useTransform(coinFlipProgress, [0.5, 1], [0, 360]), // 4 full rotations
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
      <section className="h-[100vh] flex flex-col items-center justify-center bg-light dark:bg-dark relative overflow-hidden">
        <h2 className="text-3xl font-bold mb-4 text-dark dark:text-light">
          {isInputDisabled ? "And now you wait for feedback on the other side" : "Write what you need help with"}
        </h2>
        <textarea
          className={`w-11/12 h-1/4 p-6 text-2xl border-[4px] border-dark rounded-[6px] ${
            isInputDisabled ? 'bg-red-100' : 'bg-laccent'
          } dark:bg-daccent dark:border-[4px] dark:border-light dark:border-opacity-5 border-opacity-5 focus:outline-none focus:ring-2 focus:ring-primary placeholder-dark dark:placeholder-light z-10`}
          placeholder="Enter your message here..."
          value={userMessage}
          disabled={isInputDisabled}
          style={{ fontSize: '1.5rem' }}
          onChange={(e) => {
            setUserMessage(e.target.value);
          }}
        />
        <motion.button
          className="mt-8 bg-primary text-white text-2xl font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-primarylight transition duration-300 ease-in-out z-10"
          onClick={() => {
            setIsInputDisabled(true);
            // We don't clear the message immediately to allow for a smooth transition
            scrollDown()
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

      <section className="min-h-screen bg-light dark:bg-dark relative overflow-hidden flex justify-center">
          <h1 className="text-6xl pt-[100px]">Now you are ready to <span className="bg-gradient-to-r from-primary to-pink-500 text-transparent bg-clip-text">play</span></h1>
          <motion.button
          className="bg-primary text-white text-2xl font-bold py-4 px-8 rounded-lg z-10 h-[10px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Find a Match
        </motion.button>
      </section>

      

<footer className="bg-white dark:bg-gray-900">
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
        <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                    <a href="#" className=" hover:underline">About</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Careers</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Brand Center</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Blog</a>
                </li>
            </ul>
        </div>
        <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Help center</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                    <a href="#" className="hover:underline">Discord Server</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Twitter</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Facebook</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Contact Us</a>
                </li>
            </ul>
        </div>
        <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Licensing</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                </li>
            </ul>
        </div>
        <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Download</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                    <a href="#" className="hover:underline">iOS</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Android</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">Windows</a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:underline">MacOS</a>
                </li>
            </ul>
        </div>
    </div>
    <div className="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">© 2024 <a href="https://flowbite.com/">ChatAPP™</a>. All Rights Reserved.
        </span>
        <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                        <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                    </svg>
                  <span className="sr-only">Facebook page</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                        <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                    </svg>
                  <span className="sr-only">Discord community</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
                </svg>
                  <span className="sr-only">Twitter page</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                  </svg>
                  <span className="sr-only">GitHub account</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clip-rule="evenodd"/>
                </svg>
                  <span className="sr-only">Dribbble account</span>
              </a>
        </div>
      </div>
    </div>
</footer>

    </div>
  );
};

export default LandingPage;