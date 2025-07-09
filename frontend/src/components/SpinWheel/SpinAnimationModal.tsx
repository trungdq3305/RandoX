import React, { useEffect, useState } from 'react'

interface SpinAnimationModalProps {
  visible: boolean
  onFinish: () => void
  reward: { rewardName: string; rewardValue: number; rewardType: string } | null
}

const SpinAnimationModal: React.FC<SpinAnimationModalProps> = ({
  visible,
  onFinish,
  reward,
}) => {
  const [showReward, setShowReward] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0) // 0: fast spin, 1: slow down, 2: almost stop, 3: final slow, 4: burst, 5: reveal
  const [spinSpeed, setSpinSpeed] = useState('fast')
  const [suspenseLevel, setSuspenseLevel] = useState(0)

  useEffect(() => {
    if (visible) {
      setShowReward(false)
      setAnimationPhase(0)
      setSpinSpeed('fast')
      setSuspenseLevel(0)

      if (reward) {
        // Phase 0: Fast spinning (2 seconds)
        const fastSpinTimer = setTimeout(() => {
          setAnimationPhase(1)
          setSpinSpeed('medium')
          setSuspenseLevel(1)
        }, 2000)

        // Phase 1: Medium speed (2 seconds)
        const mediumSpinTimer = setTimeout(() => {
          setAnimationPhase(2)
          setSpinSpeed('slow')
          setSuspenseLevel(2)
        }, 4000)

        // Phase 2: Slow down more (2 seconds)
        const slowSpinTimer = setTimeout(() => {
          setAnimationPhase(3)
          setSpinSpeed('very-slow')
          setSuspenseLevel(3)
        }, 6000)

        // Phase 3: Very slow, building suspense (2 seconds)
        const verySlowTimer = setTimeout(() => {
          setAnimationPhase(4)
          setSpinSpeed('stop')
          setSuspenseLevel(4)
        }, 8000)

        // Phase 4: Stop and burst (0.5 seconds)
        const burstTimer = setTimeout(() => {
          setAnimationPhase(5)
        }, 8500)

        // Phase 5: Show reward (1 second after burst)
        const rewardTimer = setTimeout(() => {
          setShowReward(true)
        }, 9500)

        return () => {
          clearTimeout(fastSpinTimer)
          clearTimeout(mediumSpinTimer)
          clearTimeout(slowSpinTimer)
          clearTimeout(verySlowTimer)
          clearTimeout(burstTimer)
          clearTimeout(rewardTimer)
        }
      }
    }
  }, [visible, reward])

  const getSuspenseText = () => {
    switch (suspenseLevel) {
      case 0:
        return '🎰 Drawing... 🎰'
      case 1:
        return '🎯 So exciting! 🎯'
      case 2:
        return '⏳ Almost there... ⏳'
      case 3:
        return '💫 So excited! 💫'
      case 4:
        return '🤞 Wait a minute... 🤞'
      default:
        return '🎊 Great! 🎊'
    }
  }

  if (!visible) return null

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        {!showReward ? (
          <div className='animation-container'>
            {/* Pulsing background based on suspense level */}
            <div
              className={`suspense-background suspense-${suspenseLevel}`}
            ></div>

            {/* Background particles */}
            <div className='particles'>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`particle particle-${i} speed-${spinSpeed}`}
                ></div>
              ))}
            </div>

            {/* Main spinning element */}
            <div
              className={`spin-container speed-${spinSpeed} ${animationPhase >= 4 ? 'burst-phase' : ''}`}
            >
              <div className='outer-ring'></div>
              <div className='middle-ring'></div>
              <div className='inner-circle'>
                <div className='mystery-box'>
                  {suspenseLevel < 3 ? '📦' : suspenseLevel < 4 ? '🎁' : '✨'}
                </div>
              </div>

              {/* Energy rings with varying intensity */}
              <div
                className={`energy-ring ring-1 intensity-${suspenseLevel}`}
              ></div>
              <div
                className={`energy-ring ring-2 intensity-${suspenseLevel}`}
              ></div>
              <div
                className={`energy-ring ring-3 intensity-${suspenseLevel}`}
              ></div>

              {/* Suspense indicator */}
              <div className={`suspense-indicator level-${suspenseLevel}`}>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`indicator-dot ${i <= suspenseLevel ? 'active' : ''}`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Burst effect */}
            {animationPhase >= 4 && (
              <div className='burst-effect'>
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`burst-ray ray-${i}`}></div>
                ))}
              </div>
            )}

            {/* Floating sparkles with suspense-based intensity */}
            <div className='sparkles'>
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className={`sparkle sparkle-${i} intensity-${suspenseLevel}`}
                >
                  {suspenseLevel < 2 ? '⭐' : suspenseLevel < 4 ? '✨' : '💫'}
                </div>
              ))}
            </div>

            {/* Heartbeat effect for high suspense */}
            {suspenseLevel >= 3 && (
              <div className='heartbeat-effect'>
                <div className='heartbeat-pulse'></div>
              </div>
            )}

            <p className={`drawing-text suspense-${suspenseLevel}`}>
              {getSuspenseText()}
            </p>

            {/* Suspense meter */}
            <div className='suspense-meter'>
              <div className='meter-label'>Doki Doki</div>
              <div className='meter-bar'>
                <div className={`meter-fill level-${suspenseLevel}`}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className='reward-result'>
            <div className='reward-animation'>
              <div className='reward-glow'></div>
              <div className='reward-content'>
                <h2 className='reward-title'>🎉 You won! 🎉</h2>
                <div className='reward-item'>
                  <div className='reward-icon'>🏆</div>
                  <div className='reward-details'>
                    <p className='reward-name'>{reward?.rewardName}</p>
                    <p className='reward-value'>
                      {reward?.rewardValue.toLocaleString()} VNĐ
                    </p>
                  </div>
                </div>
                <button className='confirm-button' onClick={onFinish}>
                  Rewarded! 🎊
                </button>
              </div>

              {/* Celebration particles */}
              <div className='celebration-particles'>
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className={`celebration-particle particle-${i % 6}`}
                  >
                    {['🎊', '🎉', '✨', '🌟', '💫', '🏆'][i % 6]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          width: 600px;
          min-height: 500px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .animation-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 600px;
          position: relative;
        }
        
        .suspense-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent);
          animation: suspense-pulse 2s infinite ease-in-out;
        }
        
        .suspense-0 { animation-duration: 0.5s; }
        .suspense-1 { animation-duration: 1s; }
        .suspense-2 { animation-duration: 1.5s; }
        .suspense-3 { animation-duration: 2s; }
        .suspense-4 { animation-duration: 3s; }
        
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          animation: float 3s infinite ease-in-out;
        }
        
        .particle.speed-fast { animation-duration: 0.5s; }
        .particle.speed-medium { animation-duration: 1s; }
        .particle.speed-slow { animation-duration: 2s; }
        .particle.speed-very-slow { animation-duration: 4s; }
        .particle.speed-stop { animation-duration: 6s; }
        
        .spin-container {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        
        .outer-ring {
          position: absolute;
          width: 200px;
          height: 200px;
          border: 3px solid rgba(255, 215, 0, 0.8);
          border-radius: 50%;
          animation: spin-ring 4s linear infinite;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
        }
        
        .middle-ring {
          position: absolute;
          width: 150px;
          height: 150px;
          border: 2px solid rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          animation: spin-ring 3s linear infinite reverse;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
        }
        
        .inner-circle {
          position: absolute;
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: spin-ring 2s linear infinite;
          box-shadow: 0 0 25px rgba(255, 107, 107, 0.7);
        }
        
        .mystery-box {
          font-size: 40px;
          animation: mystery-pulse 1s infinite ease-in-out;
        }
        
        /* Speed variations */
        .speed-fast .outer-ring { animation-duration: 0.5s; }
        .speed-fast .middle-ring { animation-duration: 0.3s; }
        .speed-fast .inner-circle { animation-duration: 0.2s; }
        
        .speed-medium .outer-ring { animation-duration: 1s; }
        .speed-medium .middle-ring { animation-duration: 0.8s; }
        .speed-medium .inner-circle { animation-duration: 0.6s; }
        
        .speed-slow .outer-ring { animation-duration: 2s; }
        .speed-slow .middle-ring { animation-duration: 1.5s; }
        .speed-slow .inner-circle { animation-duration: 1s; }
        
        .speed-very-slow .outer-ring { animation-duration: 4s; }
        .speed-very-slow .middle-ring { animation-duration: 3s; }
        .speed-very-slow .inner-circle { animation-duration: 2s; }
        
        .speed-stop .outer-ring { animation-duration: 8s; }
        .speed-stop .middle-ring { animation-duration: 6s; }
        .speed-stop .inner-circle { animation-duration: 4s; }
        
        .energy-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: energy-pulse 2s infinite ease-in-out;
        }
        
        .ring-1 { width: 250px; height: 250px; animation-delay: 0s; }
        .ring-2 { width: 300px; height: 300px; animation-delay: 0.3s; }
        .ring-3 { width: 350px; height: 350px; animation-delay: 0.6s; }
        
        .energy-ring.intensity-0 { opacity: 0.3; }
        .energy-ring.intensity-1 { opacity: 0.5; }
        .energy-ring.intensity-2 { opacity: 0.7; }
        .energy-ring.intensity-3 { opacity: 0.9; }
        .energy-ring.intensity-4 { opacity: 1; box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
        
        .suspense-indicator {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        
        .indicator-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .indicator-dot.active {
          background: #ffd700;
          box-shadow: 0 0 10px #ffd700;
          animation: dot-pulse 1s infinite ease-in-out;
        }
        
        .heartbeat-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .heartbeat-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          border: 2px solid rgba(255, 0, 0, 0.3);
          border-radius: 50%;
          animation: heartbeat 0.8s infinite ease-in-out;
        }
        
        .burst-effect {
          position: absolute;
          width: 500px;
          height: 500px;
          pointer-events: none;
        }
        
        .burst-ray {
          position: absolute;
          width: 6px;
          height: 80px;
          background: linear-gradient(to top, transparent, #fff, transparent);
          left: 50%;
          top: 50%;
          transform-origin: bottom center;
          animation: burst-explosion 1s ease-out;
        }
        
        .sparkles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .sparkle {
          position: absolute;
          font-size: 16px;
          animation: sparkle-dance 3s infinite ease-in-out;
          opacity: 0;
        }
        
        .sparkle.intensity-0 { animation-duration: 4s; }
        .sparkle.intensity-1 { animation-duration: 3s; }
        .sparkle.intensity-2 { animation-duration: 2s; }
        .sparkle.intensity-3 { animation-duration: 1.5s; }
        .sparkle.intensity-4 { animation-duration: 1s; font-size: 20px; }
        
        .drawing-text {
          margin-top: 40px;
          font-size: 24px;
          color: #fff;
          font-weight: bold;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          animation: text-excitement 2s infinite ease-in-out;
        }
        
        .drawing-text.suspense-0 { animation-duration: 0.5s; }
        .drawing-text.suspense-1 { animation-duration: 1s; }
        .drawing-text.suspense-2 { animation-duration: 1.5s; }
        .drawing-text.suspense-3 { animation-duration: 2s; font-size: 26px; }
        .drawing-text.suspense-4 { animation-duration: 3s; font-size: 28px; color: #ffd700; }
        
        .suspense-meter {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }
        
        .meter-label {
          color: #fff;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .meter-bar {
          width: 200px;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .meter-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ecdc4, #ffd700, #ff6b6b);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        
        .meter-fill.level-0 { width: 10%; }
        .meter-fill.level-1 { width: 30%; }
        .meter-fill.level-2 { width: 50%; }
        .meter-fill.level-3 { width: 75%; }
        .meter-fill.level-4 { width: 100%; animation: meter-flash 0.5s infinite; }
        
        /* Reward section */
        .reward-result {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 600px;
          position: relative;
        }
        
        .reward-animation {
          position: relative;
          animation: reward-grand-entrance 1.5s ease-out;
        }
        
        .reward-glow {
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          animation: victory-glow 2s infinite ease-in-out;
        }
        
        .reward-content {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 2;
          border: 3px solid #ffd700;
        }
        
        .reward-title {
          color: #ff6b6b;
          font-size: 32px;
          margin-bottom: 25px;
          animation: title-celebration 2s infinite ease-in-out;
        }
        
        .reward-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 25px 0;
          background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
          padding: 20px;
          border-radius: 15px;
        }
        
        .reward-icon {
          font-size: 50px;
          animation: trophy-shine 2s infinite ease-in-out;
        }
        
        .reward-details {
          text-align: left;
        }
        
        .reward-name {
          font-size: 22px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        
        .reward-value {
          font-size: 24px;
          color: #ff6b6b;
          font-weight: bold;
          margin: 8px 0 0 0;
        }
        
        .confirm-button {
          background: linear-gradient(135deg, #ff6b6b, #ffd700);
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: bold;
          font-size: 18px;
          margin-top: 25px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          animation: button-glow 2s infinite ease-in-out;
        }
        
        .confirm-button:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }
        
        .celebration-particles {
          position: absolute;
          width: 500px;
          height: 500px;
          pointer-events: none;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .celebration-particle {
          position: absolute;
          font-size: 24px;
          animation: celebration-explosion 4s infinite ease-out;
        }
        
        /* Animations */
        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes mystery-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes energy-pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        @keyframes heartbeat {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
        }
        
        @keyframes suspense-pulse {
          0%, 100% { background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05), transparent); }
          50% { background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent); }
        }
        
        @keyframes burst-explosion {
          0% { 
            transform: translateX(-50%) rotate(var(--rotation, 0deg)) scaleY(0);
            opacity: 0;
          }
          30% { 
            transform: translateX(-50%) rotate(var(--rotation, 0deg)) scaleY(1.2);
            opacity: 1;
          }
          100% { 
            transform: translateX(-50%) rotate(var(--rotation, 0deg)) scaleY(0);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        @keyframes sparkle-dance {
          0% { opacity: 0; transform: translateY(30px) rotate(0deg) scale(0.5); }
          25% { opacity: 1; transform: translateY(0px) rotate(90deg) scale(1); }
          75% { opacity: 1; transform: translateY(-10px) rotate(270deg) scale(1.2); }
          100% { opacity: 0; transform: translateY(-40px) rotate(360deg) scale(0.5); }
        }
        
        @keyframes text-excitement {
          0%, 100% { transform: scale(1); text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); }
          50% { transform: scale(1.05); text-shadow: 0 2px 20px rgba(255, 255, 255, 0.8); }
        }
        
        @keyframes meter-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes reward-grand-entrance {
          0% { 
            opacity: 0; 
            transform: scale(0.3) translateY(100px) rotate(10deg); 
          }
          70% { 
            opacity: 1; 
            transform: scale(1.1) translateY(-10px) rotate(-2deg); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0) rotate(0deg); 
          }
        }
        
        @keyframes victory-glow {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 0.4; 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.3); 
            opacity: 0.7; 
          }
        }
        
        @keyframes title-celebration {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(1deg); }
          75% { transform: translateY(-3px) rotate(-1deg); }
        }
        
        @keyframes trophy-shine {
          0%, 100% { transform: rotate(0deg) scale(1); filter: brightness(1); }
          25% { transform: rotate(5deg) scale(1.1); filter: brightness(1.2); }
          75% { transform: rotate(-5deg) scale(1.1); filter: brightness(1.2); }
        }
        
        @keyframes button-glow {
          0%, 100% { box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); }
          50% { box-shadow: 0 8px 30px rgba(255, 215, 0, 0.5); }
        }
        
        @keyframes celebration-explosion {
          0% { 
            opacity: 0; 
            transform: translateY(0) rotate(0deg) scale(0.5); 
          }
          15% { 
            opacity: 1; 
            transform: translateY(-20px) rotate(180deg) scale(1); 
          }
          85% { 
            opacity: 1; 
            transform: translateY(-120px) rotate(540deg) scale(1.2); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-200px) rotate(720deg) scale(0.5); 
          }
        }
        
        /* Positioning */
        ${[...Array(20)]
          .map(
            (_, i) => `
          .particle-${i} {
            left: ${15 + ((i * 3.5) % 70)}%;
            top: ${15 + ((i * 4.2) % 70)}%;
            animation-delay: ${i * 0.1}s;
          }
        `
          )
          .join('')}
        
        ${[...Array(16)]
          .map(
            (_, i) => `
          .ray-${i} {
            --rotation: ${i * 22.5}deg;
            transform: translateX(-50%) rotate(${i * 22.5}deg);
            animation-delay: ${i * 0.05}s;
          }
        `
          )
          .join('')}
        
        ${[...Array(15)]
          .map(
            (_, i) => `
          .sparkle-${i} {
            left: ${5 + ((i * 6) % 90)}%;
            top: ${5 + ((i * 7) % 90)}%;
            animation-delay: ${i * 0.15}s;
          }
        `
          )
          .join('')}
        
        ${[...Array(30)]
          .map(
            (_, i) => `
          .celebration-particle:nth-child(${i + 1}) {
            left: ${10 + ((i * 2.7) % 80)}%;
            top: ${10 + ((i * 3.1) % 80)}%;
            animation-delay: ${i * 0.1}s;
          }
        `
          )
          .join('')}
      `}</style>
    </div>
  )
}

// Demo component to test the modal

export default SpinAnimationModal
