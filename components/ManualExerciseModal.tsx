import React, { useState, useEffect, useMemo } from 'react';
import { Exercise, ExerciseType } from '../types';
import { parseMarkup, serializeToMarkup, getMarkupInstructions } from '../services/markupService';
import ExerciseRenderer from './ExerciseRenderer';
import { PencilIcon, XMarkIcon } from './Icons';

interface ManualExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  exerciseToEdit: Exercise | null;
}

const ManualExerciseModal: React.FC<ManualExerciseModalProps> = ({ isOpen, onClose, onSave, exerciseToEdit }) => {
  const isEditing = !!exerciseToEdit;

  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [type, setType] = useState<ExerciseType>(ExerciseType.CLOZE);
  const [tags, setTags] = useState('');
  const [markup, setMarkup] = useState('');
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (isOpen) {
        if (isEditing) {
            setTitle(exerciseToEdit.title);
            setInstructions(exerciseToEdit.instructions);
            setType(exerciseToEdit.type);
            setTags(exerciseToEdit.tags.join(', '));
            setMarkup(serializeToMarkup(exerciseToEdit));
        } else {
            // Reset for new exercise
            setTitle('');
            setInstructions('');
            setType(ExerciseType.CLOZE);
            setTags('');
            setMarkup('');
        }
    }
  }, [isOpen, exerciseToEdit, isEditing]);

  useEffect(() => {
    try {
        const parsedData = parseMarkup(markup, type);
        const exerciseForPreview: Exercise = {
            id: exerciseToEdit?.id || 'preview-id',
            title: title || "Untitled Exercise",
            instructions: instructions || "Follow the instructions below.",
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            type: type,
            ...parsedData,
        } as Exercise;
        setPreviewExercise(exerciseForPreview);
    } catch(e) {
        console.error("Markup parsing error:", e);
        setPreviewExercise(null);
    }
  }, [markup, type, title, instructions, tags, exerciseToEdit]);

  const handleSave = () => {
    if (previewExercise) {
        onSave(previewExercise);
        onClose();
    }
  };

  if (!isOpen) return null;

  const markupInfo = getMarkupInstructions(type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center">
            <PencilIcon className="w-5 h-5 mr-2 text-cyan-400" />
            {isEditing ? 'Edit Exercise' : 'Create Exercise Manually'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
        </div>
        
        {/* Body */}
        <div className="flex-grow flex overflow-hidden">
            {/* Left Panel: Editor */}
            <div className="w-1/2 p-6 flex flex-col gap-4 overflow-y-auto border-r border-gray-700">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Instructions</label>
                    <input type="text" value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"/>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Exercise Type</label>
                        <select value={type} onChange={e => setType(e.target.value as ExerciseType)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition appearance-none">
                            {Object.values(ExerciseType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                         <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
                        <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"/>
                    </div>
                </div>
                <div className="flex-grow flex flex-col">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Content Markup</label>
                    <div className="bg-gray-900/50 p-3 rounded-t-lg border border-b-0 border-gray-600 text-xs text-gray-400">
                        {markupInfo.instructions}
                    </div>
                    <textarea 
                        value={markup} 
                        onChange={e => setMarkup(e.target.value)} 
                        placeholder={markupInfo.placeholder}
                        className="w-full h-full flex-grow bg-gray-800 border border-gray-600 rounded-b-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition font-mono text-sm"
                        spellCheck="false"
                    />
                </div>
            </div>
            
            {/* Right Panel: Preview */}
            <div className="w-1/2 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Live Preview</h3>
                <div className="bg-gray-900 p-4 rounded-lg">
                    {previewExercise ? (
                        <ExerciseRenderer exercise={previewExercise} />
                    ) : (
                        <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-700 rounded-lg">
                            <p>Enter valid markup to see a preview.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex justify-end gap-4 flex-shrink-0">
          <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!previewExercise || !title}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {isEditing ? 'Save Changes' : 'Add to Bank'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualExerciseModal;