import React, { useState } from 'react';
import Keyboard from '../Keyboard/Keyboard';
import useSynth from '../Audio/useSynth';
import * as Tone from 'tone';



export default function PianoInput({ onClose }) {
    const { playNote } = useSynth();
    const [audioStarted, setAudioStarted] = useState(false);

    const startAudio = () => {
        Tone.start().then(() => {
            console.log('Tone.js AudioContext started')
            setAudioStarted(true);
        })
    }
    const handleKeyPress = async (note) => {
        playNote(note);
    }

    console.log('Rendering PianoInput, onKeyPress', handleKeyPress);

    return (
        <div className="piano-input">
            <button type='button' onClick={onClose} className="keyboard__close-button">
                X
            </button>
            {/* {!audioStarted ? (
                // <button onClick={startAudio}>Start Audio</button>
            ) : (
                <Keyboard onKeyPress={handleKeyPress} />
            )} */}
            <Keyboard onKeyPress={handleKeyPress} />
            
        </div>

    )
}