const byScore = new Map();
const listeners = new Map();
let idCounter = 1;
const now = () => new Date().toISOString();
const clone = (x) => JSON.parse(JSON.stringify(x));

function keyScore(scoreId) { return `score:${scoreId}`; }
function keyMeasure(scoreId, measureId) {return `measure:${scoreId}:${measureId}`; }

function emit(key) {
    const subs = listeners.get(key);
    if (!subs || subs.size === 0) return;

    const [type, scoreId, measureId] = key.split(':');
    const all = byScore.get(scoreId) || [];
    const payload = type === 'score' 
        ? all 
        : all.filter(c => c.anchor.measureId === measureId);

    subs.forEach(fn => fn(clone(payload)));
}

function subscribe(key, cb, initial) {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(cb);
    cb(clone(initial));
    return () => listeners.get(key)?.delete(cb);
}

const api = {
    subscribeToScore(scoreId, cb) {
        const key = keyScore(scoreId);
        const initial = byScore.get(scoreId) || [];
        return subscribe(key, cb, initial);
    },

    subscribeToMeasure(scoreId, measureId, cb) {
        const key = keyMeasure(scoreId, measureId);
        const initial = (byScore.get(scoreId) || []).filter(c => c.anchor.measureId === measureId);
        return subscribe(key, cb, initial);
    },

    async create(scoreId, { text, anchor, authorId = 'u-local', authorName = 'You '}) {
        // if (!anchor?.scoreId || !anchor?.measureId) throw new Error('Invalid anchor');
        if (!scoreId) throw new Error('Missing scoreId');
        if (!anchor?.measureId) throw new Error('Invalid anchor');

        const fullAnchor = { ...anchor, scoreId };

        const comment = {
            id: `c-${idCounter++}`,
            anchor: fullAnchor,
            scoreId,
            measureId: fullAnchor.measureId,
            text,
            authorId,
            authorName,
            createdAt: now(),
            clientCreatedAt: Date.now(),
            updatedAt: null,
            resolved: false,
            deletedAt: null,
        };
        const list = byScore.get(scoreId) || [];
        byScore.set(scoreId, [comment, ...list]);

        emit(keyScore(scoreId));
        emit(keyMeasure(scoreId, fullAnchor.measureId));
        return clone(comment);
    },

    async update(scoreId, id, patch) {
        const arr = byScore.get(scoreId) || [];
        const i = arr.findIndex(c => c.id === id);
        if (i === -1) return;

        arr[i] = { ...arr[i], ...patch, updatedAt: now() };
        byScore.set(scoreId, [...arr]);
        emit(keyScore(scoreId));
        emit(keyMeasure(scoreId, arr[i].anchor.measureId));

        // for (const [scoreId, arr] of byScore) {
        //     const i = arr.findIndex(c => c.id === id);
        //     if (i !== -1) {
        //         arr[i] = { ...arr[i], ...patch, updatedAt: now() };
        //         byScore.set(scoreId, [...arr]);
        //         emit(keyScore(scoreId));
        //         emit(keyMeasure(scoreId, arr[i].anchor.measureId));
        //     }
        // }
    },

    async softDelete(scoreId, id) {
        const arr = byScore.get(scoreId) || [];
        const i = arr.findIndex(c => c.id === id);
        if (i === -1) return;

        const mId = arr[i].anchor.measureId;
        const kept = arr.filter(c => c.id !== id);
        byScore.set(scoreId, kept);
        emit(keyScore(scoreId));
        emit(keyMeasure(scoreId, mId));


        // for (const [scoreId, arr] of byScore) {
        //     const i = arr.findIndex(c => c.id === id);
        //     if (i !== -1) {
        //         const mId = arr[i].anchor.measureId;
        //         const kept = arr.filter(c => c.id !== id);
        //         byScore.set(scoreId, kept);
        //         emit(keyScore(scoreId));
        //         emit(keyMeasure(scoreId, mId));
        //         return;
        //     }
        // }
    },
};

export default api;