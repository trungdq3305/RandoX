import React, { useEffect, useState } from 'react';

interface SpinAnimationModalProps {
  visible: boolean;
  onFinish: () => void;
  reward: { rewardName: string; rewardValue: number; rewardType: string } | null;
}

const SpinAnimationModal: React.FC<SpinAnimationModalProps> = ({ visible, onFinish, reward }) => {
  const [showReward, setShowReward] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0); // 0: spinning, 1: burst, 2: reveal

  useEffect(() => {
    if (visible) {
      setShowReward(false);
      setAnimationPhase(0);
      
      // If reward exists, show spinning animation
      if (reward) {
        // Phase 1: Spinning animation (8 seconds)
        const spinTimer = setTimeout(() => {
          setAnimationPhase(1);
        }, 8000);
        
        // Phase 2: Burst effect (1 second)
        const burstTimer = setTimeout(() => {
          setAnimationPhase(2);
        }, 9000);
        
        // Phase 3: Show reward (0.5 seconds after burst)
        const rewardTimer = setTimeout(() => {
          setShowReward(true);
        }, 9500);
        
        return () => {
          clearTimeout(spinTimer);
          clearTimeout(burstTimer);
          clearTimeout(rewardTimer);
        };
      }
    }
  }, [visible, reward]);

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!showReward && !reward ? (
          <div className="animation-container">
            {/* Background particles */}
            <div className="particles">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`particle particle-${i}`}></div>
              ))}
            </div>
            
            {/* Main spinning element */}
            <div className={`spin-container ${animationPhase === 1 ? 'burst-phase' : ''}`}>
              <div className="outer-ring"></div>
              <div className="middle-ring"></div>
              <div className="inner-circle">
                <div className="mystery-box">📦</div>
              </div>
              
              {/* Energy rings */}
              <div className="energy-ring ring-1"></div>
              <div className="energy-ring ring-2"></div>
              <div className="energy-ring ring-3"></div>
            </div>
            
            {/* Burst effect */}
            {animationPhase >= 1 && (
              <div className="burst-effect">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`burst-ray ray-${i}`}></div>
                ))}
              </div>
            )}
            
            {/* Floating sparkles */}
            <div className="sparkles">
              {[...Array(15)].map((_, i) => (
                <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
              ))}
            </div>
            
            <p className="drawing-text">
              {animationPhase === 0 && "🎉 Đang mở blindbox... 🎉"}
              {animationPhase === 1 && "✨ Wow! ✨"}
              {animationPhase === 2 && "🎊 Tuyệt vời! 🎊"}
            </p>
          </div>
        ) : !showReward && reward ? (
          <div className="animation-container">
            {/* Background particles */}
            <div className="particles">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`particle particle-${i}`}></div>
              ))}
            </div>
            
            {/* Main spinning element */}
            <div className={`spin-container ${animationPhase === 1 ? 'burst-phase' : ''}`}>
              <div className="outer-ring"></div>
              <div className="middle-ring"></div>
              <div className="inner-circle">
                <div className="mystery-box">📦</div>
              </div>
              
              {/* Energy rings */}
              <div className="energy-ring ring-1"></div>
              <div className="energy-ring ring-2"></div>
              <div className="energy-ring ring-3"></div>
            </div>
            
            {/* Burst effect */}
            {animationPhase >= 1 && (
              <div className="burst-effect">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`burst-ray ray-${i}`}></div>
                ))}
              </div>
            )}
            
            {/* Floating sparkles */}
            <div className="sparkles">
              {[...Array(15)].map((_, i) => (
                <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
              ))}
            </div>
            
            <p className="drawing-text">
              {animationPhase === 0 && "🎉 Đang mở blindbox... 🎉"}
              {animationPhase === 1 && "✨ Wow! ✨"}
              {animationPhase === 2 && "🎊 Tuyệt vời! 🎊"}
            </p>
          </div>
        ) : showReward && reward ? (
          <div className="reward-result">
            <div className="reward-animation">
              <div className="reward-glow"></div>
              <div className="reward-content">
                <h2 className="reward-title">🎉 Bạn nhận được! 🎉</h2>
                <div className="reward-item">
                  <div className="reward-icon">🎁</div>
                  <div className="reward-details">
                    <p className="reward-name">{reward.rewardName}</p>
                    <p className="reward-value">{reward.rewardValue.toLocaleString()} VNĐ</p>
                  </div>
                </div>
                <button className="confirm-button" onClick={onFinish}>
                  Tuyệt vời! 🎊
                </button>
              </div>
              
              {/* Celebration particles */}
              <div className="celebration-particles">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`celebration-particle particle-${i % 5}`}>
                    {['🎊', '🎉', '✨', '🌟', '💫'][i % 5]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          width: 600px;
          min-height: 400px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .animation-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 800px;
          position: relative;
        }
        
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
        
        .particle:nth-child(odd) {
          background: #ffd700;
        }
        
        .spin-container {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .outer-ring {
          position: absolute;
          width: 200px;
          height: 200px;
          border: 3px solid rgba(255, 215, 0, 0.6);
          border-radius: 50%;
          animation: spin-slow 8s linear infinite;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        }
        
        .middle-ring {
          position: absolute;
          width: 150px;
          height: 150px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: spin-medium 6s linear infinite reverse;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
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
          animation: spin-fast 4s linear infinite;
          box-shadow: 0 0 25px rgba(255, 107, 107, 0.6);
        }
        
        .mystery-box {
          font-size: 40px;
          animation: pulse 2s infinite;
        }
        
        .energy-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: energy-pulse 2s infinite ease-in-out;
        }
        
        .ring-1 {
          width: 250px;
          height: 250px;
          animation-delay: 0s;
        }
        
        .ring-2 {
          width: 300px;
          height: 300px;
          animation-delay: 0.5s;
        }
        
        .ring-3 {
          width: 350px;
          height: 350px;
          animation-delay: 1s;
        }
        
        .burst-effect {
          position: absolute;
          width: 400px;
          height: 400px;
          pointer-events: none;
        }
        
        .burst-ray {
          position: absolute;
          width: 4px;
          height: 60px;
          background: linear-gradient(to top, transparent, #fff, transparent);
          left: 50%;
          top: 50%;
          transform-origin: bottom center;
          animation: burst-rays 1s ease-out;
        }
        
        .sparkles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .sparkle {
          position: absolute;
          font-size: 20px;
          animation: sparkle-float 4s infinite ease-in-out;
          opacity: 0;
        }
        
        .drawing-text {
          margin-top: 40px;
          font-size: 24px;
          color: #fff;
          font-weight: bold;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          animation: text-glow 2s infinite ease-in-out;
        }
        
        .reward-result {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 800px;
          position: relative;
        }
        
        .reward-animation {
          position: relative;
          animation: reward-entrance 1s ease-out;
        }
        
        .reward-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          animation: glow-pulse 2s infinite ease-in-out;
        }
        
        .reward-content {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 2;
        }
        
        .reward-title {
          color: #52c41a;
          font-size: 28px;
          margin-bottom: 20px;
          animation: title-bounce 1s ease-out;
        }
        
        .reward-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 20px 0;
        }
        
        .reward-icon {
          font-size: 40px;
          animation: icon-spin 2s infinite ease-in-out;
        }
        
        .reward-details {
          text-align: left;
        }
        
        .reward-name {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        
        .reward-value {
          font-size: 18px;
          color: #1677ff;
          font-weight: bold;
          margin: 5px 0 0 0;
        }
        
        .confirm-button {
          background: linear-gradient(135deg, #1677ff, #52c41a);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          margin-top: 20px;
          transition: transform 0.2s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .confirm-button:hover {
          transform: scale(1.05);
        }
        
        .celebration-particles {
          position: absolute;
          width: 400px;
          height: 400px;
          pointer-events: none;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .celebration-particle {
          position: absolute;
          font-size: 20px;
          animation: celebration-float 3s infinite ease-out;
        }
        
        /* Animations */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes energy-pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        @keyframes burst-rays {
          0% { 
            transform: translateX(-50%) rotate(var(--rotation, 0deg)) scaleY(0);
            opacity: 0;
          }
          50% { 
            transform: translateX(-50%) rotate(var(--rotation, 0deg)) scaleY(1);
            opacity: 1;
          }
          100% { 
            transform: translateX(-50%) rotate(var(--rotation, 0deg)) scaleY(0);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes sparkle-float {
          0% { opacity: 0; transform: translateY(20px) rotate(0deg); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-20px) rotate(360deg); }
        }
        
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); }
          50% { text-shadow: 0 2px 20px rgba(255, 255, 255, 0.8); }
        }
        
        @keyframes reward-entrance {
          0% { 
            opacity: 0; 
            transform: scale(0.5) translateY(50px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }
        
        @keyframes title-bounce {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes icon-spin {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        
        @keyframes celebration-float {
          0% { 
            opacity: 0; 
            transform: translateY(0) rotate(0deg); 
          }
          20% { 
            opacity: 1; 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-100px) rotate(360deg); 
          }
        }
        
        /* Positioning for particles and effects */
        ${[...Array(20)].map((_, i) => `
          .particle-${i} {
            left: ${20 + (i * 3) % 60}%;
            top: ${20 + (i * 4) % 60}%;
            animation-delay: ${i * 0.1}s;
          }
        `).join('')}
        
        ${[...Array(12)].map((_, i) => `
          .ray-${i} {
            --rotation: ${i * 30}deg;
            transform: translateX(-50%) rotate(${i * 30}deg);
          }
        `).join('')}
        
        ${[...Array(15)].map((_, i) => `
          .sparkle-${i} {
            left: ${10 + (i * 5) % 80}%;
            top: ${10 + (i * 7) % 80}%;
            animation-delay: ${i * 0.2}s;
          }
        `).join('')}
        
        ${[...Array(25)].map((_, i) => `
          .celebration-particle:nth-child(${i + 1}) {
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${i * 0.05}s;
          }
        `).join('')}
      `}</style>
    </div>
  );
};

// Demo component


export default SpinAnimationModal;