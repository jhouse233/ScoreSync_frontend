import React from 'react';
import ScoreProvider from '../../../contexts/ScoreContext';

import Toolbar from '../Toolbar/Toolbar';
import StaffCanvas from '../StaffCanvas/StaffCanvas';
import PianoInput from '../PianoInput/PianoInput';
import EditorHeader from '../EditorHeader/EditorHeader';

export default function EditorLayout({ isKeyBoardVisible, toggleKeyboard }){
    return(
        <ScoreProvider>
            <div className="editor">
                <EditorHeader />
                <Toolbar 
                    isKeyBoardVisible={isKeyBoardVisible}
                    toggleKeyboard={toggleKeyboard}
                />
                <StaffCanvas />
                {isKeyBoardVisible && (
                    <div className="keyboard-overlay">
                        <div className="keyboard-scroll">
                            <PianoInput onClose={toggleKeyboard} />
                        </div>
                    </div>
        )}
            </div>
        </ScoreProvider>
    )
}