import React, { useState } from 'react';

interface ThemeSelectorProps {
  onThemeSelected: (theme: string, numBeats: number) => void;
  error: string | null;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeSelected, error }) => {
  const [theme, setTheme] = useState('');
  const [numBeats, setNumBeats] = useState(4);
  const beatOptions = [4, 6, 8];
  const exampleThemes = [
    "Sci-fi space exploration",
    "A gritty film noir mystery",
    "High fantasy dragon quest",
    "Cooking show disaster"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim()) {
      onThemeSelected(theme, numBeats);
    }
  };

  const handleExampleClick = (example: string) => {
    setTheme(example);
  };

  return (
    <div className="w-full max-w-lg text-center bg-black p-8 border border-gray-800">
      <h2 className="text-3xl font-bold text-white mb-2">Create Your Story</h2>
      <p className="text-gray-500 mb-6">Enter a theme. AI will generate the script.</p>
      
      {error && <div className="bg-gray-900 text-red-500 p-3 mb-4 border border-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="theme" className="sr-only">Story Theme</label>
          <input
            id="theme"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g., 'A silent film comedy'"
            className="w-full p-4 bg-gray-900 border border-gray-700 focus:outline-none focus:border-white transition-colors placeholder-gray-600"
          />
        </div>
        
        <div className="pt-2">
            <p className="text-sm text-gray-600 mb-3">Or try an example:</p>
            <div className="flex flex-wrap justify-center gap-2">
                {exampleThemes.map((example) => (
                    <button
                        key={example}
                        type="button"
                        onClick={() => handleExampleClick(example)}
                        className="px-3 py-1 bg-transparent border border-gray-800 text-gray-400 text-sm hover:bg-gray-900 hover:text-white transition-colors"
                    >
                        {example}
                    </button>
                ))}
            </div>
        </div>
        
        <div>
          <label htmlFor="numBeats" className="sr-only">Number of Beats</label>
          <div className="flex justify-center gap-px">
            {beatOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setNumBeats(option)}
                className={`flex-1 py-3 px-4 font-semibold text-lg transition-colors duration-200 border ${
                  numBeats === option 
                  ? 'bg-white text-black border-white' 
                  : 'bg-black border-gray-700 hover:bg-gray-900'
                }`}
              >
                {option} Beats
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!theme.trim()}
          className="w-full p-4 bg-white text-black font-bold text-xl hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Create Character
        </button>
      </form>
    </div>
  );
};

export default ThemeSelector;