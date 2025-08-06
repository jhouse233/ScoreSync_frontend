import React from 'react';
import { ScoreProvider } from '../../../contexts/ScoreContext';

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
            </div>
        </ScoreProvider>
    )
}