import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { nanoid } from 'nanoid';

const ScoreContext = createContext();

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 2.0;
export const ZOOM_STEP = 0.1;
export const ZOOM_DEFAULT = 1.0;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// --- State and Actions
const initialState = { 
    scoreId: 'local-demo',
    measures: [], 
    selectedMeasureId: null,
    measuresPerRow: 3,
    defaultClef: 'treble',
    clefEvents: [],
    entry: { duration: 'q', accidental: null},
    zoom: ZOOM_DEFAULT,
};

export const actions = {
    SET_CLEF_AT_MEASURE: 'SET_CLEF_AT_MEASURE',
    REMOVE_CLEF_AT_MEASURE: 'REMOVE_CLEF_AT_MEASURE',
    SET_MEASURES_PER_ROW: 'SET_MEASURES_PER_ROW',

    SET_ENTRY_DURATION: 'SET_ENTRY_DURATION',
    SET_ENTRY_ACCIDENTAL: 'SET_ENTRY_ACCIDENTAL',
    ADD_ITEM_AT_MEASURE: 'ADD_ITEM_AT_MEASURE',

    SET_TIME_SIGNATURE: 'SET_TIME_SIGNATURE',
}



// Duration and measure capacity
const UNIT = 64;
function parseTS(ts = '4/4') {
    const [n, d] = String(ts || '4/4').split('/').map(Number);
    return { n: n || 4, d: d || 4 };
}

function durToUnits(d) {
    if (!d) return 0;
    const s = String(d);

    const core = s.endsWith('r') ? s.slice(0, -1) : s;

    switch (core) {
        case 'w': return 64;
        case 'h': return 32;
        case 'q': return 16;
        default: {
            const n = Number(core);
            if (n && (UNIT % n === 0)) return UNIT / n;
            return 0;
        }
    }
}



function capacityUnits(ts) {
    const { n, d } = parseTS(ts);
    return n * (UNIT / d);
}

function usedUnits(noteItems = []) {
    return noteItems.reduce((sum, it) => sum + durToUnits(it.duration), 0);
}


// --- ID and Normalizer
const createId = () => nanoid();
const createBlankMeasure = () => ({ id: createId(), notes: [] });

const normalizeMeasures = (input = []) =>
    input.map((m) => {
        if (Array.isArray(m)) return { id: createId(), notes: m, timeSignature: '4/4' };
        const id = m?.id ?? createId();
        const notes = Array.isArray(m?.notes) ? m.notes : [];
        const timeSignature = (typeof m?.timeSignature === 'string' && m.timeSignature) ? m.timeSignature: '4/4';
        return { ...m, id, notes, timeSignature };
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
            // const m = createBlankMeasure();
            const prevTS = state.measures.at(-1)?.timeSignature ?? '4/4';
            const m = { id: createId(), notes: [], timeSignature: prevTS };
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

            // const m = createBlankMeasure();
            const inheritTS = 
                (idx > 0 ? state.measures[idx - 1]?.timeSignature : state.measures[idx]?.timeSignature)
                ?? '4/4';
            const m = { id: createId(), notes: [], timeSignature: inheritTS }

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

        case actions.SET_ENTRY_DURATION: {
            const dur = action.payload;
            return {
                ...state,
                entry: { ...state.entry, duration: dur}
            };
        }

        case actions.SET_ENTRY_ACCIDENTAL: {
            const acc = action.payload;
            return {
                ...state, entry: { ...state.entry, accidental: acc }
            };
        }

        case actions.ADD_ITEM_AT_MEASURE: {
            const { atMeasureIndex, item } = action.payload;
            if (
                typeof atMeasureIndex !== 'number' ||
                atMeasureIndex < 0 ||
                atMeasureIndex >= state.measures.length ||
                !item
            ) return state;

            const measure = state.measures[atMeasureIndex];
            if (!measure) return state;

            // Prevent overfilling
            const ts = measure.timeSignature || '4/4';
            const cap = capacityUnits(ts);
            const used = usedUnits(measure.notes || []);
            const inc = durToUnits(item.duration);

            if (inc <= 0) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`Blocked: unknown/zero duration "${item.duration}"`)
                }
                return state;
            }

            if (used + inc > cap) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(
                        `Blocked: adding ${item.duration} would exceed capacity in measure ${atMeasureIndex}` +
                        `(${used} + ${inc} > ${cap}) fro TS ${ts}`
                    );
                }
                return state;
            }

            const nextMeasures = state.measures.map((m, i) =>
                i === atMeasureIndex ? { ...m, notes: [...(m.notes || []), item] } : m
            );

            return { ...state, measures: nextMeasures };
        }

        case actions.SET_TIME_SIGNATURE: {
            const { measureId, timeSignature } = action.payload;
            return {
                ...state,
                measures: state.measures.map(m =>
                    m.id === measureId ? { ...m, timeSignature } : m
                ),
            };
        }

        case 'SET_ZOOM':
            return { ...state, zoom: clamp(action.payload, ZOOM_MIN, ZOOM_MAX) };
        case 'ZOOM_IN':
            return { ...state, zoom: clamp(state.zoom + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX) };
        case 'ZOOM_OUT':
            return { ...state, zoom: clamp(state.zoom - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX) };
        case 'ZOOM_RESET':
            return { ...state, zoom: ZOOM_DEFAULT };

        default: {
            if (process.env.NODE_ENV !== 'production') {
                throw new Error(`Unknown action: ${action.type}`);
            }

            return state;
        }
            
    }
}

