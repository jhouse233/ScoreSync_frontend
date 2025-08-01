import React, { useState } from 'react';

import Whitekey from './Whitekey/Whitekey';
import Blackkey from './BlackKey/Blackkey';
import './Keyboard.css';

const keys = [
    { note: 'C2', isSharp: false },
    { note: 'C#2', isSharp: true },
    { note: 'D2', isSharp: false },
    { note: 'D#2', isSharp: true },
    { note: 'E2', isSharp: false },
    { note: 'F2', isSharp: false },
    { note: 'F#2', isSharp: true },
    { note: 'G2', isSharp: false },
    { note: 'G#2', isSharp: true },
    { note: 'A2', isSharp: false },
    { note: 'A#2', isSharp: true },
    { note: 'B2', isSharp: false },
    { note: 'C3', isSharp: false },
    { note: 'C#3', isSharp: true },
    { note: 'D3', isSharp: false },
    { note: 'D#3', isSharp: true },
    { note: 'E3', isSharp: false },
    { note: 'F3', isSharp: false },
    { note: 'F#3', isSharp: true },
    { note: 'G3', isSharp: false },
    { note: 'G#3', isSharp: true },
    { note: 'A3', isSharp: false },
    { note: 'A#3', isSharp: true },
    { note: 'B3', isSharp: false },
    { note: 'C4', isSharp: false },
    { note: 'C#4', isSharp: true },
    { note: 'D4', isSharp: false },
    { note: 'D#4', isSharp: true },
    { note: 'E4', isSharp: false },
    { note: 'F4', isSharp: false },
    { note: 'F#4', isSharp: true },
    { note: 'G4', isSharp: false },
    { note: 'G#4', isSharp: true },
    { note: 'A4', isSharp: false },
    { note: 'A#4', isSharp: true },
    { note: 'B4', isSharp: false },
    { note: 'C5', isSharp: false },
    { note: 'C#5', isSharp: true },
    { note: 'D5', isSharp: false },
    { note: 'D#5', isSharp: true },
    { note: 'E5', isSharp: false },
    { note: 'F5', isSharp: false },
    { note: 'F#5', isSharp: true },
    { note: 'G5', isSharp: false },
    { note: 'G#5', isSharp: true },
    { note: 'A5', isSharp: false },
    { note: 'A#5', isSharp: true },
    { note: 'B5', isSharp: false },
]

export default function Keyboard({ onKeyPress }) {
    console.log('Keyboard received onKeyPress', onKeyPress);
    const [selectedKey, setSelectedKey] = useState(null);

    const handleKeyClick = (note) => {
        console.log('Key clicked', note);
        setSelectedKey(note);
        onKeyPress?.(note);
    }

    return (
        <div className="keyboard">
            <div className="white-keys">
                {keys
                    .filter(key => !key.isSharp)
                    .map((key) => (
                        <Whitekey 
                            key={key.note} 
                            note={key.note} 
                            onClick={handleKeyClick} 
                            isSelected={selectedKey === key.note}
                        />
                    ))}
            </div>
            <div className="black-keys">
                    {keys.map((key, index) => {
                        if (!key.isSharp) return null;

                        const [noteLetter, octave] = key.note.split('#');
                        const leftNote = `${noteLetter}${octave}`;
                        const whiteKeys = keys.filter(k => !k.isSharp);

                        const leftIndex = whiteKeys.findIndex(k => k.note === leftNote);
                        const rightIndex = leftIndex + 1;

                        if (leftIndex === -1 || rightIndex >= whiteKeys.length) return null;

                        const whiteKeyWidth = 123;
                        const blackKeyWidth = 15;
                        const leftOffset = (leftIndex * whiteKeyWidth + whiteKeyWidth * 0.75 - blackKeyWidth) / 2;

                        return (
                            <Blackkey
                                key={key.note}
                                note={key.note}
                                onClick={handleKeyClick}
                                style={{ left: `${leftOffset}px` }}
                                isSelected={selectedKey === key.note}
                            />
                        );
                    })}
            </div>
        </div>
    );
}