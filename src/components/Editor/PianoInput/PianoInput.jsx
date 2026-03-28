import React, { useState } from 'react';
import Keyboard from '../Keyboard/Keyboard';
import useSynth from '../Audio/useSynth';
import * as Tone from 'tone';
import { useScore } from '../../../contexts/ScoreContext';

import './PianoInput.css';

import downArrowIcon from '../../../assets/downarrow.svg';

export default function PianoInput({ onClose }) {
    const { playNote } = useSynth();
    // const { addNote } = useScore();
    const [audioStarted, setAudioStarted] = useState(false);

    const {
        selectedMeasureId,
        entry,
        addNote
    } = useScore();

    const startAudio = () => {
        Tone.start().then(() => {
            console.log('Tone.js AudioContext started')
            setAudioStarted(true);
        })
    }

    const formatPitchForVex = (raw, overrideAccidental) => {
        const m = raw.match(/^([A-Ga-g])(#{1}|b{1})?(\d)$/);
        if (!m) return raw.toLowerCase().replace(/(\d)/, '/$1');   
        const [, letter, keyAcc = '', octave] = m;
        const picked = overrideAccidental ?? keyAcc;
        const accOut = picked === 'n' ? '' : picked;
        return `${letter.toLowerCase()}${accOut}/${octave}`; 
    
    }

    const handleKeyPress = async (rawNote) => {
        if (!audioStarted) await startAudio();

        if (!selectedMeasureId || !entry?.duration) {
            playNote(rawNote);
            return;
        }

        const pitch = formatPitchForVex(rawNote, entry.accidental);
        addNote(pitch);
        playNote(rawNote);
    };

    // console.log('Rendering PianoInput, onKeyPress', handleKeyPress);

    return (
        <div className="piano-input">
            <button type='button' onClick={onClose} className="piano__close-button">
                <img src={downArrowIcon} alt="Close Button" className='piano__close-button-icon' />
            </button>

            <Keyboard onKeyPress={handleKeyPress} />
        </div>

    )
}