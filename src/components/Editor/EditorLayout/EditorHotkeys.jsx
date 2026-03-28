import { useEffect } from 'react';
import { useScore } from '../../../contexts/ScoreContext';

export default function EditorHotkeys() {
    const {
        selectedMeasureId,
        addMeasure,
        insertBefore,
        removeMeasure,
        clearSelection,
    } = useScore();

    useEffect(() => {
        const onKey = (e) => {
            const t = e.target;
            if (t && (t.tagname === 'INPUT' || t.tagName === 'TEXTAREA' ||t.isContentEditable)) {
                return;
            }

            if (e.metaKey || e.crtrlKey || e.altKey) return;

            switch (e.key) {
                case 'Delete':
                case 'Backspace':
                    if (selectedMeasureId) {
                        e.preventDefault();
                        removeMeasure(selectedMeasureId);
                        
                    }
                    break;
                case 'a':
                case 'A':
                    e.preventDefault();
                    addMeasure();
                    break;
                case 'i':
                case 'I':
                    if (selectedMeasureId) {
                        e.preventDefault();
                        insertBefore(selectedMeasureId);
                    }
                    break;
                case 'Escape':
                    clearSelection();
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedMeasureId, addMeasure, insertBefore, removeMeasure, clearSelection]);

    return null;
}