// -- Provider
export default function ScoreProvider({ initialMeasures = [], scoreId = 'local-demo', children }) {
    const [state, dispatch] = useReducer(reducer, { ...initialState, scoreId } );

    useEffect(() => {
        if (state.measures.length === 0 && initialMeasures.length > 0) {
            dispatch({ type: 'INIT', payload: initialMeasures });
        }
    }, [initialMeasures, state.measures.length]);

    const setTimeSignatureAtSelectedMeasure = (sig) => {
        const id = state.selectedMeasureId;
        if (!id) return;
        dispatch({ type: actions.SET_TIME_SIGNATURE, payload: { measureId: id, timeSignature: sig } });
    };

    const value = useMemo(() => {
        const selectMeasure = (id) => dispatch({ type: 'SELECT', payload: id });
        const clearSelection = () => dispatch({ type: 'CLEAR' });
        const addMeasure = () => dispatch({ type: 'ADD' });
        const insertBefore = (targetId) => dispatch({ type: 'INSERT_BEFORE', payload: targetId });
        const removeMeasure = (id) => dispatch({ type: 'REMOVE', payload: id });

        const idToIndex = new Map(state.measures.map((m, i) => [m.id, i]));
        const selectedMeasureIndex = typeof state.selectedMeasureId === 'string'
            ? (idToIndex.get(state.selectedMeasureId) ?? -1)
            : -1;
        const selectedMeasure = selectedMeasureIndex >= 0
            ? state.measures[selectedMeasureIndex]
            : null;

        const getCurrentAnchor = () => {
            if (!state.selectedMeasureId) return null;
            return {
                scoreId: state.scoreId,
                measureId: state.selectedMeasureId,
                beat: null, 
            };
        };

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


        const setEntryDuration = (dur) =>
            dispatch({ type: actions.SET_ENTRY_DURATION, payload: dur });

        const setEntryAccidental = (acc) =>
            dispatch({ type: actions.SET_ENTRY_ACCIDENTAL, payload: acc });

        const addItemAtMeasureIndex = (atMeasureIndex, item) => 
            dispatch({ type: actions.ADD_ITEM_AT_MEASURE, payload: {atMeasureIndex, item } });

        const addNoteToSelected = (pitch, duration) => {
            const selId = state.selectedMeasureId;
            if (!selId) return;
            const i = idToIndex.get(selId);
            if (typeof i !== 'number') return;
            addItemAtMeasureIndex(i, { pitch, duration });
        }

        const addRestToSelected = (duration) => {
            const selId = state.selectedMeasureId;
            if (!selId) return;
            const i = idToIndex.get(selId);
            if (typeof i !== 'number') return;
            addItemAtMeasureIndex(i, { duration });
        }

        const addNote = (pitch) => {
            const selId = state.selectedMeasureId;
            const dur = state.entry?.duration || 'q';
            const accidental = state.entry?.accidental ?? null;
            if (!selId || !dur) return;

            const i = idToIndex.get(selId);
            if (typeof i !== 'number') return;

            // addItemAtMeasureIndex(i, { pitch, duration: dur });
            dispatch({
                type: actions.ADD_ITEM_AT_MEASURE,
                payload: { atMeasureIndex: i, item: { pitch, duration: dur, accidental} },
            });
        };

        const setZoom = (z) => dispatch({ type: 'SET_ZOOM', payload: z });
        const zoomIn = () => dispatch({ type: 'ZOOM_IN' });
        const zoomOut = () => dispatch({ type: 'ZOOM_OUT' });
        const resetZoom = () => dispatch({ type: 'ZOOM_RESET' });
 

        return {
            scoreId: state.scoreId,
            measures: state.measures,
            selectedMeasureId: state.selectedMeasureId,
            selectedMeasureIndex,
            selectedMeasure,
            measuresPerRow: state.measuresPerRow,
            defaultClef: state.defaultClef,
            clefEvents: state.clefEvents,
            entry: state.entry,
            getCurrentAnchor,

            selectMeasure, clearSelection, addMeasure,
            insertBefore, removeMeasure,

            setMeasuresPerRow, setClefAtMeasureIndex,
            removeClefAtMeasureIndex, setClefAtSelectedMeasure, removeClefAtSelectedMeasure,

            setEntryDuration, setEntryAccidental,
            addItemAtMeasureIndex, addNoteToSelected, addRestToSelected,
            addNote,

            idToIndex,

            getSystemStartClef,
            getEffectiveClefAtMeasure,

            setTimeSignatureAtSelectedMeasure,

            zoom: state.zoom, setZoom, zoomIn, zoomOut, resetZoom,
        };
    }, [state])
    
    
    return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
}
// -- Hook
export function useScore() {
    const context = useContext(ScoreContext);
    if (!context) {
      throw new Error('useScore must be used within a ScoreProvider');
    }
    return context;
}