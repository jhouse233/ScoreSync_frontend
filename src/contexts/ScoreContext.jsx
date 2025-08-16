import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { nanoid } from 'nanoid';

const ScoreContext = createContext();


// --- ID and Normalizer
const createId = () => nanoid();
const createBlankMeasure = () => ({ id: createId(), notes: [] });

const normalizeMeasures = (input = []) =>
    input.map(
        m => Array.isArray(m)
        ? { id: createId(), notes: m }
        : (m.id ? m : { ...m, id: createId() })
    );

// --- State and Reducer
const initialState = { measures: [], selectedMeasureId: null };

function reducer(state, action) {
    switch (action.type) {
        case 'INIT': {
            return { measures: normalizeMeasures(action.payload), selectedMeasureId: null};
        }
        case 'SELECT': {
            const id = action.payload;
            return state.measures.some(m => m.id === id)
            ? { ...state, selectedMeasureId: id }
            : { ...state, selectedMeasureId: null };
        }
        case 'CLEAR':
            return { ...state, selectedMeasureId: null };

        case 'ADD': {
            const m = createBlankMeasure();
            return { measures: [...state.measures, m], selectedMeasureId: m.id };
        }

        case 'INSERT_BEFORE': {
            const targetId = action.payload;
            const idx = state.measures.findIndex(m => m.id === targetId);
            if (idx < 0) return state;
            const m = createBlankMeasure();
            const next = state.measures.slice();
            next.splice(idx, 0, m);
            return { measures: next, selectedMeasureId: m.id };
        }

        case 'REMOVE': {
            const targetId = action.payload;
            const idx = state.measures.findIndex(m => m.id === targetId);
            if (idx < 0) return state;
            const next = state.measures.filter(m => m.id !== targetId);

            const fallback = next[idx - 1]?.id ?? next[idx]?.id ?? null;
            const nextSel = state.selectedMeasureId === targetId ? fallback : state.selectedMeasureId;
            return { measures: next, selectedMeasureId: nextSel}
        }

        default: {
            if (process.env.NODE_ENV !== 'production') {
                throw new Error(`Unknown action: ${action.type}`);
            }

            return state;
        }
            
    }
}

// -- Provider
export default function ScoreProvider({ initialMeasures = [], children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (state.measures.length === 0 && initialMeasures.length > 0) {
            dispatch({ type: 'INIT', payload: initialMeasures });
        }
    }, [initialMeasures, state.measures.length]);

    const value = useMemo(() => {
        const selectMeasure = (id) => dispatch({ type: 'SELECT', payload: id });
        const clearSelection = () => dispatch({ type: 'CLEAR' });
        const addMeasure = () => dispatch({ type: 'ADD' });
        const insertBefore = (targetId) => dispatch({ type: 'INSERT_BEFORE', payload: targetId });
        const removeMeasure = (id) => dispatch({ type: 'REMOVE', payload: id });

        return {
            measures: state.measures,
            selectedMeasureId: state.selectedMeasureId,
            selectMeasure,
            clearSelection,
            addMeasure,
            insertBefore,
            removeMeasure,
            idToIndex: new Map(state.measures.map((m, i) => [m.id, i])),
        };
    }, [state])
    
    
    return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
}
// -- Hook
export function useScore() {
    const context = useContext(ScoreContext);
    if (!context) {
        throw new Error('useScore must be used within a ScoreProvider')
    }
    return context;
}