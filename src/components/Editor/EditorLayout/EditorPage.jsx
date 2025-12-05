import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ScoreProvider from '../../../contexts/ScoreContext';
import EditorLayout from './EditorLayout';

const MIN_WIDTH = 768;

export default function EditorPage({ isKeyboardVisib, toggleKeyboard }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (window.innerWidth < MIN_WIDTH) {
            navigate('/desktop-only');
        }
    }, [navigate])

    return (
        <ScoreProvider>
            <EditorLayout 
                isKeyBoardVisible={isKeyboardVisib}
                toggleKeyboard={toggleKeyboard}
            />
        </ScoreProvider>
    );
}