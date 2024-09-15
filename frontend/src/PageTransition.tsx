import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

const PageTransition = ({ children, disableTransition = false }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) setTransitionStage("fadeOut");
  }, [location, displayLocation]);
  if (disableTransition) {
    return <>{children}</>;
  }

  return (
    <div
      className={`${transitionStage}`}
      onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setTransitionStage("fadeIn");
          setDisplayLocation(location);
        }
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;