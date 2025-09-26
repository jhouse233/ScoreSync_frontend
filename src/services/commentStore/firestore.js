import { db } from '../firebaseClient';
import {
    collection, query, where, orderBy, onSnapshot,
    addDoc, doc, updateDoc, serverTimestamp
} from 'firebase/firestore';


function col(scoreId) {
    return collection(db, 'scores', scoreId, 'comments');
}

const toComment = (snap) => ({ id: snap.id, ...snap.data() })

function subscribeToScore(scoreId, cb) {
    const q = query(col(scoreId), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
        const items = snap.docs.map(toComment).filter(c => !c.deletedAt);
        cb(items);
    });
    return unsub;
}

function subscribeToMeasure(scoreId, measureId, cb) {
    const q = query(
        col(scoreId),
        where('measureId', '==', measureId),
        orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
        const items = snap.docs.map(toComment).filter(c => !c.deletedAt);
        cb(items);
    });
    return unsub;
}

async function create({ text, anchor, authorId, authorName }) {
    const docRef = await addDoc(col(anchor.scoreId), {
        anchor,
        scoreId: anchor.scoreId,
        measureId: anchor.measureId,
        text,
        authorId: authorId || null,
        createdAt: serverTimestamp(),
        clientCreatedAt: Date.now(),
        updatedAt: null,
        resolved: false,
        deletedAt: null,
    });
    return { id: docRef.id, text, anchor, authorId, authorName };
}

async function update(scoreId, id, patch) {
    const ref = doc(db, 'scores', scoreId, 'comments', id);
    const data = { ...patch, updatedAt: serverTimestamp() };
    await updateDoc(ref, data);
    // throw new Error('Implement update in useComments with scoreId (see note below)');
}

async function softDelete(id) {
    const ref = doc(db, 'scores', scoreId, 'comments', id);
    await updateDoc(ref, { deletedAt: serverTimestamp() });
    // throw new Error('Implement softDelete in useComments with scoreId (see note below)');
}

export default {
    subscribeToScore,
    subscribeToMeasure,
    create,
    update,
    softDelete,
};

