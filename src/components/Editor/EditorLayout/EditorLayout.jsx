import React, { useState } from 'react';


import Toolbar from '../Toolbar/Toolbar';
import StaffCanvas from '../StaffCanvas/StaffCanvas';
import PianoInput from '../PianoInput/PianoInput';
import EditorHeader from '../EditorHeader/EditorHeader';
import EditorHotkeys from './EditorHotkeys';

export default function EditorLayout({ isKeyBoardVisible, toggleKeyboard }){
    const [zoom, setZoom] = useState(1)

    const clamp = (v, lo = 0.5, hi = 2) => Math.max(lo, Math.min(hi, v));
    const onZoomIn = () => setZoom(z => clamp(z + 0.1));
    const onZoomOut = () => setZoom(z => clamp(z - 0.1));
    const onZoomReset = () => setZoom(1)

    const KEYBOARD_HEIGHT = 280;

    return(
        <div 
            className='editor'

            // className={`editor ${isKeyboardVisible ? 'editor--kb' : ''}`}
            // style={{ '--kb-height': `${KEYBOARD_HEIGHT}px` }}
        >
            <EditorHotkeys />
            <EditorHeader />
            <Toolbar 
                isKeyBoardVisible={isKeyBoardVisible}
                toggleKeyboard={toggleKeyboard}
                zoom={zoom}
                onZoomIn={onZoomIn}
                onZoomOut={onZoomOut}
                onZoomReset={onZoomReset}
            />
            <StaffCanvas zoom={zoom} />
            {isKeyBoardVisible && (
                <div className="keyboard-overlay">
                    <div className="keyboard-scroll">
                        <PianoInput onClose={toggleKeyboard} />
                    </div>
                </div>
                // <div className="keyboard-overlay">
                //     <div className="keyboard-scroll">
                //         <PianoInput onClose={toggleKeyboard} />
                //     </div>
                // </div>
            )}
        </div> 
    )
}