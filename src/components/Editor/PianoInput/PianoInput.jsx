import React from 'react';
import Keyboard from '../Keyboard/Keyboard';
import useSynth from '../Audio/useSynth';
import * as Tone from 'tone';



export default function PianoInput() {
    const { playNote } = useSynth();
    const handleKeyPress = async (note) =>{
        console.log('handleKeyPress triggered with:', note);
        await Tone.start();
        console.log('Playing note', note)
        playNote(note)
    }
    console.log('Rendering PianoInput, onKeyPress', handleKeyPress);

    return (
        <div className="piano-input">
            <Keyboard onKeyPress={handleKeyPress} />
        </div>

    )
}