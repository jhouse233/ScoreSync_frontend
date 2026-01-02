import { useMemo, useState, useEffect } from 'react';
import { useScore } from '../../../contexts/ScoreContext';
import useComments from '../../../hooks/useComments';
import Sidebar from '../../Sidebar/Sidebar.jsx'

import './CommentSidebar.css';

import { bestEffortDate, formatDateSafe, isEdited } from '../../../utils/dateSafe';

export default function CommentSidebar( { isOpen, onClose }) {
    const { scoreId, getCurrentAnchor } = useScore();
    const { comments, createComment, updateComment, deleteComment } = useComments(scoreId);
    const [text, setText] = useState('');
    const anchor = getCurrentAnchor();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!anchor || !text.trim()) return;

        createComment({
            text: text.trim(),
            anchor,
        });

        setText('');
    }

    const measureId = anchor?.measureId;

    const list = useMemo(() => {
        if (!measureId) return comments;
        return comments.filter(c => c.anchor.measureId === measureId);
    }, [comments, measureId]);

    useEffect(() => {
        setText('');
    }, [measureId]);

    return (
        <Sidebar isOpen={isOpen} onClose={onClose} title='Notes'>
            {/* <form 
                className="csb__form"
                placeholder={anchor ? `Add a note for ${anchor.measureId}...` : 'Select a measure to comment...'}
                disabled={!anchor}
                rows={3}
            >
                <button type='Submit' disabled={!anchor}>Save</button>
            </form> */}
            <form className="csb__form" onSubmit={handleSubmit}>
                <textarea 
                    className='csb__input' 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder={
                        measureId
                            ? `Add a note for ${measureId}...`
                            : 'Select a measure to comment...'
                    }
                    disabled={!anchor}
                    rows={3}
                />

                <button
                    type='submit'
                    disabled={!anchor || !text.trim()}
                >
                    Save
                </button>

                
            </form>

            <ul className="csb__list">
                {list.map(c => (
                    <li className="csb__item" key={c.id}>
                        {/* <div className="csb__meta">
                            {c.anchor.measureId} {c.authorName} {new Date(c.createdAt).toLocaleString()}
                        </div> */}
                        <div className="csb__meta">
                            {c.anchor.measureId} {c.authorName} {
                                formatDateSafe(bestEffortDate(c.createdAt, c.clientCreatedAt))
                            }
                            {isEdited(c.createdAt, c.updatedAt) && <span className='csb__edited'>Edited</span>}
                        </div>
                        <div className="csb__text">{c.text}</div>
                        <div className="csb__actions">
                            <button
                                type='button'
                                onClick={() => {
                                    const next = prompt('Edit comment', c.text)
                                    // if (next != null) updateComment(c.id, { text: next.trim() });
                                    if (next == null) return;
                                    const trimmed = next.trim();
                                    if(!trimmed) return;
                                    updateComment(c.id, { text: trimmed });
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