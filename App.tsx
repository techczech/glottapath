import React, { useState, useMemo } from 'react';
import { Exercise, Path, Text, Media, Idea, PathUnit, BankItem, BankItemType, PathUnitItem } from './types';
import { initialExercises, initialTexts, initialMedia, initialIdeas, initialPaths } from './data';
import { PlusIcon, SparklesIcon, BookOpenIcon, VideoCameraIcon, LightBulbIcon, FolderIcon, ArrowLeftIcon, ClipboardDocumentListIcon, TrashIcon, XMarkIcon, PencilIcon } from './components/Icons';
import ExerciseCard from './components/ExerciseCard';
import CreateExerciseModal from './components/CreateExerciseModal';
import ManualExerciseModal from './components/ManualExerciseModal';

// --- GENERIC BANK ITEM CARD ---
const BankItemCard: React.FC<{ item: BankItem, onDelete?: (id: string) => void, onAdd?: () => void, children?: React.ReactNode }> = ({ item, onDelete, onAdd, children }) => (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex flex-col justify-between hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10">
        <div>
            <h3 className="text-lg font-bold text-white pr-4">{item.title}</h3>
            {children}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-end">
            <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                        {tag}
                    </span>
                ))}
            </div>
            {onDelete && (
                <button onClick={() => onDelete(item.id)} className="text-gray-500 hover:text-red-500 transition-colors" aria-label={`Delete ${item.title}`}><TrashIcon /></button>
            )}
            {onAdd && (
                <button onClick={onAdd} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-1 px-3 rounded-lg text-sm transition">Add</button>
            )}
        </div>
    </div>
);


