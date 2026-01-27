import './Hero.css';

type HeroProps = {
  onMyWorkClick: () => void;
  onConnectClick: () => void;
};

const Hero = ({ onMyWorkClick, onConnectClick }: HeroProps) => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Ryan Reede</h1>
        <img src="/images/ryan-prof.jpg" alt="Ryan" className="hero-image" />
        <p className="tagline">
          Engineer/founder with 10 years of experience building + scaling 3D software 
          products. I love working with new tools to bring previously unimaginable ideas to life.
        </p>
        <div className="button-container">
          <button className="cta-button" onClick={onMyWorkClick}>My Work</button>
          <button className="cta-button" onClick={onConnectClick}>Connect</button>
        </div>
      </div>
      
      <div className="film-filter">
        <div className="noise"></div>
      </div>
    </div>
  );
};

export default Hero; 