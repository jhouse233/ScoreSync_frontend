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

async function create(scoreId, { text, anchor, authorId = null, authorName = null }) {
    // const docRef = await addDoc(col(anchor.scoreId), {
    //     anchor,
    //     scoreId: anchor.scoreId,
    //     measureId: anchor.measureId,
    //     text,
    //     authorId: authorId || null,
    //     createdAt: serverTimestamp(),
    //     clientCreatedAt: Date.now(),
    //     updatedAt: null,
    //     resolved: false,
    //     deletedAt: null,
    // });
    // return { id: docRef.id, text, anchor, authorId, authorName };
    if (!scoreId) throw new Error('Missing scoreId');
    if (!anchor?.measureId) throw new Error('Invalid anchor (missing measureId)');

    if (anchor?.scoreId && anchor.scoreId !== scoreId) {
        throw new Error('anchor.scoreId does not match scoreId');
    }

    const payload = {
        anchor: { ...anchor, scoreId },
        scoreId,
        measureId: anchor.measureId,
        text,
        authorId,
        authorName,
        createdAt: serverTimestamp(),
        clientCreatedAt: Date.now(),
        updatedAt: null,
        resolved: false,
        deletedAt: null,
    };

    const docRef = await addDoc(col(scoreId), payload);
    return { id: docRef.id, ...payload };
}

async function update(scoreId, id, patch) {
    const ref = doc(db, 'scores', scoreId, 'comments', id);
    const data = { ...patch, updatedAt: serverTimestamp() };
    await updateDoc(ref, data);
    // throw new Error('Implement update in useComments with scoreId (see note below)');
}

async function softDelete(scoreId, id) {
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

