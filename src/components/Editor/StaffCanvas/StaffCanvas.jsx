import React from 'react';

import EditorHeader from '../EditorHeader/EditorHeader';
import Toolbar from '../Toolbar/Toolbar';

export default function StaffCanvas({ isKeyBoardVisible, toggleKeyboard }) {

    return (
        <div className="staff__canvas">
            <EditorHeader />
            <Toolbar 
                isKeyBoardVisible={isKeyBoardVisible}
                toggleKeyboard={toggleKeyboard}
            />
            <div className="staffcanvas__composition-content">
                <p className="staff__canvas-placeholder">This is your composition space</p>
            </div>
        </div>
    )
}