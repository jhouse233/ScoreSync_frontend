import { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Barline, Accidental, Articulation } from 'vexflow';
import { useScore } from '../../../contexts/ScoreContext';

import EditorHeader from '../EditorHeader/EditorHeader';
import Toolbar from '../Toolbar/Toolbar';

export default function StaffCanvas() {
    const containerRef = useRef();
    const rendererRef = useRef(null);
    const contextRef = useRef(null);
    const { measures } = useScore();

    // Layout Constants
    const MEASURES_PER_ROW = 3;
    const MEASURE_WIDTH = 400;
    const FIRST_MEASURE_WIDTH = MEASURE_WIDTH;
    const START_X = 60;
    const STAVE_HEIGHT = 140;
    const STAVE_PADDING_TOP = 60;

    function formatPitch(pitch){
        if (pitch.includes('/')) return pitch;

        const match = pitch.toLowerCase().match(/^([a-g])([#b]?)(\d)$/);
        if (!match) {
            console.warn('Invalid pitch format:', pitch)
            return pitch;
        }
        const [, note, accidental, octave] = match;
        return accidental ? `${note}${accidental}/${octave}` : `${note}/${octave}`
    }

    useEffect(() => {
        if (!containerRef.current || rendererRef.current) return;
        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
        rendererRef.current = renderer;
        contextRef.current = renderer.getContext();
    }, []);


    useEffect(() => {
        const renderer = rendererRef.current;
        const context = contextRef.current;
        const div = containerRef.current;
        if (!renderer || ! context || !div) return ;

        const VF = { Renderer, Stave, StaveNote, Voice, Formatter, Barline, Accidental, Articulation };
        // div.innerHTML = '';

        const rows = Math.ceil(measures.length / MEASURES_PER_ROW);
        const totalWidth = START_X + FIRST_MEASURE_WIDTH + (MEASURES_PER_ROW - 1) * MEASURE_WIDTH + START_X;
        const totalHeight = rows * STAVE_HEIGHT + STAVE_PADDING_TOP;

        renderer.resize(totalWidth, totalHeight);

        const svgRoot = context.svg || div.querySelector('svg');
        if (svgRoot) {
            while (svgRoot.firstChild) svgRoot.removeChild(svgRoot.firstChild);
        }

        // const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        // renderer.resize(totalWidth, totalHeight);
        // const context = renderer.getContext();
        // context.clear();
        // context.setFont('Arial', 24)

        // Positioning Logic
        function getStaveX(index) {
            const col = index % MEASURES_PER_ROW;            
            if (col === 0) return START_X;
            return START_X + FIRST_MEASURE_WIDTH + (col - 1) * MEASURE_WIDTH;
        }

        // Draw Measures

        measures.forEach((measure, index) => {
            const isFirstMeasure = index === 0;
            const isFirstInRow = index % MEASURES_PER_ROW === 0;

            const row = Math.floor(index / MEASURES_PER_ROW);
            const col = index % MEASURES_PER_ROW;

            const width = isFirstMeasure ? FIRST_MEASURE_WIDTH : MEASURE_WIDTH;
            const x = getStaveX(index);
            const y = row * STAVE_HEIGHT + STAVE_PADDING_TOP;
            const stave = new VF. Stave(x, y, width);

            if (index === measures.length - 1) {
                stave.setEndBarType(VF.Barline.type.END)
            } else {
                stave.setEndBarType(VF.Barline.type.SINGLE);
            }


            if (isFirstMeasure && isFirstInRow) {
                stave.addClef('treble').addTimeSignature('4/4');
            } else if (isFirstInRow) {
                stave.addClef('treble')
            }

            stave.setContext(context).draw();


            const staveNotes = measure.map((note) => {
                try {
                    // Temporary code
                    // console.log( 'Note', note.pitch, 'Accidental', note.accidental);

                    // const [noteLetter, octave] = note.pitch.split(/(\d+)/);
                    // const keyFormatted = noteLetter.toLowerCase().replace('#', '#/') + '/' + octave;

                    // const staveNote = new VF.StaveNote({
                    //     keys: [keyFormatted],
                    //     duration: note.duration || 'q'
                    // });

                    // if (note.accidental) {
                    //     staveNote.addModifier(0, new VF.Accidental(note.accidental))
                    // }
                    console.log('Rendering note', note.pitch, 'Accidental', note.accidental)

                    // const formatPitch = (pitch) => {
                    //     return pitch 
                    //         .toLowerCase()
                    //         .replace(/^([a-g])#(\d)$/, '$1#/$2')
                    //         .replace(/^([a-g])b(\d)$/, '$1b/$2');
                    // }





                    const staveNote = new VF.StaveNote({
                        // keys: [note.pitch],
                        // keys: [note.pitch.toLowerCase().replace('#', '#/').replace('b', 'b/')],
                        keys: [formatPitch(note.pitch)],
                        duration: note.duration || 'q',
                    });

                    if (note.accidental) {
                        // staveNote.addModifier(new VF.Accidental(note.accidental));
                        staveNote.addModifier(new VF.Accidental(note.accidental),0);
                    }

                    if (note.articulation) {
                        staveNote.addModifier( 
                            new VF.Articulation(`a.${note.articulation}`).setPosition(
                                VF.Modifier.Position.ABOVE
                            ),
                            0
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