import { useMemo } from 'react';
import { useScore } from '../../../contexts/ScoreContext';
import useComments from '../../../hooks/useComments';
import Sidebar from '../../Sidebar/Sidebar';
import './CommentsSidebar.css';

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
                        <div className="csb__meta"></div>
                    </li>
                ))}
            </ul>
        </Sidebar>
    )
}