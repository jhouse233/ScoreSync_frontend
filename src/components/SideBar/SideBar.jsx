import React, { useEffect, useRef } from 'react';
import './Sidebar';

export default function Sidebar({ isOpen, onClose, title = 'Panel', children }) {
    const panelRef = useRef(null);
    const prevActiveRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            prevActiveRef.current = document.activeElement;
            setTimeout(() => {
                const el = panelRef.current?.querySelector(
                    'textarea, input, button, [tabindex]:not([tabindex="-1"])'
                );
                (el || panelRef.current)?.focus();
            }, 0);
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = '';
            prevActiveRef.current?.focus?.();
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="sidebar__overlay" onClick={onClose} aria-hidden='true'>
            <aside 
                className="sidebar__panel"
                role='dialog'
                aria-modal='true'
                aria-labelledby='sidebar__title'
                onClick={(e) => e.stopPropagation()}
                ref={panelRef}
                tabIndex={-1}
            >
                <header className="sidebar__header">
                    <h3 className="sidebar__title" id='sidebar__title'>{title}</h3>
                    <button className="sidebar__close-button" onClick={onClose} aria-label='Close'>X</button>
                </header>
                <div className="sidebar__content">
                    {children}
                </div>
            </aside>
        </div>
    );
}