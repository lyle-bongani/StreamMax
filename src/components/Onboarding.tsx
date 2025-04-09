import React, { useState } from 'react';
import { ChevronRight, Film, Tv, Star, Play } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to StreamMax',
      description: 'Your ultimate guide to streaming movies and TV shows across all platforms.',
      icon: <Play className="w-12 h-12 text-white" />,
      image: 'https://image.tmdb.org/t/p/original/1E5baAaEse26fej7uHcjOgEE2t2.jpg'
    },
    {
      title: 'Discover Movies',
      description: 'Browse through thousands of movies and find where to watch them.',
      icon: <Film className="w-12 h-12 text-white" />,
      image: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'
    },
    {
      title: 'TV Shows',
      description: 'Keep track of your favorite TV shows and find new ones to binge.',
      icon: <Tv className="w-12 h-12 text-white" />,
      image: 'https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'
    },
    {
      title: 'Personalized Experience',
      description: 'Get recommendations based on your preferences and watch history.',
      icon: <Star className="w-12 h-12 text-white" />,
      image: 'https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={steps[currentStep].image}
          alt={steps[currentStep].title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col justify-between p-6">
        {/* Progress Dots */}
        <div className="flex justify-center pt-8">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-white w-8' : 'bg-white/30 w-4'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-end pb-20">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              {steps[currentStep].icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-white/80 text-lg">
                {steps[currentStep].description}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full bg-white text-black py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-white/90 transition-all duration-300"
          >
            <span className="font-medium">
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 