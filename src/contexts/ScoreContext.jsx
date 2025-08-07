import React, { createContext, useContext, useState} from 'react';

const ScoreContext = createContext();

const TICKS_PER_MEASURE = 1024;
const DURATION_TO_TICKS = {
    'w': 1024,
    'h': 512,
    'q': 256,
    '8': 128,
    '16': 64
};

export function ScoreProvider({ children }) {
    // const [notes, setNotes] = useState([]);
    const [measures, setMeasures] = useState([[]])
    const [selectedDuration, setSelectedDuration] = useState('q');
    const [selectedAccidental, setSelectedAccidental] = useState(null);
    const [selectedArticulation, setSelectedArticulation] = useState(null);

    const addNote = (pitch) => {
        if (!pitch || !selectedDuration) return;

        const newNote = {
                pitch,
                duration: selectedDuration,
                accidental: selectedAccidental,
                articulation: selectedArticulation
        };
        console.log('Adding note', newNote);
        // setNotes((prev) => [...prev,newNote])
        setMeasures((prevMeasures) => {
           
            const currentMeasure = [...prevMeasures[prevMeasures.length -1]];

            const currentTicks = currentMeasure.reduce((sum, note) => {
                return sum + (DURATION_TO_TICKS[note.duration] || 0);
            }, 0)

            const noteTicks = DURATION_TO_TICKS[newNote.duration] || 0;
            const newMeasure = [...currentMeasure, newNote]

            // console.log('--- DEBUG ---');
            // console.log('Previous measures:', prevMeasures);
            // console.log('Current measure before add:', currentMeasure);
            // console.log('Current total ticks:', currentTicks);
            // console.log('New note ticks:', noteTicks);
            // console.log('New measure content:', newMeasure);


            if (currentTicks + noteTicks <= TICKS_PER_MEASURE) {
                const updated = [...prevMeasures];
                updated[updated.length - 1] = newMeasure;
                return updated;
            } else {
                return [...prevMeasures, [newNote]];
            }
            
        });
    };

    const clearNotes = () => setMeasures([[]]);

    // const clearNotes = () => setNotes([]);

    return (
        <ScoreContext.Provider
            value={{
                measures,
                addNote,
                clearNotes,
                selectedDuration,
                setSelectedDuration,
                selectedAccidental,
                setSelectedAccidental,
                selectedArticulation,
                setSelectedArticulation
            }}
        >
            {children}
        </ScoreContext.Provider>
    )
}

export function useScore() {
    const context = useContext(ScoreContext);
    if (!context) {
        throw new Error('useScore must be used within a ScoreProvider')
    }
    return context;
}