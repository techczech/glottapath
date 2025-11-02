# Glottapath

Glottapath is a web-based, AI-powered language learning platform where teachers create learning journeys (called "paths") from reusable components. Students work through these paths independently, receiving immediate AI feedback, while teachers monitor progress and provide support.

## Core Concept: The Build-Then-Assemble Workflow

Glottapath separates content creation from curriculum design, promoting reusability and efficiency.

1.  **Phase 1: Build the Banks**
    Teachers populate four data banks with reusable components:
    -   **Exercise Bank**: Individual, tagged exercises (e.g., cloze, multiple choice).
    -   **Text Bank**: Articles, dialogues, and stories.
    -   **Media Bank**: Videos, audio files, and images.
    -   **Idea Bank**: Vocabulary lists, grammar explanations, and cultural notes.

2.  **Phase 2: Assemble Paths**
    Teachers design "Paths" by selecting and sequencing components from the banks into a series of "Units". This is like creating a playlist from a library of songs—the original components remain independent and reusable.

```
[Component Banks] ---> [Path Builder] ---> [Published Learning Path]
  - Exercises         (Drag & Drop)        - Unit 1
  - Texts                                 - Unit 2
  - Media                                 - Unit 3
  - Ideas
```

## Features

### For Teachers
*   **AI-Powered Exercise Generation**: Create complex, structured exercises from a simple natural language prompt using the Google Gemini API.
*   **Manual Exercise Editor**: A powerful two-panel editor to create and edit exercises using a simple markup language with a live preview.
*   **Component Banks**: Centralized libraries for all learning materials, making content easy to find, reuse, and update.
*   **Visual Path Builder**: An intuitive drag-and-drop interface to assemble units and construct learning paths from bank components.
*   **Content Management**: Easily edit or delete exercises directly from the bank.

### For Students (Planned)
*   **Structured Learning**: Follow teacher-designed paths for a curated experience.
*   **Immediate AI Feedback**: Get instant, contextual feedback on exercise submissions.
*   **Ad-hoc Practice**: Search the Exercise Bank to practice specific skills or topics.

## Technology Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI**: Google Gemini API (`@google/genai`) for exercise generation.
*   **No Backend**: This prototype runs entirely in the browser and uses mock data for persistence.

## Getting Started

This is a self-contained frontend application. No build step is required.

1.  **API Key**: The application requires a Google Gemini API key. It is configured to be loaded from the `process.env.API_KEY` environment variable, which is assumed to be available in the execution environment.
2.  **Run the App**: Simply open the `index.html` file in a modern web browser.

## Key Concepts in Depth

### Exercise Markup Language

The manual editor uses a simple, intuitive markup for defining exercises.

**1. Fill-in-the-blank (Cloze)**
-   Syntax: `Some text [correctAnswer|hint: optional hint].`
-   Example: `Yesterday I [went] to the store. The bread was [fresh|hint: Not old].`

**2. Multiple Choice**
-   Syntax: The first line is the question, subsequent lines are options. The correct option is prefixed with `*`.
-   Example:
    ```
    What is the capital of France?
    * Paris
    London
    Berlin
    ```

**3. Ordering**
-   Syntax: Each line is an item, prefixed with its correct sequence number and a period.
-   Example:
    ```
    2. Get dressed
    1. Wake up
    3. Eat breakfast
    ```

**4. Essay**
-   Syntax: The entire content is the prompt for the student.
-   Example: `Describe your last vacation. Talk about where you went and what you did.`

### Project Structure

```
/
├── index.html              # Main HTML entry point
├── index.tsx               # React application root
├── App.tsx                 # Main application component, manages state and views
├── data.ts                 # Mock data for banks and paths
├── types.ts                # Core TypeScript type definitions for the data model
│
├── components/
│   ├── App.tsx             # Main application component
│   ├── CreateExerciseModal.tsx # AI-powered exercise creation modal
│   ├── ManualExerciseModal.tsx # Manual markup-based editor modal
│   ├── ExerciseCard.tsx      # Card view for an exercise in the bank
│   ├── ExerciseRenderer.tsx  # Renders the interactive view of an exercise
│   └── Icons.tsx             # SVG icon components
│
└── services/
    ├── geminiService.ts      # Handles all interactions with the Google Gemini API
    └── markupService.ts      # Parses and serializes the custom exercise markup
```

## Future Work

This prototype lays the foundation for the full Glottapath vision. Key features to be added include:
-   **Student View**: The complete student-facing experience for completing paths.
-   **AI Feedback Engine**: Integration with Gemini to evaluate student answers and provide real-time feedback.
-   **Teacher Dashboard**: Analytics and monitoring tools for tracking student progress.
-   **Full Bank Functionality**: Adding, editing, and deleting items in the Text, Media, and Idea banks.
-   **Database Backend**: Replacing the mock `data.ts` file with a persistent database (e.g., PostgreSQL) and a backend API.
