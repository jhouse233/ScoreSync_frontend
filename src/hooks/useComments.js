import { useCallback, useEffect, useMemo, useState } from 'react';
import store from '../services/commentStore';

export default function useComments(scoreId) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!scoreId) return;
        return store.subscribeToScore(scoreId, setComments);
    }, [scoreId]);

    const createComment = useCallback((input) => store.create(input), [])
    const updateComment = useCallback((id, patch) => store.update(id, patch), []);
    const deleteComment = useCallback((id) => store.softDelete(id), []);

    const countByMeasure = useMemo(() => {
        const map = new Map();
        for (const c of comments) {
            const m = c.anchor.measureId;
            map.set(m, (map.get(m) || 0) + 1);
        }
        return map;
    }, [comments]);

    return { comments, createComment, updateComment, deleteComment, countByMeasure };
}