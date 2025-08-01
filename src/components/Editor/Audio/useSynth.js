import { useRef } from 'react';
import * as Tone from 'tone';

// Create a synth and connect it to the main output (speakers)
const synth = new Tone.Synth().toDestination();

export default function useSynth() {
    const synthRef = useRef(null);
    if (!synthRef.current) {
        synthRef.current = new Tone.Synth().toDestination();
    }

    const playNote = (note, duration = '8n') => {
        synthRef.current.triggerAttackRelease(note, duration)
    };

    return { playNote };
}