import { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';

import EditorHeader from '../EditorHeader/EditorHeader';
import Toolbar from '../Toolbar/Toolbar';

export default function StaffCanvas() {
    const containerRef = useRef();

    useEffect(() => {
        const VF = { Renderer, Stave, StaveNote, Voice, Formatter };

        const div = containerRef.current;
        if (!div) return ;

        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        renderer.resize(500, 200);
        const context = renderer.getContext();

        const stave = new VF.Stave(10, 40, 400);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(context).draw();

        const notes = [
            new VF.StaveNote({ keys: ['c/4'], duration: 'q'}),
            new VF.StaveNote({ keys: ['d/4'], duration: 'q'}),
            new VF.StaveNote({ keys: ['e/4'], duration: 'q'}),
            new VF.StaveNote({ keys: ['f/4'], duration: 'q'}),
        ];

        const voice = new VF. Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(notes);

        new VF.Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(context, stave);
    }, []);

    return (
        <div className="staff__canvas">
            <div className="staffcanvas__composition-content">
                <div ref={containerRef}></div>
                <p className="staff__canvas-placeholder">This is your composition space</p>
            </div>
        </div>
    )
}