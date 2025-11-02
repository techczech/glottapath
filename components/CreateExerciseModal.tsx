
import React, { useState } from 'react';
import { Exercise } from '../types';
import { generateExerciseFromPrompt } from '../services/geminiService';
import ExerciseRenderer from './ExerciseRenderer';
import { SparklesIcon, XMarkIcon } from './Icons';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExerciseCreated: (exercise: Exercise) => void;
}

const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({ isOpen, onClose, onExerciseCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedExercise, setGeneratedExercise] = useState<Exercise | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedExercise(null);
    try {
      const exercise = await generateExerciseFromPrompt(prompt);
      setGeneratedExercise(exercise);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToBank = () => {
    if (generatedExercise) {
      onExerciseCreated(generatedExercise);
      handleClose();
    }
  };

  const handleClose = () => {
    setPrompt('');
    setIsLoading(false);
    setError(null);
    setGeneratedExercise(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2 text-cyan-400" />
            Create Exercise with AI
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <XMarkIcon />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Describe the exercise you want to create
            </label>
            <textarea
              id="prompt"
              rows={3}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
              placeholder="e.g., 'A multiple choice exercise about past tense verbs for A2 level students on the theme of travel.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg flex items-center transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Generate
                </>
              )}
            </button>
          </div>

          {error && <div className="bg-red-900 border border-red-700 text-red-300 p-4 rounded-lg">{error}</div>}

          {generatedExercise && (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Generated Preview:</h3>
                <ExerciseRenderer exercise={generatedExercise} />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-900/50 flex justify-end gap-4">
          <button onClick={handleClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
            Cancel
          </button>
          <button
            onClick={handleAddToBank}
            disabled={!generatedExercise || isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Add to Bank
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExerciseModal;
