import { useMemo } from 'react';
import { useScore } from '../../../contexts/ScoreContext';
import useComments from '../../../hooks/useComments';
import Sidebar from '../../Sidebar/Sidebar.jsx'
import './CommentSidebar.css';

import { bestEffortDate, formatDateSafe, isEdited } from '../../../utils/dateSafe';

export default function CommentSidebar( { isOpen, onClose }) {
    const { scoreId, getCurrentAnchor } = useScore();
    const { comments, createComment, updateComment, deleteComment } = useComments(scoreId);
    const anchor = getCurrentAnchor();

    const list = useMemo(() => {
        if (!anchor?.measureId) return comments;
        return comments.filter(c => c.anchor.measureId === anchor.measureId);
    }, [comments, anchor]);

    return (
        <Sidebar isOpen={isOpen} onClose={onClose} title='Notes'>
            <form 
                className="csb__form"
                placeholder={anchor ? `Add a note for ${anchor.measureId}...` : 'Select a measure to comment...'}
                disabled={!anchor}
                rows={3}
            >
                <button type='Submit' disabled={!anchor}>Save</button>
            </form>

            <ul className="csb__list">
                {list.map(c => (
                    <li className="csb__item" key={c.id}>
                        <div className="csb__meta">
                            {c.anchor.measureId} {c.authorName} {new Date(c.createdAt).toLocaleString()}
                        </div>
                        <div className="csb__meta">
                            {c.anchor.measureId} {c.authorName} {
                                formatDateSafe(bestEffertDate(c.createdAt, c.clientCreateAt))
                            }
                            {isEdited(c.createdAt, c.updatedAt) && <span className='csb__edited'>Edited</span>}
                        </div>
                        <div className="csb__text">{c.text}</div>
                        <div className="csb__actions">
                            <button
                                type='button'
                                onClick={() => {
                                    const next = prompt('Edit comment', c.text)
                                    if (next != null) updateComent(c.id, { text: next.trim() });
                                }}
                            >
                                Edit
                            </button>
                            <button type='button' onClick={() => deleteComment(c.id)}>Delete</button>
                        </div>
                    </li>
                ))}
                {list.length === 0 && (
                    <li className="csb__empty">No notes yet. Select a measure and add one</li>
                )}
            </ul>
        </Sidebar>
    )
}