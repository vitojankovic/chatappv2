import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { LocomotiveScrollProvider } from 'react-locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import Logo from './mentforment.svg';
import { useLocomotiveScroll } from 'react-locomotive-scroll';

const LandingPage = () => {
  const [coinFlipped, setCoinFlipped] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 6000], [0, 360]);

  const containerRef = useRef(null);
  const { scroll } = useLocomotiveScroll();


  const [currentWord, setCurrentWord] = useState('product');
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prevWord => {
        const words = ['product', 'service', 'company', 'idea', 'business'];
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
      });
    }, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const handleScroll = () => {
      const coinSection = document.getElementById('coin-flip');
      const coin = document.querySelector('.rotating-coin');
      if (coinSection && coin) {
        const sectionTop = coinSection.getBoundingClientRect().top;
        const rotation = (sectionTop / window.innerHeight) * 360; // Adjust rotation based on scroll
        coin.style.transform = `rotate(${rotation}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <LocomotiveScrollProvider
        options={{
          smooth: true,
          lerp: 0.1,
          multiplier: 0.5,
          scrollbarContainer: false, // This ensures Locomotive Scroll doesn't add its own scrollbar
        }}
        containerRef={containerRef}
        watch={[]}
      >
        <main data-scroll-container ref={containerRef} className="bg-light dark:bg-dark bg-[url('https://www.transparenttextures.com/patterns/otis-redding.png')]">
          {/* Hero Section */}
          <section data-scroll-section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-14 z-10">
              Get instant feedback on your <br></br><span className="bg-gradient-to-r from-primary to-pink-500 text-transparent bg-clip-text">{currentWord}</span>
            </h1>
            <button className="bg-primary text-white text-2xl font-bold py-4 px-8 rounded-lg z-10">
              Find a Match
            </button>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] min-w-[500px] z-0">
              <path fill="#EAE7E4" d="M18.4,-33.5C23.6,-25.2,27.5,-19.8,30.5,-13.8C33.4,-7.8,35.5,-1.2,41.2,10.7C46.9,22.6,56.3,39.7,51.8,45C47.4,50.3,29.2,43.8,13.7,49.8C-1.8,55.8,-14.5,74.3,-24.7,75.3C-34.8,76.3,-42.4,59.8,-44.6,45.3C-46.8,30.8,-43.6,18.3,-43.9,7.2C-44.1,-4,-47.8,-13.8,-48.7,-26.6C-49.6,-39.4,-47.6,-55.2,-39,-61.9C-30.4,-68.7,-15.2,-66.3,-4.3,-59.5C6.6,-52.8,13.1,-41.7,18.4,-33.5Z" transform="translate(100 100)" />
            </svg>
          </section>

          {/* How It Works Section */}
          <section
            id="how-it-works"
            data-scroll-section
            className="relative bg-gray-50 overflow-hidden"
            style={{ height: '6000px' }} // Increased height to accommodate sticky behavior
          >
            <div
              data-scroll
              data-scroll-sticky
              data-scroll-target="#how-it-works"
              className="sticky top-0 h-screen flex flex-col items-center"
            >
              <h2 className="text-7xl font-bold pt-[15vh] z-10">
                This is how it works
              </h2>

              {/* "You" Rectangle */}
              <div
                className="absolute w-16 h-32 bg-blue-400 rounded-lg z-20 rect1 transition-all duration-500"
                style={{ top: '0', left: '0', transform: 'translate(0, 0)' }}
              />

              {/* "Other User" Rectangle */}
              <div
                className="absolute w-16 h-32 bg-green-400 rounded-lg z-20 rect2 transition-all duration-500"
                style={{ bottom: '0', right: '0', transform: 'translate(0, 0)' }}
              />

              {/* Connection Line */}
              <div
                className="absolute left-1/2 w-0 h-1 bg-red-500 z-10 transform -translate-x-1/2 connection-line"
                style={{ top: '50%' }}
              />

              {/* Geometric background patterns */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-8 h-8 border border-gray-300 opacity-20"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Coin Flip Section */}
          <motion.section
            id="coin-flip"
            data-scroll-section
            className="relative bg-gray-800 overflow-hidden h-[6000px]"
            style={{ rotate }}
             // Increased height to accommodate sticky behavior
          >
            <div
              data-scroll
              data-scroll-sticky
              data-scroll-target="#coin-flip"
              className="sticky top-0 h-screen flex flex-col items-center justify-center"
            >
              <h2 className="text-6xl font-bold mb-10 text-white z-10">
                Then a coin is flipped
              </h2>

              {/* Rotating Coin */}
              <div className="w-40 h-40 mb-8 z-10 rotating-coin">
                <Image src={Logo} alt="Coin" width={160} height={160} />
              </div>

              {coinFlipped && <p className="text-2xl text-white z-10">You start first</p>}
            </div>
          </motion.section>

          {/* User Input Section */}
          <section
            data-scroll-section
            className="h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden"
          >
            <h2 className="text-3xl font-bold mb-4 z-10">
              {isInputDisabled ? "And now you wait for feedback on the other side" : "Now you write your idea"}
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
            <button
              className="mt-8 bg-primary text-white text-2xl font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-primarylight transition duration-300 ease-in-out z-10"
              onClick={() => {
                setIsInputDisabled(true);
                setUserMessage(''); // Clear the textarea after clicking
              }}
            >
              {isInputDisabled ? "And now you wait for feedback on the other side" : "I'm done"}
            </button>

            {/* Parallax background shapes */}
            <div data-scroll data-scroll-speed="1" className="absolute w-full h-full opacity-10">
              {/* Add thin lines, small circles, and triangles here */}
            </div>
          </section>
        </main>
      </LocomotiveScrollProvider>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        ::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        * {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        /* Ensure the body takes up full height */
        html, body {
          height: 100%;
          overflow-y: auto;
        }
      `}</style>
    </>
  );
};

export default LandingPage;
