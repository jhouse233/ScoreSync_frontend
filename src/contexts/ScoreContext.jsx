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
            const nextMeasures = state.measures.slice();
            nextMeasures.splice(idx, 0, m);
            return { 
                ...state,
                measures: nextMeasures, 
                selectedMeasureId: m.id,
                clefEvents: shiftClefEventsForInsert(state.clefEvents, idx),
            };
        }

        case 'REMOVE': {
            const targetId = action.payload;
            const idx = state.measures.findIndex(m => m.id === targetId);
            if (idx < 0) return state;

            const nextMeasures = state.measures.filter(m => m.id !== targetId);
            const fallback = nextMeasures[idx - 1]?.id ?? nextMeasures[idx]?.id ?? null;
            const nextSel = state.selectedMeasureId === targetId ? fallback : state.selectedMeasureId;
            return { 
                ...state,
                measures: nextMeasures, 
                selectedMeasureId: nextSel,
                clefEvents: shiftClefEventsForDelete(state.clefEvents, idx),
            };
        }

        case actions.SET_MEASURES_PER_ROW: {
            return { ...state, measuresPerRow: action.payload };
        }

        case actions.SET_CLEF_AT_MEASURE: {
            const { atMeasureIndex, clef } = action.payload;
            const size = isSystemStart(atMeasureIndex, state.measuresPerRow) ? 'default' : 'small';
            return {
                ...state,
                clefEvents: insertClefEvent(state.clefEvents, atMeasureIndex, clef, size),
            };
        }

        case actions.REMOVE_CLEF_AT_MEASURE: {
            const { atMeasureIndex } = action.payload;
            return {
                ...state,
                clefEvents: removeClefEvent(state.clefEvents, atMeasureIndex),
            };
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

        const idToIndex = new Map(state.measures.map((m, i) => [m.id, i]));

        const setMeasuresPerRow = (n) =>
            dispatch({ type: actions.SET_MEASURES_PER_ROW, payload: n });

        const setClefAtMeasureIndex = (atMeasureIndex, clef) =>
            dispatch({ type: actions.SET_CLEF_AT_MEASURE, payload: { atMeasureIndex, clef } });

        const removeClefAtMeasureIndex = (atMeasureIndex) =>
            dispatch({ type: actions.REMOVE_CLEF_AT_MEASURE, payload: { atMeasureIndex } });

        const setClefAtSelectedMeasure = (clef) => {
            const selId = state.selectedMeasureId;
            if (!selId) return;
            const i = idToIndex.get(selId);
            if (typeof i === 'number' && i >= 0) {
                dispatch({ type: actions.SET_CLEF_AT_MEASURE, payload: { atMeasureIndex: i, clef } });
            }
        };

        const removeClefAtSelectedMeasure = () => {
            const selId = state.selectedMeasureId;
            if (!selId) return;
            const i = idToIndex.get(selId);
            if (typeof i === 'number' && i >= 0) {
                dispatch({ type: actions.REMOVE_CLEF_AT_MEASURE, payload: {atMeasureIndex: i } });
            }
        };

        const getSystemStartClef = (systemIndex) => {
            const perRow = Math.max(1, Number(state.measuresPerRow) || 1);
            const startIdx = systemIndex * perRow;
            const events = state.clefEvents;

            let last = null;
            for (let k = 0; k < events.length; k++) {
                const e = events[k];
                if (e.atMeasureIndex <= startIdx) last = e;
                else break;
            }
            return last?.clef || state.defaultClef || 'treble';
        };

        const getEffectiveClefAtMeasure = (measureIndex) => {
            const events = state.clefEvents;
            let last = null;
            for (let k = 0; k < events.length; k++) {
                const e = events[k];
                if (e.atMeasureIndex <= measureIndex) last = e;
                else break;
            }
            return last?.clef || state.defaultClef || 'treble';
        };

        return {
            measures: state.measures,
            selectedMeasureId: state.selectedMeasureId,
            measuresPerRow: state.measuresPerRow,
            defaultClef: state.defaultClef,
            clefEvents: state.clefEvents,

            selectMeasure,
            clearSelection,
            addMeasure,
            insertBefore,
            removeMeasure,

            setMeasuresPerRow,
            setClefAtMeasureIndex,
            removeClefAtMeasureIndex,
            setClefAtSelectedMeasure,
            removeClefAtSelectedMeasure,

            idToIndex,

            getSystemStartClef,
            getEffectiveClefAtMeasure,
        };
    }, [state])
    
    
    return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
}
// -- Hook
