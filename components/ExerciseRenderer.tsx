
import React from 'react';
import { Exercise, ExerciseType, ClozeExercise, MultipleChoiceExercise, EssayExercise, OrderingExercise } from '../types';

interface ExerciseRendererProps {
  exercise: Exercise;
}

const getExerciseTypeLabel = (type: ExerciseType) => {
    switch (type) {
        case ExerciseType.CLOZE: return "Fill in the Blank";
        case ExerciseType.MULTIPLE_CHOICE: return "Multiple Choice";
        case ExerciseType.ESSAY: return "Essay";
        case ExerciseType.ORDERING: return "Ordering";
        default: return "Exercise";
    }
};

const ClozeRenderer: React.FC<{ exercise: ClozeExercise }> = ({ exercise }) => {
    const parts = exercise.content.split(/(__BLANK_\d+__)/g);
    return (
        <div className="text-lg leading-relaxed">
            {parts.map((part, index) => {
                const match = part.match(/__BLANK_(\d+)__/);
                if (match) {
                    const blankIndex = parseInt(match[1], 10);
                    const blank = exercise.blanks[blankIndex];
                    return (
                        <span key={index} className="inline-block mx-1">
                            <input
                                type="text"
                                placeholder={blank.correctAnswer}
                                className="px-2 py-1 rounded-md bg-gray-600 border border-gray-500 w-40 text-cyan-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                                readOnly
                            />
                        </span>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};

const MultipleChoiceRenderer: React.FC<{ exercise: MultipleChoiceExercise }> = ({ exercise }) => {
    const isMultiAnswer = exercise.options.filter(o => o.isCorrect).length > 1;
    return (
        <div>
            <p className="text-lg mb-4">{exercise.question}</p>
            <div className="space-y-3">
                {exercise.options.map((option, index) => (
                    <div key={index} className={`flex items-center p-3 rounded-lg border-2 ${option.isCorrect ? 'border-green-500 bg-green-500/10' : 'border-gray-600'}`}>
                        <input
                            type={isMultiAnswer ? 'checkbox' : 'radio'}
                            name={`mc-${exercise.id}`}
                            id={`mc-${exercise.id}-${index}`}
                            checked={option.isCorrect}
                            readOnly
                            className={`mr-3 ${isMultiAnswer ? 'rounded' : 'rounded-full'} h-5 w-5 accent-cyan-500`}
                        />
                        <label htmlFor={`mc-${exercise.id}-${index}`} className="flex-1">{option.text}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EssayRenderer: React.FC<{ exercise: EssayExercise }> = ({ exercise }) => (
    <div>
        <p className="text-lg mb-4">{exercise.prompt}</p>
        <textarea
            rows={6}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            placeholder={`Write your essay here... (${exercise.wordCount || 'No'} word count)`}
            readOnly
        />
    </div>
);

const OrderingRenderer: React.FC<{ exercise: OrderingExercise }> = ({ exercise }) => {
    const sortedItems = [...exercise.items].sort((a, b) => a.correctOrder - b.correctOrder);
    return (
        <div>
            <div className="space-y-3">
                {sortedItems.map((item, index) => (
                     <div key={index} className="flex items-center p-3 rounded-lg border border-gray-600 bg-gray-800">
                        <span className="mr-4 text-cyan-400 font-bold">{index + 1}.</span>
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({ exercise }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full">
        <div className="mb-4">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{exercise.title}</h3>
                <span className="bg-cyan-900 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">{getExerciseTypeLabel(exercise.type)}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{exercise.instructions}</p>
        </div>

        <div className="my-6">
            {exercise.type === ExerciseType.CLOZE && <ClozeRenderer exercise={exercise} />}
            {exercise.type === ExerciseType.MULTIPLE_CHOICE && <MultipleChoiceRenderer exercise={exercise} />}
            {exercise.type === ExerciseType.ESSAY && <EssayRenderer exercise={exercise} />}
            {exercise.type === ExerciseType.ORDERING && <OrderingRenderer exercise={exercise} />}
        </div>

        {exercise.tags && exercise.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                {exercise.tags.map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                        {tag}
                    </span>
                ))}
            </div>
        )}
    </div>
  );
};

export default ExerciseRenderer;
