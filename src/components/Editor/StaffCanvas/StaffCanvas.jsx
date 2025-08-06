import { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';
import { useScore } from '../../../contexts/ScoreContext';

import EditorHeader from '../EditorHeader/EditorHeader';
import Toolbar from '../Toolbar/Toolbar';

export default function StaffCanvas() {
    const containerRef = useRef();
    const { notes } = useScore();

    useEffect(() => {
        console.log('Rendering VexFlow with notes', notes);

        const VF = { Renderer, Stave, StaveNote, Voice, Formatter };

        const div = containerRef.current;
        if (!div) return ;

        div.innerHTML = '';

        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        renderer.resize(500, 200);
        const context = renderer.getContext();

        const stave = new VF.Stave(10, 40, 400);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(context).draw();

        const staveNotes = notes.map((note) => {

            if (!note.pitch || !note.duration) return null;

            try {
                const staveNote = new VF.StaveNote({
                    keys: [note.pitch],
                    duration: note.duration,
                });
                if (note.accidental) {
                    staveNote.addModifier(new VF.Accidental(note.accidental));
                }
    
                if (note.articulation) {
                    staveNote.addModifier(
                        new VF.Articulation(`a.${note.articulation}`).setPosition(VF.Modifier.Position.ABOVE)
                    );
                }
                return staveNote;
            } catch (err) {
                console.error('Error creating stave note:', err);
                return null;
            }
            
        })
        .filter((note) => note !== null);

        if (staveNotes.length > 0) {
            const voice = new VF.Voice({ num_beats: 4, beat_value: 4}).setStrict(false);
            voice.addTickables(staveNotes);

            new VF.Formatter().joinVoices([voice]).format([voice], 400);
            voice.draw(context, stave);
        } else {
            console.log('skipping formatting - no valid notes in staveNotes');
        }


        // let voice;

        // try {
        //     voice = new VF. Voice({ num_beats: 4, beat_value: 4 }).setStrict(false);
        //     voice.addTickables(staveNotes);
        // } catch (err) {
        //     console.error('Error formatting or drawing voice', err);
        // }
      
        // if (voice) {
        //     console.log('staveNotes', staveNotes);
        //     console.log('voice', voice)
        //     new VF.Formatter().joinVoices([voice]).format([voice], 400);
        //     voice.draw(context, stave);
        // }
        

    }, [notes]);

    return (
        <div className="staff__canvas">
            <div className="staffcanvas__composition-content">
                <div ref={containerRef}></div>
                <p className="staff__canvas-placeholder">This is your composition space</p>
            </div>
        </div>
    )
}