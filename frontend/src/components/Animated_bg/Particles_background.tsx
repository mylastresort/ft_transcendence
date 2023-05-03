import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import ParticlesConfig from "./config/particles-config";
import { loadFull } from "tsparticles";

function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  return (
    <div
  
    >
      <Particles
        id="tsparticles"
        particlesLoaded="particlesLoaded"
        init={particlesInit}
        loaded={particlesLoaded}
        options={ParticlesConfig}
        height="100%"
        width="100%"
      ></Particles>
    </div>
  );
}

export default ParticlesBackground;
