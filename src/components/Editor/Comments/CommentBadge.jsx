import React from 'react';
import './CommentBadge.css';

export default function CommentBadge({ count = 0, onClick }) {
    if (!count) return null;
    const label = `${count} note${count === 1 ? '' : 's'} on this measure. Open notes.`;
    return (
        <button 
            className="comment-badge"
            type='button'
            onClick={onClick}
            title={label}
            aria-label={label}
        >
            {count}
        </button>
    );
}