import { useRef } from 'react';
import * as Tone from 'tone';


// const synth = new Tone.Synth().toDestination();
// await Tone.start()
// synth.triggerAttackRelease('C4', '8n');

export default function useSynth() {
    const synthRef = useRef(null);
    if (!synthRef.current) {
        synthRef.current = new Tone.Synth({volume: 0}).toDestination();
    }

    const playNote = (note, duration = '8n') => {
        console.log('Synth playing', note, 'at time');
        try {
            synthRef.current.triggerAttackRelease(note, duration)
        } catch (err) {
            console.error('Error triggering not:', err)
        }
    };

    return { playNote };
}