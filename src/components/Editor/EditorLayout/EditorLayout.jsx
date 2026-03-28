import React, { useState, useCallback } from 'react';


import Toolbar from '../Toolbar/Toolbar';
import StaffCanvas from '../StaffCanvas/StaffCanvas';
import PianoInput from '../PianoInput/PianoInput';
import EditorHeader from '../EditorHeader/EditorHeader';
import EditorHotkeys from './EditorHotkeys';
import CommentSidebar from '../Comments/CommentsSidebar';

export default function EditorLayout({ isKeyBoardVisible, toggleKeyboard }){
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const openComments = () => setIsCommentsOpen(true);
    const closeComments = () => setIsCommentsOpen(false)

    return(
        <div 
            className='editor'


        >
            <EditorHotkeys />
            <EditorHeader />
            <Toolbar 
                isKeyBoardVisible={isKeyBoardVisible}
                toggleKeyboard={toggleKeyboard}
                onToggleComments={openComments}

            />
            <CommentSidebar isOpen={isCommentsOpen} onClose={closeComments} />
            <StaffCanvas onOpenComments={openComments}/>
            {isKeyBoardVisible && (
                <div className="keyboard-overlay">
                    <div className="keyboard-scroll">
                        <PianoInput onClose={toggleKeyboard} />
                    </div>
                </div>

            )}
        </div> 
    )
}