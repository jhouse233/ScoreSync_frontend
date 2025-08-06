import React, { useState } from 'react';
import Keyboard from '../Keyboard/Keyboard';
import useSynth from '../Audio/useSynth';
import * as Tone from 'tone';
import { useScore } from '../../../contexts/ScoreContext';

import './PianoInput.css';

import downArrowIcon from '../../../assets/downarrow.svg';

export default function PianoInput({ onClose }) {
    const { playNote } = useSynth();
    const { addNote } = useScore();
    const [audioStarted, setAudioStarted] = useState(false);

    const startAudio = () => {
        Tone.start().then(() => {
            console.log('Tone.js AudioContext started')
            setAudioStarted(true);
        })
    }
    const handleKeyPress = async (note) => {


        const pitch = note
            .toLowerCase()
            .replace('#', '#')
            .replace(/(\d)/, '/$1');
        console.log('Piano pressed', pitch);
        addNote(pitch);
        playNote(note);
    }


    // const handleKeyClick = (note) => {
    //     const pitch = note
    //         .toLowerCase()
    //         .replace('#', '#')
    //         .replace(/(\d)/, '/$1');

    //     addNote(pitch);
    // }

    console.log('Rendering PianoInput, onKeyPress', handleKeyPress);

    return (
        <div className="piano-input">
            <button type='button' onClick={onClose} className="piano__close-button">
                <img src={downArrowIcon} alt="Close Button" className='piano__close-button-icon' />
            </button>

            <Keyboard onKeyPress={handleKeyPress} />
        </div>

    )
}