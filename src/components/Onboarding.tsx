import React, { useState } from 'react';
import Logo from './Logo';
import { Film, Sparkles, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [name, setName] = useState('');

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-600 to-pink-600 rounded-full flex items-center justify-center">
              <Film className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Welcome to MoviesAreUs</h2>
            <p className="text-gray-600 mb-6">Let's personalize your experience</p>
            <div className="max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent text-lg"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-3 text-center">Select Your Favorite Genres</h2>
            <p className="text-gray-600 mb-6 text-center">Choose at least 3 genres you enjoy</p>
            <div className="grid grid-cols-2 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`p-4 rounded-xl border-2 transition-all active:scale-95 ${
                    selectedGenres.includes(genre)
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-600 to-pink-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">You're All Set!</h2>
            <p className="text-gray-600 mb-6">
              {name}, we're excited to show you personalized movie recommendations based on your preferences.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Selected Genres:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedGenres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <Logo />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            {renderStep()}
            
            <div className="mt-8 flex justify-between items-center">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 active:scale-95"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !name.trim() || step === 2 && selectedGenres.length < 3}
                  className={`ml-auto px-6 py-2 rounded-xl flex items-center ${
                    (step === 1 && !name.trim()) || (step === 2 && selectedGenres.length < 3)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={onComplete}
                  className="ml-auto px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:scale-95 flex items-center"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 