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
    const payload = type === 'sccore' ? all : all.filter(c => c.anchor.measureId === measureId);

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

    async create({ text, anchor, authorId = 'u-local', authorName = 'You '}) {
        if (!anchor?.scoreId || !anchor?.measureId) throw new Error('Invalid anchor');
        const comment = {
            id: `c-${idCounter++}`,
            anchor,
            text,
            authorId,
            authorName,
            createdAt: now(),
            updatedAt: null,
            resolved: false,
            deletedAt: null,
        };
        const list = byScore.get(anchor.scoreId) || [];
        byScore.set(anchor.scoreId, [comment, ...list]);

        emit(keyScore(anchor.scoreId));
        emit(keyMeasure(anchor.scoreId, anchor.measureId));
        return clone(comment);
    },

    async update(id, patch) {
        for (const [scoreId, arr] of byScore) {
            const i = arr.findIndex(c => c.id === id);
            if (i !== -1) {
                arr[i] = { ...arr[i], ...patch, updatedAt: now() };
                byScore.set(scoreId, [...arr]);
                emit(keyScore(scoreId));
                emit(keyMeasure(scoreId, arr[i].anchor.measureId));
            }
        }
    },

    async softDelete(id) {
        for (const [scoreId, arr] of byScore) {
            const i = arr.findIndex(c => c.id === id);
            if (i !== -1) {
                const mId = arr[i].anchor.measureId;
                const kept = arr.filter(c => c.id !== id);
                byScore.set(scoreId, kept);
                emit(keyScore(scoreId));
                emit(keyMeasure(scoreId, mId));
                return;
            }
        }
    },
};

export default api;