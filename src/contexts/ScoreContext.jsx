import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { nanoid } from 'nanoid';

const ScoreContext = createContext();

// --- State and Actions
const initialState = { 
    measures: [], 
    selectedMeasureId: null,
    measuresPerRow: 3,
    defaultClef: 'treble',
    clefEvents: [] 
};

export const actions = {
    SET_CLEF_AT_MEASURE: 'SET_CLEF_AT_MEASURE',
    REMOVE_CLEF_AT_MEASURE: 'REMOVE_CLEF_AT_MEASURE',
    SET_MEASURES_PER_ROW: 'SET_MEASURES_PER_ROW',
}

// --- ID and Normalizer
const createId = () => nanoid();
const createBlankMeasure = () => ({ id: createId(), notes: [] });

const normalizeMeasures = (input = []) =>
    input.map((m) => {
        if (Array.isArray(m)) return { id: createId(), notes: m };
        const id = m?.id ?? createId();
        const notes = Array.isArray(m?.notes) ? m.notes : [];
        return { ...m, id, notes };
    });

// Lookups
const getMeasureIndexById = (state, id) =>
    id ? state.measures.findIndex((m) => m.id === id) : -1;

const isSystemStart = (measureIndex, measuresPerRow) => {
    const perRow = Math.max(1, Number(measuresPerRow) || 1);
    return measureIndex % perRow === 0;
}


// Clef Events
export function insertClefEvent(events, atMeasureIndex, clef, size) {
    const safe = Array.isArray(events) ? events: [];
    const existing = safe.find(e => e.atMeasureIndex === atMeasureIndex);
    if (existing && existing.clef === clef && existing.size === size) return safe;
    const without = safe.filter(e => e.atMeasureIndex !== atMeasureIndex);
    const next = [...without, {atMeasureIndex, clef, size }];
    next.sort((a, b) => a.atMeasureIndex - b.atMeasureIndex);
    return next;
}

export function removeClefEvent(events, atMeasureIndex) {
    const safe = Array.isArray(events) ? events : [];
    return safe.filter(e => e.atMeasureIndex !== atMeasureIndex)
}

// Clef Event Shifting
const shiftClefEventsForInsert = (events, insertedAt) =>
    (Array.isArray(events) ? events: []).map((e) =>
        e.atMeasureIndex >= insertedAt 
        ? { ...e, atMeasureIndex: e.atMeasureIndex + 1} 
        : e
    );

const shiftClefEventsForDelete = (events, deletedAt) =>
    (Array.isArray(events) ? events : [])
        .filter((e) => e.atMeasureIndex !== deletedAt)
        .map((e) => 
            e.atMeasureIndex > deletedAt 
            ? { ...e, atMeasureIndex: e.atMeasureIndex - 1 } 
            : e
        );

const getLastClefEventAtOrBefore = (state, measureIndex) => {
    const events = Array.isArray(state.clefEvents) ? state.clefEvents : [];
    let last = null;
    for (let i = 0; i <events.length; i++) {
        const e = events[i];
        if (e.atMeasureIndex <= measureIndex) last = e;
        else break;
    }
    return last;
}

export const getEffectiveClefAtMeasure = (state, measureIndex) =>
    getLastClefEventAtOrBefore(state, measureIndex)?.clef || state.defaultClef || 'treble';


// Reducer
function reducer(state, action) {
    switch (action.type) {
        case 'INIT': {
            return {
                ...state, 
                measures: normalizeMeasures(action.payload), 
                selectedMeasureId: null
            };
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
            const insertedAt = state.measures.length;
            return { 
                ...state,
                measures: [...state.measures, m], 
                selectedMeasureId: m.id,
                clefEvents: shiftClefEventsForInsert(state.clefEvents, insertedAt),
            };
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