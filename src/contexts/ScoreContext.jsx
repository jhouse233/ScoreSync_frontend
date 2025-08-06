import React, { createContext, useContext, useState} from 'react';

const ScoreContext = createContext();

export function ScoreProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [selectedDuration, setSelectedDuration] = useState('q');
    const [selectedAccidental, setSelectedAccidental] = useState(null);
    const [selectedArticulation, setSelectedArticulation] = useState(null);

    const addNote = (pitch) => {
        setNotes((prev) => [
            ...prev,
            {
                pitch,
                duration: selectedDuration,
                accidental: selectedAccidental,
                articulation: selectedArticulation
            },
        ]);
    };

    const clearNotes = () => setNotes([]);

    return (
        <ScoreContext.Provider
            value={{
                notes,
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