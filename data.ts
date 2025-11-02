import { Exercise, ExerciseType, Text, Media, Idea, Path } from './types';

export const initialExercises: Exercise[] = [
    {
        id: 'cloze-1',
        title: 'At the Supermarket',
        type: ExerciseType.CLOZE,
        instructions: 'Fill in the blanks with the correct words.',
        content: 'Yesterday, I __BLANK_0__ to the supermarket to buy some __BLANK_1__. The bread was very __BLANK_2__.',
        blanks: [
            { correctAnswer: 'went', hint: 'Past tense of go' },
            { correctAnswer: 'milk' },
            { correctAnswer: 'fresh' }
        ],
        tags: ['shopping', 'past-tense', 'A1'],
    },
    {
        id: 'mc-1',
        title: 'Polite Requests',
        type: ExerciseType.MULTIPLE_CHOICE,
        instructions: 'Choose the most polite way to ask for the menu.',
        question: 'Which sentence is the most polite?',
        options: [
            { text: 'Give me the menu.', isCorrect: false },
            { text: 'I want the menu.', isCorrect: false },
            { text: 'Could I please see the menu?', isCorrect: true },
            { text: 'Where is the menu?', isCorrect: false },
        ],
        tags: ['restaurant', 'politeness', 'A2'],
    },
    {
        id: 'ordering-1',
        title: 'Daily Routine',
        type: ExerciseType.ORDERING,
        instructions: 'Put the sentences in the correct order to describe a morning routine.',
        items: [
            { text: 'Then, I brush my teeth.', correctOrder: 2 },
            { text: 'First, I wake up at 7 AM.', correctOrder: 1 },
            { text: 'Finally, I leave for work.', correctOrder: 4 },
            { text: 'After that, I eat breakfast.', correctOrder: 3 },
        ],
        tags: ['daily-routine', 'sequencing', 'A1'],
    },
     {
        id: 'essay-1',
        title: 'My Last Vacation',
        type: ExerciseType.ESSAY,
        instructions: 'Write a short paragraph about your last vacation. (approx. 50 words)',
        prompt: 'Describe where you went, what you did, and if you enjoyed it.',
        wordCount: 50,
        tags: ['travel', 'past-tense', 'writing', 'A2'],
    }
];

export const initialTexts: Text[] = [
    {
        id: 'text-1',
        title: 'Dialogue: At the Restaurant',
        content: 'Waiter: Hello, are you ready to order? \nCustomer: Yes, I would like the chicken soup to start, please.',
        tags: ['restaurant', 'dialogue', 'A2']
    },
    {
        id: 'text-2',
        title: 'A Trip to Paris',
        content: 'Last year, I traveled to Paris. It was a beautiful city. I visited the Eiffel Tower and ate many croissants.',
        tags: ['travel', 'story', 'past-tense', 'A2']
    }
];

export const initialMedia: Media[] = [
    {
        id: 'media-1',
        title: 'Market Tour in Barcelona',
        mediaType: 'video',
        url: 'https://www.youtube.com/watch?v=example',
        description: 'A short video showing the vibrant Boqueria market in Barcelona.',
        tags: ['shopping', 'video', 'B1']
    },
    {
        id: 'media-2',
        title: 'German Numbers Pronunciation',
        mediaType: 'audio',
        url: '/audio/german_numbers.mp3',
        description: 'An audio clip pronouncing German numbers from 1 to 20.',
        tags: ['pronunciation', 'numbers', 'audio', 'A1']
    }
];

export const initialIdeas: Idea[] = [
    {
        id: 'idea-1',
        title: 'Restaurant Vocabulary',
        ideaType: 'vocabulary',
        content: 'Menu, waiter, bill, tip, appetizer, main course, dessert.',
        tags: ['restaurant', 'vocabulary', 'A2']
    },
    {
        id: 'idea-2',
        title: 'Forming the Past Tense',
        ideaType: 'grammar',
        content: 'For regular verbs, add -ed. For irregular verbs, the form changes (e.g., go -> went).',
        tags: ['grammar', 'past-tense', 'A1']
    }
];

export const initialPaths: Path[] = [
    {
        id: 'path-1',
        title: 'Food & Restaurants',
        description: 'A beginner\'s guide to ordering food and talking about meals.',
        difficulty: 'B1',
        units: [
            {
                id: 'unit-1-1',
                title: 'Ordering at a Restaurant',
                anchorContent: { bankItemId: 'text-1', itemType: 'text' },
                resources: [
                    { bankItemId: 'idea-1', itemType: 'idea' }
                ],
                exercises: [
                    { bankItemId: 'mc-1', itemType: 'exercise' },
                    { bankItemId: 'cloze-1', itemType: 'exercise' }
                ]
            },
            {
                id: 'unit-1-2',
                title: 'Describing Food',
                exercises: [],
                resources: []
            }
        ]
    },
    {
        id: 'path-2',
        title: 'Daily Life',
        description: 'Learn to talk about your daily routines and activities.',
        difficulty: 'A1',
        units: [
            {
                id: 'unit-2-1',
                title: 'Morning Routines',
                exercises: [
                    { bankItemId: 'ordering-1', itemType: 'exercise' }
                ],
                resources: []
            }
        ]
    }
];