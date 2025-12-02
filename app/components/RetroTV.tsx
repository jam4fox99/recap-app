"use client";

export default function RetroTV() {
  return (
    <div className="retro-tv-container">
      <div className="retro-tv">
        {/* Antenna */}
        <div className="antenna-container">
          <div className="antenna"></div>
        </div>

        {/* TV Body */}
        <div className="tv-body">
          <div className="tv-inner">
            {/* Screen */}
            <div className="screen-container">
              <div className="screen-crt">
                <div className="screen">
                  <div className="screen-content">
                    <span className="recap-text">ReCap</span>
                  </div>
                  <div className="noise"></div>
                  <div className="scanlines"></div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="side-panel">
              <div className="dial"></div>
              <div className="dial light"></div>
              <div className="speaker">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="speaker-hole"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Base */}
        <div className="tv-base">
          <div className="base-slots">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="slot"></div>
            ))}
          </div>
        </div>

        {/* Feet */}
        <div className="tv-feet">
          <div className="foot"></div>
          <div className="foot"></div>
        </div>
      </div>

      {/* Generating ReCap Text Loader */}
      <div className="loader-wrapper">
        <div className="loader"></div>
        <div className="letter-wrapper">
          <span className="loader-letter">G</span>
          <span className="loader-letter">e</span>
          <span className="loader-letter">n</span>
          <span className="loader-letter">e</span>
          <span className="loader-letter">r</span>
          <span className="loader-letter">a</span>
          <span className="loader-letter">t</span>
          <span className="loader-letter">i</span>
          <span className="loader-letter">n</span>
          <span className="loader-letter">g</span>
          <span className="loader-letter">&nbsp;</span>
          <span className="loader-letter">R</span>
          <span className="loader-letter">e</span>
          <span className="loader-letter">C</span>
          <span className="loader-letter">a</span>
          <span className="loader-letter">p</span>
        </div>
      </div>

      <style jsx>{`
        .retro-tv-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 24px;
        }

        .retro-tv {
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: scale(0.6);
        }

        /* Antenna */
        .antenna-container {
          width: 140px;
          height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .antenna {
          width: 100%;
          height: 3px;
          background: linear-gradient(to top, #333 10%, #666 25% 40%, #333 70%, rgba(34, 34, 34, 0.3) 90%);
          transform-origin: 100% 50%;
          transform: rotate(20deg) translateY(3px);
        }

        .antenna::before {
          content: "";
          display: block;
          width: 6px;
          height: 8px;
          background: linear-gradient(to top, #333 10%, #666 25% 40%, #333 70%);
          border-radius: 24% 53% 53% 24% / 36% 40% 40% 36%;
          transform: translateY(-1px);
        }

        /* TV Body - Black with pulsing cyan glow */
        .tv-body {
          width: 260px;
          height: 180px;
          border-radius: 22px / 28px;
          box-shadow:
            0 0 20px rgba(0, 212, 255, 0.3),
            0 0 40px rgba(0, 212, 255, 0.1),
            2px 2px 5px rgba(0, 0, 0, 0.5),
            2px -2px 2px #222 inset,
            2px 1px 1px #444 inset;
          background: linear-gradient(#1a1a1a, #0a0a0a);
          display: flex;
          justify-content: center;
          align-items: center;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(0, 212, 255, 0.3),
              0 0 40px rgba(0, 212, 255, 0.1),
              2px 2px 5px rgba(0, 0, 0, 0.5),
              2px -2px 2px #222 inset,
              2px 1px 1px #444 inset;
          }
          50% {
            box-shadow:
              0 0 30px rgba(0, 212, 255, 0.5),
              0 0 60px rgba(0, 212, 255, 0.2),
              2px 2px 5px rgba(0, 0, 0, 0.5),
              2px -2px 2px #222 inset,
              2px 1px 1px #444 inset;
          }
        }

        .tv-inner {
          width: 93%;
          height: 88%;
          background: linear-gradient(to bottom, #2a2a2a 5%, #151515 35% 45%);
          border-bottom: 1px solid #333;
          box-shadow: 0 1px 2px #000 inset;
          border-radius: 16px;
          display: grid;
          grid-template-columns: 2.5fr 1fr;
          gap: 4px;
          padding: 8px;
        }

        /* Screen */
        .screen-container {
          border: 1px solid #222;
          box-shadow:
            0 2px 2px #444,
            2px 0 2px #333,
            -2px 0 2px #333,
            0 -2px 2px #111;
          border-radius: 20px / 16px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          background:
            linear-gradient(70deg, #333 15%, transparent 30%),
            repeating-conic-gradient(#1a1a1a 0 30deg, #222 60deg, #1a1a1a 90deg);
        }

        .screen-crt {
          width: 98%;
          height: 94%;
          background: #0a0a0a;
          box-shadow: 0 0 5px 2px #000;
          border-radius: 50px / 60px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .screen {
          background: #0a0a0a;
          width: 94%;
          height: 94%;
          border-radius: 30%;
          box-shadow: 0 0 5px 2px #000 inset;
          overflow: hidden;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .screen-content {
          z-index: 2;
          display: flex;
          align-items: center;
          animation: flicker 3s infinite;
        }

        .recap-text {
          font-family: 'VT323', monospace;
          font-size: 32px;
          font-weight: 400;
          color: #00d4ff;
          text-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px rgba(0, 212, 255, 0.5);
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .noise {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            linear-gradient(to bottom, transparent, rgba(100, 100, 100, 0.03), rgba(80, 80, 80, 0.02), transparent);
          animation: moveBand 8s linear infinite;
          z-index: 3;
          pointer-events: none;
        }

        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            transparent 0 2px,
            rgba(0, 0, 0, 0.15) 2px 4px
          );
          z-index: 4;
          pointer-events: none;
        }

        /* Side Panel */
        .side-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .dial {
          width: 28px;
          height: 28px;
          border: 2px solid #444;
          border-radius: 50%;
          background: #111;
          box-shadow: -2px 2px 4px #000, 0 0 1px 2px #000;
        }

        .dial.light {
          background: #333;
        }

        .speaker {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-top: 8px;
        }

        .speaker-hole {
          width: 6px;
          height: 6px;
          background: radial-gradient(#000, #111);
          border-radius: 50%;
          border-bottom: 1px solid #333;
        }

        /* Base */
        .tv-base {
          width: 210px;
          height: 16px;
          background: linear-gradient(#1a1a1a, #0a0a0a);
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 6px 4px rgba(0, 0, 0, 0.6);
        }

        .base-slots {
          display: flex;
          gap: 4px;
        }

        .slot {
          width: 3px;
          height: 10px;
          background: #000;
          border-radius: 2px;
        }

        /* Feet */
        .tv-feet {
          width: 150px;
          display: flex;
          justify-content: space-between;
        }

        .foot {
          width: 14px;
          height: 6px;
          background: #1a1a1a;
          box-shadow: 4px 0 #0a0a0a;
        }

        .foot:last-child {
          box-shadow: -4px 0 #0a0a0a;
        }

        /* Animations */
        @keyframes moveBand {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; }
          94% { opacity: 1; }
          95% { opacity: 0.9; }
          96% { opacity: 1; }
        }

        /* Searching Loader */
        .loader-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          user-select: none;
          gap: 10px;
        }

        .loader {
          width: 20px;
          height: 20px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background-color: transparent;
          animation: loader-rotate 1.5s linear infinite;
          z-index: 0;
        }

        @keyframes loader-rotate {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 1px 1px 0 #fff inset,
              0 3px 5px 0 #00d4ff inset,
              0 4px 4px 0 #00f0ff inset;
          }
          50% {
            transform: rotate(270deg);
            background: #0a2a3a;
            box-shadow:
              0 1px 1px 0 #fff inset,
              0 3px 5px 0 #ff006e inset,
              0 4px 4px 0 #ff5f9f inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 1px 1px 0 #fff inset,
              0 3px 5px 0 #00d4ff inset,
              0 4px 4px 0 #00f0ff inset;
          }
        }

        .letter-wrapper {
          display: flex;
          gap: 1px;
        }

        .loader-letter {
          display: inline-block;
          opacity: 0.4;
          transform: translateY(0);
          animation: loader-letter-anim 2s infinite;
          z-index: 1;
          border-radius: 50ch;
          border: none;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: #555566;
          letter-spacing: 0.5px;
        }

        .loader-letter:nth-child(1) { animation-delay: 0s; }
        .loader-letter:nth-child(2) { animation-delay: 0.08s; }
        .loader-letter:nth-child(3) { animation-delay: 0.16s; }
        .loader-letter:nth-child(4) { animation-delay: 0.24s; }
        .loader-letter:nth-child(5) { animation-delay: 0.32s; }
        .loader-letter:nth-child(6) { animation-delay: 0.4s; }
        .loader-letter:nth-child(7) { animation-delay: 0.48s; }
        .loader-letter:nth-child(8) { animation-delay: 0.56s; }
        .loader-letter:nth-child(9) { animation-delay: 0.64s; }
        .loader-letter:nth-child(10) { animation-delay: 0.72s; }
        .loader-letter:nth-child(11) { animation-delay: 0.8s; }
        .loader-letter:nth-child(12) { animation-delay: 0.88s; }
        .loader-letter:nth-child(13) { animation-delay: 0.96s; }
        .loader-letter:nth-child(14) { animation-delay: 1.04s; }
        .loader-letter:nth-child(15) { animation-delay: 1.12s; }
        .loader-letter:nth-child(16) { animation-delay: 1.2s; }

        @keyframes loader-letter-anim {
          0%, 100% {
            opacity: 0.4;
            transform: translateY(0);
            color: #555566;
          }
          20% {
            opacity: 1;
            transform: scale(1.15);
            color: #00d4ff;
            text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
          }
          40% {
            opacity: 0.7;
            transform: translateY(0);
            color: #555566;
            text-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
