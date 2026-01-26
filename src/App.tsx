import { useRef, type RefObject } from 'react';
import ThreeBackground from './components/ThreeBackground';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Connect from './components/Connect';
import './App.css';

function App() {
  const portfolioRef = useRef<HTMLDivElement | null>(null);
  const connectRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleMyWorkClick = () => {
    scrollToSection(portfolioRef);
  };

  const handleConnectClick = () => {
    scrollToSection(connectRef);
  };

  return (
    <div className="app">
      <div className="hero-section">
        <ThreeBackground />
        <Hero 
          onMyWorkClick={handleMyWorkClick}
          onConnectClick={handleConnectClick}
        />
      </div>
      
      <div ref={portfolioRef}>
        <Portfolio />
      </div>
      
      <div ref={connectRef}>
        <Connect />
      </div>
    </div>
  );
}

export default App; 