const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
    const [texts, setTexts] = useState<Text[]>(initialTexts);
    const [media, setMedia] = useState<Media[]>(initialMedia);
    const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
    const [paths, setPaths] = useState<Path[]>(initialPaths);

    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

    const [view, setView] = useState<'dashboard' | 'pathBuilder'>('dashboard');
    const [editingPath, setEditingPath] = useState<Path | null>(null);

    const allBankItems = useMemo(() => ({
        exercise: exercises,
        text: texts,
        media: media,
        idea: ideas,
    }), [exercises, texts, media, ideas]);

    const getItemFromBank = (item: PathUnitItem): BankItem | undefined => {
        const bank = allBankItems[item.itemType];
        return bank.find(i => i.id === item.bankItemId);
    }

    // --- DATA HANDLERS ---
    const handleSaveExercise = (exercise: Exercise) => {
        const exists = exercises.some(ex => ex.id === exercise.id);
        if (exists) {
            setExercises(prev => prev.map(ex => ex.id === exercise.id ? exercise : ex));
        } else {
            setExercises(prev => [exercise, ...prev]);
        }
    };

    const deleteExercise = (id: string) => setExercises(prev => prev.filter(ex => ex.id !== id));
    
    const handleOpenManualEdit = (exercise: Exercise) => {
        setEditingExercise(exercise);
        setIsManualModalOpen(true);
    };

    const handleOpenManualCreate = () => {
        setEditingExercise(null);
        setIsManualModalOpen(true);
    };
    
    const handleEditPath = (pathId: string) => {
        const path = paths.find(p => p.id === pathId);
        if (path) {
            setEditingPath(JSON.parse(JSON.stringify(path))); // Deep copy for editing
            setView('pathBuilder');
        }
    };
    
    const handleSavePath = (updatedPath: Path) => {
        setPaths(paths.map(p => p.id === updatedPath.id ? updatedPath : p));
        setView('dashboard');
        setEditingPath(null);
    };

    // --- UI COMPONENTS (Internal) ---
    const PathCard: React.FC<{path: Path}> = ({ path }) => (
        <div onClick={() => handleEditPath(path.id)} className="bg-gray-800 rounded-lg border border-gray-700 p-5 flex flex-col justify-between hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10 cursor-pointer">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white pr-4">{path.title}</h3>
                    <span className="flex-shrink-0 bg-purple-900 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">{path.difficulty}</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{path.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-end">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <ClipboardDocumentListIcon className="w-4 h-4" />
                    <span>{path.units.length} Units</span>
                </div>
            </div>
        </div>
    );

    const BankTabs: React.FC<{ onAddItem: (item: BankItem, type: BankItemType) => void, mode: 'view' | 'add' }> = ({ onAddItem, mode }) => {
        const [activeTab, setActiveTab] = useState('Exercises');
        const tabs = [
            { name: 'Exercises', icon: SparklesIcon, data: exercises, type: 'exercise' as BankItemType },
            { name: 'Texts', icon: BookOpenIcon, data: texts, type: 'text' as BankItemType },
            { name: 'Media', icon: VideoCameraIcon, data: media, type: 'media' as BankItemType },
            { name: 'Ideas', icon: LightBulbIcon, data: ideas, type: 'idea' as BankItemType },
        ];
        const activeTabData = tabs.find(t => t.name === activeTab);

        return (
            <div>
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button key={tab.name} onClick={() => setActiveTab(tab.name)}
                                className={`whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.name ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                                <tab.icon className="-ml-0.5 mr-2 h-5 w-5" /> {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTabData?.data.map(item => {
                            if (activeTabData.type === 'exercise') {
                                return <ExerciseCard key={item.id} exercise={item as Exercise} onDelete={deleteExercise} onEdit={handleOpenManualEdit}/>
                            }
                            return (
                                <BankItemCard key={item.id} item={item} onAdd={mode === 'add' ? () => onAddItem(item, activeTabData.type) : undefined}>
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        { (item as any).content || (item as any).description || `A ${activeTabData.name.slice(0, -1)} component.`}
                                    </p>
                                </BankItemCard>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // --- VIEWS ---
    const Dashboard = () => (
        <>
            <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-3">
                            <SparklesIcon className="h-8 w-8 text-cyan-400" />
                            <h1 className="text-3xl font-bold tracking-tight">Glottapath</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleOpenManualCreate}
                                className="inline-flex items-center gap-x-2 rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 transition-all"
                            >
                                <PencilIcon className="h-5 w-5" />
                                Create Manually
                            </button>
                            <button
                                onClick={() => setIsAiModalOpen(true)}
                                className="inline-flex items-center gap-x-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all duration-300 transform hover:scale-105"
                            >
                                <SparklesIcon className="h-5 w-5" />
                                Create with AI
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                <section>
                    <div className="border-b border-gray-700 pb-5 mb-8 flex items-center gap-3">
                        <FolderIcon className="h-7 w-7 text-gray-400" />
                        <div>
                            <h2 className="text-2xl font-semibold leading-6 text-white">Learning Paths</h2>
                            <p className="mt-1 text-sm text-gray-400">Assemble components into structured learning journeys for students.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paths.map(path => <PathCard key={path.id} path={path} />)}
                    </div>
                </section>
                <section>
                    <div className="border-b border-gray-700 pb-5 mb-8 flex items-center gap-3">
                        <SparklesIcon className="h-7 w-7 text-gray-400" />
                        <div>
                            <h2 className="text-2xl font-semibold leading-6 text-white">Component Banks</h2>
                            <p className="mt-1 text-sm text-gray-400">Create and manage reusable learning components.</p>
                        </div>
                    </div>
                    <BankTabs mode="view" onAddItem={()=>{}}/>
                </section>
            </main>
        </>
    );

    const PathBuilder = () => {
        const [path, setPath] = useState<Path>(editingPath!);
        const [activeUnitId, setActiveUnitId] = useState<string | null>(path.units[0]?.id || null);

        const addUnit = () => {
            const newUnit: PathUnit = {
                id: `unit-${Date.now()}`,
                title: `New Unit ${path.units.length + 1}`,
                exercises: [],
                resources: [],
            };
            setPath(p => ({...p, units: [...p.units, newUnit]}));
            setActiveUnitId(newUnit.id);
        }

        const addItemToActiveUnit = (item: BankItem, type: BankItemType) => {
            if (!activeUnitId) return;
            const newUnitItem: PathUnitItem = { bankItemId: item.id, itemType: type };
            
            setPath(p => {
                const newUnits = p.units.map(unit => {
                    if (unit.id === activeUnitId) {
                        const updatedUnit = {...unit};
                        if (type === 'exercise') {
                            updatedUnit.exercises = [...unit.exercises, newUnitItem];
                        } else if (type === 'text' || type === 'media') {
                            updatedUnit.anchorContent = newUnitItem; // Overwrites previous anchor
                        } else {
                            updatedUnit.resources = [...unit.resources, newUnitItem];
                        }
                        return updatedUnit;
                    }
                    return unit;
                });
                return {...p, units: newUnits};
            });
        };

        const removeItemFromUnit = (unitId: string, itemIndex: number, itemCategory: 'anchor' | 'resource' | 'exercise') => {
            setPath(p => {
                const newUnits = p.units.map(unit => {
                    if (unit.id === unitId) {
                        const updatedUnit = {...unit};
                        if (itemCategory === 'anchor') updatedUnit.anchorContent = undefined;
                        if (itemCategory === 'resource') updatedUnit.resources.splice(itemIndex, 1);
                        if (itemCategory === 'exercise') updatedUnit.exercises.splice(itemIndex, 1);
                        return updatedUnit;
                    }
                    return unit;
                });
                return {...p, units: newUnits};
            });
        };
        
        return (
            <div className="flex flex-col h-screen">
                <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700 flex-shrink-0">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                                <ArrowLeftIcon className="w-5 h-5" /> Back to Dashboard
                            </button>
                            <h1 className="text-xl font-bold">{path.title}</h1>
                            <button onClick={() => handleSavePath(path)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg">Save Path</button>
                        </div>
                    </div>
                </header>
                <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
                    <div className="grid grid-cols-12 gap-8 h-full">
                        {/* Left Panel: Path Structure */}
                        <div className="col-span-5 h-full overflow-y-auto pr-4">
                           <div className="space-y-6">
                                {path.units.map(unit => (
                                    <div key={unit.id} className={`p-4 rounded-lg border-2 ${activeUnitId === unit.id ? 'bg-gray-800/50 border-cyan-500' : 'bg-gray-800 border-gray-700'}`}>
                                        <h3 onClick={() => setActiveUnitId(unit.id)} className="font-bold text-lg cursor-pointer flex justify-between items-center">{unit.title} {activeUnitId === unit.id && <span className="text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full">ACTIVE</span>}</h3>
                                        <div className="mt-4 space-y-3 pl-4 border-l border-gray-600">
                                            {unit.anchorContent && <PathItem item={getItemFromBank(unit.anchorContent)!} onRemove={() => removeItemFromUnit(unit.id, 0, 'anchor')} />}
                                            {unit.resources.map((item, i) => <PathItem key={`${item.bankItemId}-${i}`} item={getItemFromBank(item)!} onRemove={() => removeItemFromUnit(unit.id, i, 'resource')} />)}
                                            {unit.exercises.map((item, i) => <PathItem key={`${item.bankItemId}-${i}`} item={getItemFromBank(item)!} onRemove={() => removeItemFromUnit(unit.id, i, 'exercise')} />)}
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addUnit} className="w-full border-2 border-dashed border-gray-600 hover:border-cyan-500 text-gray-400 hover:text-white rounded-lg py-3 transition">Add Unit</button>
                           </div>
                        </div>
                        {/* Right Panel: Banks */}
                        <div className="col-span-7 h-full overflow-y-auto">
                            <BankTabs mode="add" onAddItem={addItemToActiveUnit}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const PathItem:React.FC<{item: BankItem, onRemove: ()=>void}> = ({ item, onRemove }) => (
        <div className="bg-gray-700/50 p-2 rounded flex items-center justify-between">
            <span className="text-sm text-gray-300">{item.title}</span>
            <button onClick={onRemove} className="text-gray-500 hover:text-red-500"><XMarkIcon className="w-4 h-4" /></button>
        </div>
    );

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <CreateExerciseModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} onExerciseCreated={handleSaveExercise} />
            <ManualExerciseModal 
                isOpen={isManualModalOpen} 
                onClose={() => setIsManualModalOpen(false)} 
                onSave={handleSaveExercise}
                exerciseToEdit={editingExercise} 
            />
            {view === 'dashboard' && <Dashboard />}
            {view === 'pathBuilder' && editingPath && <PathBuilder />}
        </div>
    );
};

export default App;