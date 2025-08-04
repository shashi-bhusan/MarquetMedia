'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingSequenceProps {
  onComplete: () => void;
  videoReady: boolean;
}

export const LoadingSequence = ({ onComplete, videoReady }: LoadingSequenceProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const steps = [
    'Initializing Creative Assets',
    'Loading High-Quality Media',
    'Optimizing User Experience',
    'Preparing Visual Elements',
    'Ready to Inspire'
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let currentStepIndex = 0;
    const totalSteps = steps.length;
    const stepDuration = 700; // ms per step
    
    // Initial animation setup
    gsap.set([logoRef.current, taglineRef.current, progressRef.current, dotsRef.current], {
      opacity: 0,
      y: 30,
      scale: 0.95
    });

    const tl = gsap.timeline();

    // Animate elements in sequence
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(taglineRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4")
    .to([progressRef.current, dotsRef.current], {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.1
    }, "-=0.2");

    // Step progression with smooth animations
    const progressStep = () => {
      if (currentStepIndex < totalSteps) {
        setCurrentStep(currentStepIndex);
        
        // Animate progress fill
        const progressFill = progressRef.current?.querySelector('.progress-fill');
        if (progressFill) {
          gsap.to(progressFill, {
            width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
            duration: stepDuration / 1000,
            ease: "power2.out"
          });
        }

        currentStepIndex++;
        
        if (currentStepIndex < totalSteps) {
          setTimeout(progressStep, stepDuration);
        } else {
          // All steps complete - check if video is ready
          checkForCompletion();
        }
      }
    };

    const checkForCompletion = () => {
      const checkInterval = setInterval(() => {
        if (videoReady || Date.now() - startTime > 4000) { // Max 4s wait
          clearInterval(checkInterval);
          completeLoading();
        }
      }, 100);
    };

    const completeLoading = () => {
      // Final progress fill
      const progressFill = progressRef.current?.querySelector('.progress-fill');
      if (progressFill) {
        gsap.to(progressFill, {
          width: '100%',
          duration: 0.3,
          ease: "power2.out"
        });
      }

      // Exit animation
      setTimeout(() => {
        gsap.to(container, {
          opacity: 0,
          scale: 0.95,
          y: -20,
          duration: 0.8,
          ease: "power3.in",
          onComplete: () => {
            setIsVisible(false);
            onComplete();
          }
        });
      }, 300);
    };

    const startTime = Date.now();
    
    // Start the loading sequence after initial animations
    setTimeout(progressStep, 800);

    return () => {
      tl.kill();
    };
  }, [videoReady, onComplete, steps.length]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black"
      style={{ 
        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Logo Animation */}
      <div ref={logoRef} className="mb-8">
        <div className="relative">
          <h1 className="text-4xl md:text-6xl font-light text-black dark:text-white tracking-tight">
            MARQUET
          </h1>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-black/20 to-transparent dark:from-white/20"></div>
        </div>
      </div>

      {/* Tagline */}
      <div ref={taglineRef} className="mb-12 text-center max-w-md">
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-light tracking-wide">
          Elevate Your Brand. Quietly Powerful. Creatively Bold.
        </p>
      </div>

      {/* Progress Section */}
      <div ref={progressRef} className="w-80 max-w-sm">
        {/* Progress Bar */}
        <div className="relative mb-4">
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="progress-fill h-full bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-300 dark:to-gray-500 rounded-full transition-all duration-800 ease-out"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="text-center">
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            {steps[currentStep] || 'Loading...'}
          </p>
        </div>
      </div>

      {/* Animated Dots */}
      <div ref={dotsRef} className="mt-6 flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s'
            }}
          />
        ))}
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-gray-200/20 to-transparent dark:from-gray-700/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-gradient-to-tl from-gray-100/30 to-transparent dark:from-gray-800/30 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default LoadingSequence;
