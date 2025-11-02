// FIX: Import React to enable JSX syntax and fix JSX-related parsing errors.
import React from 'react';
import { Exercise, ExerciseType, ClozeExercise, MultipleChoiceExercise, EssayExercise, OrderingExercise, ClozeBlank, MultipleChoiceOption, OrderingItem } from '../types';

// --- PARSING: from Markup to structured Object ---

const parseCloze = (markup: string): Partial<ClozeExercise> => {
    const blanks: ClozeBlank[] = [];
    let blankIndex = 0;
    const content = markup.replace(/\[([^\]]+)\]/g, (match, innerContent) => {
        const parts = innerContent.split('|hint:');
        const correctAnswer = parts[0].replace(/^\*/, '').trim();
        const hint = parts[1] ? parts[1].trim() : undefined;
        blanks.push({ correctAnswer, hint });
        return `__BLANK_${blankIndex++}__`;
    });
    return { content, blanks };
};

const parseMultipleChoice = (markup: string): Partial<MultipleChoiceExercise> => {
    const lines = markup.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return { question: markup, options: [] };

    const question = lines[0];
    const options: MultipleChoiceOption[] = lines.slice(1).map(line => {
        const isCorrect = line.trim().startsWith('*');
        const text = line.trim().replace(/^\*/, '').trim();
        return { text, isCorrect };
    });

    return { question, options };
};

const parseOrdering = (markup: string): Partial<OrderingExercise> => {
    const lines = markup.split('\n').filter(line => line.trim() !== '');
    const items: OrderingItem[] = lines.map(line => {
        const match = line.trim().match(/^(\d+)\.\s*(.*)/);
        if (match) {
            return {
                text: match[2].trim(),
                correctOrder: parseInt(match[1], 10)
            };
        }
        return { text: line.trim(), correctOrder: 0 }; // Default order if no number
    }).filter(item => item.text);
    return { items };
};

const parseEssay = (markup: string): Partial<EssayExercise> => {
    return { prompt: markup };
};

export const parseMarkup = (markup: string, type: ExerciseType): Partial<Exercise> => {
    switch (type) {
        case ExerciseType.CLOZE: return parseCloze(markup);
        case ExerciseType.MULTIPLE_CHOICE: return parseMultipleChoice(markup);
        case ExerciseType.ORDERING: return parseOrdering(markup);
        case ExerciseType.ESSAY: return parseEssay(markup);
        default: return {};
    }
};


// --- SERIALIZING: from structured Object to Markup ---

const serializeCloze = (exercise: ClozeExercise): string => {
    let content = exercise.content;
    exercise.blanks.forEach((blank, index) => {
        const hintPart = blank.hint ? `|hint: ${blank.hint}` : '';
        const markup = `[${blank.correctAnswer}${hintPart}]`;
        content = content.replace(`__BLANK_${index}__`, markup);
    });
    return content;
};

const serializeMultipleChoice = (exercise: MultipleChoiceExercise): string => {
    const question = exercise.question;
    const options = exercise.options.map(opt => `${opt.isCorrect ? '*' : ''} ${opt.text}`).join('\n');
    return `${question}\n${options}`;
};

const serializeOrdering = (exercise: OrderingExercise): string => {
    return exercise.items.map(item => `${item.correctOrder}. ${item.text}`).join('\n');
};

const serializeEssay = (exercise: EssayExercise): string => {
    return exercise.prompt;
};

export const serializeToMarkup = (exercise: Exercise): string => {
    switch (exercise.type) {
        case ExerciseType.CLOZE: return serializeCloze(exercise as ClozeExercise);
        case ExerciseType.MULTIPLE_CHOICE: return serializeMultipleChoice(exercise as MultipleChoiceExercise);
        case ExerciseType.ORDERING: return serializeOrdering(exercise as OrderingExercise);
        case ExerciseType.ESSAY: return serializeEssay(exercise as EssayExercise);
        default: return '';
    }
};

// --- MARKUP INSTRUCTIONS ---

// FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension.
export const getMarkupInstructions = (type: ExerciseType): { placeholder: string; instructions: React.ReactNode } => {
    switch (type) {
        case ExerciseType.CLOZE:
            return {
                placeholder: "Yesterday I [went] to the store. The bread was [fresh|hint: Not old].",
                instructions: React.createElement(React.Fragment, null,
                    "Use ",
                    React.createElement("code", { className: "bg-gray-700 p-1 rounded text-sm" }, "[...]"),
                    " to create a blank. The text inside is the correct answer.",
                    React.createElement("br", null),
                    "Add an optional hint with ",
                    React.createElement("code", { className: "bg-gray-700 p-1 rounded text-sm" }, "|hint: your hint"),
                    "."
                )
            };
        case ExerciseType.MULTIPLE_CHOICE:
            return {
                placeholder: "What is the capital of France?\n* Paris\nLondon\nBerlin",
                instructions: React.createElement(React.Fragment, null,
                    "The first line is the question.",
                    React.createElement("br", null),
                    "Each following line is an option.",
                    React.createElement("br", null),
                    "Mark the correct answer(s) with ",
                    React.createElement("code", { className: "bg-gray-700 p-1 rounded text-sm" }, "*"),
                    " at the beginning of the line."
                )
            };
        case ExerciseType.ORDERING:
            return {
                placeholder: "2. Get dressed\n1. Wake up\n3. Eat breakfast",
                instructions: React.createElement(React.Fragment, null,
                    "Each line is an item to be ordered.",
                    React.createElement("br", null),
                    "Start each line with the correct number in the sequence, followed by a period (e.g., ",
                    React.createElement("code", { className: "bg-gray-700 p-1 rounded text-sm" }, "1."),
                    ", ",
                    React.createElement("code", { className: "bg-gray-700 p-1 rounded text-sm" }, "2."),
                    ")."
                )
            };
        case ExerciseType.ESSAY:
            return {
                placeholder: "Describe your last vacation. Talk about where you went, what you did, and who you were with.",
                instructions: "The text you enter here will be the student's writing prompt."
            };
        default:
            return { placeholder: "", instructions: "" };
    }
};
