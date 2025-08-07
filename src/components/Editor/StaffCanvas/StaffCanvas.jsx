import { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';
import { useScore } from '../../../contexts/ScoreContext';

import EditorHeader from '../EditorHeader/EditorHeader';
import Toolbar from '../Toolbar/Toolbar';

export default function StaffCanvas() {
    const containerRef = useRef();
    const { measures } = useScore();

    const MEASURES_PER_ROW = 4;
    const MEASURE_WIDTH = 420;
    const FIRST_MEASURE_WIDTH = MEASURE_WIDTH + 60;
    // const START_MEASURE_EXTRA_WIDTH = 50;
    const STAVE_HEIGHT = 140;
    const STAVE_PADDING_TOP = 60;

    useEffect(() => {
        console.log('Measures:', measures);

        const VF = { Renderer, Stave, StaveNote, Voice, Formatter };
        const div = containerRef.current;
        if (!div) return ;

        div.innerHTML = '';

        const rows = Math.ceil(measures.length / MEASURES_PER_ROW);
        const totalWidth = MEASURES_PER_ROW * MEASURE_WIDTH + 20;
        const totalHeight = rows * STAVE_HEIGHT + STAVE_PADDING_TOP;

        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        renderer.resize(totalWidth, totalHeight);
        const context = renderer.getContext();

        // let y = 40;
        function getStaveX(index, col) {
            const row = Math.floor(index / MEASURES_PER_ROW);
            const isFirstInRow = col === 0;

            if (row === 0 && col === 0) return 50;
            if (isFirstInRow) return 50;

            if (row === 0) {
                return 50 + FIRST_MEASURE_WIDTH + (col - 1) * MEASURE_WIDTH;
            }

            const extraOffSet = 50 + FIRST_MEASURE_WIDTH;

            const adjustedCol = (row === 0) ? col - 1 : col - 1;
            return extraOffSet + adjustedCol * MEASURE_WIDTH;
        }

        measures.forEach((measure, index) => {
            // console.log(`measure[${index}]`, measure)
            // const stave = new VF.Stave(100, y, 400);
            const isFirstMeasure = index === 0;
            const isFirstInRow = index % MEASURES_PER_ROW === 0;

            const row = Math.floor(index /MEASURES_PER_ROW);
            const col = index % MEASURES_PER_ROW;

            const width = isFirstMeasure ? FIRST_MEASURE_WIDTH : MEASURE_WIDTH;
            const x = getStaveX(index, col);
            const y = row * STAVE_HEIGHT + STAVE_PADDING_TOP;


            const stave = new VF. Stave(x, y, width - 20);

            if (isFirstMeasure && isFirstInRow) {
                stave.addClef('treble').addTimeSignature('4/4');
            } else if (isFirstInRow) {
                stave.addClef('treble')
            }

            stave.setContext(context).draw();

            const staveNotes = measure.map((note) => {
                try {
                    const staveNote = new VF.StaveNote({
                        keys: [note.pitch],
                        duration: note.duration || 'q',
                    });

                    if (note.accidental) {
                        staveNote.addModifier(new VF.Accidental(note.accidental));
                    }

                    if (note.articulation) {
                        staveNote.addModifier(
                            new VF.Articulation(`a.${note.articulation}`).setPosition(
                                VF.Modifier.Position.ABOVE
                            )
                        );
                    }
                    return staveNote;
                } catch (err) {
                    console.error('Error creating stave notes', err);
                    return null;
                }
            }).filter(Boolean);

            try {
                const voice = new VF.Voice({ num_beats: 4, beat_value: 4}).setStrict(false);
                if (staveNotes.length > 0) {
                    voice.addTickables(staveNotes);
                    new Formatter().joinVoices([voice]).format([voice], width - 60);
                    voice.draw(context, stave);
                }
            } catch (err) {
                console.error('Error formatting or drawing voice', err);
            }
        });

    }, [measures]);

    return (
        <div className="staff__canvas">
            <div className="staffcanvas__composition-content">
                <div ref={containerRef}></div>
            </div>
        </div>
    )
}