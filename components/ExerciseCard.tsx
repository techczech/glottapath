import React from 'react';
import { Exercise, ExerciseType } from '../types';
import { TrashIcon, PencilIcon } from './Icons';

interface ExerciseCardProps {
    exercise: Exercise;
    onDelete: (id: string) => void;
    onEdit: (exercise: Exercise) => void;
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

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onDelete, onEdit }) => {
    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex flex-col justify-between hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white pr-4">{exercise.title}</h3>
                    <span className="flex-shrink-0 bg-cyan-900 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">{getExerciseTypeLabel(exercise.type)}</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{exercise.instructions}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                    {exercise.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                     <button
                        onClick={() => onEdit(exercise)}
                        className="text-gray-500 hover:text-cyan-400 transition-colors"
                        aria-label="Edit exercise"
                    >
                        <PencilIcon />
                    </button>
                    <button
                        onClick={() => onDelete(exercise.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        aria-label="Delete exercise"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseCard;