import { useEffect, useRef, useState, useMemo } from 'react';
import { layout as computePageLayout, DEFAULT_LAYOUT } from '../../../utils/pageLayout';
import { Renderer, Stave, StaveNote, Voice, Formatter, ClefNote, Accidental, Beam, Fraction } from 'vexflow';
import { useScore } from '../../../contexts/ScoreContext';
import CommentBadge from '../Comments/CommentBadge';
import useComments from '../../../hooks/useComments';


import './StaffCanvas.css'

export default function StaffCanvas({ onOpenComments }) {

    const PAGE_GAP = 24;
    const LAYOUT = { ...DEFAULT_LAYOUT, maxMeasuresPerSystem: 4};

    const HIL_PAD_X = 1;
    const HIL_PAD_Y = 40;
    const HIL_RADIUS = 6;
   
    const {
        scoreId,
        measures,
        selectedMeasureId,
        selectMeasure,
        clearSelection,
        // measuresPerRow,
        clefEvents,
        getSystemStartClef,
        getEffectiveClefAtMeasure,
    } = useScore();

    const { countByMeasure } = useComments(scoreId);
    

    const isSelected = (id) => selectedMeasureId === id;

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

    function parseTimeSig(ts = '4/4') {
        const [num, denom] = (ts || '4/4').split('/').map(n => parseInt(n, 10));
        return { num_beats: num || 4, beat_value: denom || 4 };
    }

    // Beam notes
    function beamGroupsForTS(ts = '4/4') {
        const [nRaw, dRaw] = String(ts).split('/');
        const n = Number(nRaw) || 4;
        const d = Number(dRaw) || 4;
        const groups = [];
        const add = (num, den, count) => { for (let i = 0; i < count; i++) groups.push(new Fraction(num, den)) };

        if (d === 8 && n % 3 === 0) {
            add(3, 8, n / 3);
            return groups;
        }

        if (d === 4) { add(1, 4, n); return groups; }
        if (d === 2) { add(1, 2, n); return groups; }
        if (d === 8) { add(1, 8, n); return groups; }

        add(1, d, n);
        return groups;
    }


    // Layout geometry for every measure
    // const layout = useMemo(() => {
    //     return measures.map((m, i) => {
    //         const row = Math.floor(i / measuresPerRow);
    //         const col = i % measuresPerRow;
    //         const x = START_X + col * MEASURE_WIDTH;
    //         const y = STAVE_PADDING_TOP + row * STAVE_Y_GAP;
    //         const width = col === 0 ? FIRST_MEASURE_WIDTH : MEASURE_WIDTH;
    //         const height = STAVE_HEIGHT;
    //         return { id: m.id ?? `m-${i}`, i, row, col, x, y, width, height};
    //     });
    // }, [measures, measuresPerRow]);

    const { pages, metrics  } = useMemo(
        () => computePageLayout(measures ?? [], LAYOUT),
        [measures]
    );

    const frames = useMemo(() => {
        const out = [];
        let globalI = 0;
        pages.forEach((page, pi) => {
            const pageYOffset = pi * (DEFAULT_LAYOUT.pageHeight + PAGE_GAP);
            page.systems.forEach((sys, si) => {
                const systemY =
                    pageYOffset +
                    DEFAULT_LAYOUT.marginTop +
                    si * (DEFAULT_LAYOUT.systemHeight + DEFAULT_LAYOUT.systemGap);

                sys.measures.forEach((m, mi) => {
                    const i = globalI++;
                    const x = DEFAULT_LAYOUT.marginLeft + m.x;
                    const y = systemY;
                    out.push({
                        id: m.id ?? `m-${out.length}`,
                        i,
                        x,
                        y,
                        width: m.width,
                        height: DEFAULT_LAYOUT.systemHeight,
                        isSystemStart: mi === 0,
                        systemIndex: si + pi * metrics.systemPerPage,
                        pageIndex: pi,
                    });
                });
            });
        });
        return out;
    }, [pages, metrics])

    // canvas size derived from layout
    // const totalRows = Math.max(1, Math.ceil(measures.length / measuresPerRow));
    // const svgWidth = START_X + measuresPerRow * MEASURE_WIDTH + STAVE_PADDING_RIGHT;
    // const svgHeight = STAVE_PADDING_TOP + totalRows * STAVE_Y_GAP;
    const svgWidth = DEFAULT_LAYOUT.pageWidth;
    const svgHeight = Math.max(
        DEFAULT_LAYOUT.pageHeight,
        pages.length 
            ? pages.length * DEFAULT_LAYOUT.pageHeight + (pages.length - 1) * PAGE_GAP
            : DEFAULT_LAYOUT.pageHeight
    );

    // VexFlow renderer
    const hostRef = useRef(null);
    const rendererRef = useRef(null);

    const isRestDuration = (dur) => typeof dur === 'string' && /r$/.test(dur);
    const defaultRestKeyForClef = (clef) => {
        if (clef === 'bass') return 'd/3';
        if (clef === 'alto') return 'c/4';
        if (clef === 'tenor') return 'a/3';
        return 'b/4';
    }

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        if (!rendererRef.current) {
            rendererRef.current = new Renderer(host, Renderer.Backends.SVG);
        }

        const renderer = rendererRef.current;
        renderer.resize(svgWidth, svgHeight);
        const ctx = renderer.getContext();

        const svgEl = ctx?.svg ?? host.querySelector('svg');
        if (svgEl?.replaceChildren) {
            svgEl.replaceChildren();
        } else {
            host.replaceChildren()
        }

        // layout.forEach(({ i, row, col, x, y, width }) => {
        frames.forEach(({ i, systemIndex, isSystemStart, x, y, width }) => {
            const stave = new Stave(x, y, width);

            const thisTS = 
                measures[i]?.timeSignature
                    ?? (i > 0 ? (measures[i - 1]?.timeSignature || '4/4') : '4/4');
            const prevTS = i > 0 ? (measures[i - 1]?.timeSignature || '4/4') : null;
            // const showTimeSig = (col === 0) || (prevTS && prevTS !== thisTS);
            // const showTimeSig = (i === 0) || (i > 0 && prevTS !== thisTS);
            const showTimeSig = (i === 0) || (i > 0 && prevTS !== thisTS);

            // if (col === 0) {
            //     const systemClef = getSystemStartClef(row);
            //     stave.addClef(systemClef);
            // }

            if (isSystemStart) {
                const systemClef = getSystemStartClef(systemIndex);
                stave.addClef(systemClef);
            }

            if (showTimeSig) {
                stave.addTimeSignature(thisTS);
            }

            stave.setContext(ctx).draw();

            const tickables =[];
            const beamables = [];
    
            const eventHere = clefEvents.find(e => e.atMeasureIndex === i);
            if (eventHere && !isSystemStart) {
                tickables.push(new ClefNote(eventHere.clef, 'small'));
            }

            const effectiveClef = getEffectiveClefAtMeasure(i);
            const items = Array.isArray(measures[i]?.notes) ? measures[i].notes : [];

            for (const n of items) {
                const duration = n?.duration;
                if (!duration) continue;

                if (isRestDuration(duration)) {
                    const restKey = n.restKey || defaultRestKeyForClef(effectiveClef);
                    const vfRest = new StaveNote({
                        keys: [restKey],
                        duration,
                    });
                    tickables.push(vfRest);
                } else {
                    const keys = Array.isArray(n.keys)
                    ? n.keys.map(formatPitch)
                    : [formatPitch(n.pitch || 'c/4')];

                    const vfNote = new StaveNote({
                        keys,
                        duration,
                        clef: effectiveClef,
                    });

                    if (n.accidental) {
                        // vfNote.addAccidental(0, new Accidental(n.accidental));
                        vfNote.addModifier(new Accidental(n.accidental), 0);
                    } else {
                        keys.forEach((k, idx) => {
                            const m = k.match(/^[a-g](b|#)/i);
                            if (m) vfNote.addModifier(new Accidental(m[1]));
                        })
                    }


                    tickables.push(vfNote);

                    const base = String(duration).replace(/r$/, '');
                    if (['8', '16', '32', '64'].some(b => base.startsWith(b))) {
                        beamables.push(vfNote);
                    }
                }
            }

            if (tickables.length > 0) {
                const { num_beats, beat_value } = parseTimeSig(thisTS);
                const voice = new Voice({ num_beats, beat_value })
                    .setMode(Voice.Mode.SOFT)
                    .addTickables(tickables);

                // const beams = Beam.generateBeams(beamables, {
                //     groups: beamGroupsForTS(thisTS),
                //     beam_rests: false,
                //     maintain_stem_diretions: false,
                // });
                const beams = Beam.generateBeams(beamables, {
                    groups: beamGroupsForTS(thisTS),
                    beam_rests: false,
                    maintain_stem_directions: false,
                });

                new Formatter().joinVoices([voice]).formatToStave([voice], stave);
                voice.draw(ctx, stave);

                
                beams.forEach(b => b.setContext(ctx).draw());
            }

        });

        return () => {
            const svg = ctx?.svg ?? host.querySelector('svg');
            svg?.replaceChildren?.();
        }
    }, [frames, svgWidth, svgHeight, clefEvents, getSystemStartClef, getEffectiveClefAtMeasure, measures]);

    const handleBgClick = (e) => {e.preventDefault(); clearSelection();}
    const handleDbClick = (id) => {
        console.log('Doubleclick measure', id);
        selectMeasure(id);
    }

    return (
        <div className="staff__canvas">
            <div className="editor-viewport">

                <div className="page__stack-outer" style={{ width: DEFAULT_LAYOUT.pageWidth }}>
                    <div className="page__stack-inner">
                        <div ref={hostRef} className='staffcanvas__vf'/>
                        <svg 
                            className="staffcanvas__overlay"
                            width={svgWidth}
                            height={svgHeight}
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        
                        >
                            <rect 
                                x='0' y='0' width={svgWidth} 
                                height={svgHeight} 
                                fill='transparent' 
                                onMouseDown={handleBgClick}
                            />

                            {frames.map(({ id, x, y, width, height }) => {
                                const selected = isSelected(id);
                                return (
                                    <g key={id}>
                                        {selected && (
                                            <rect 
                                                x={x + HIL_PAD_X}
                                                y={y + HIL_PAD_Y}
                                                width={width - 2 * HIL_PAD_X}
                                                height={height - 2.5 * HIL_PAD_Y}
                                                rx={HIL_RADIUS}
                                                ry={HIL_RADIUS}
                                                className='staffcanvas__highlight'
                                                strokeWidth='3'
                                                pointerEvents='none'
                                            />
                                        )}
                                        <rect
                                            x={x}
                                            y={y}
                                            width={width}
                                            height={height}
                                            fill='transparent'
                                            onDoubleClick={(e) =>  {e.preventDefault(); handleDbClick(id)}}
                                        />
                                    </g>
                                );
                            })}        
                        </svg>
                        <div 
                            className="staffcanvas__badgeOverlay"
                            style={{ width: svgWidth, height: svgHeight}}
                        >
                            {frames.map(({ id, x, y, width }) => {
                                const count = countByMeasure.get(id) || 0;
                                if (!count) return null;
                                const top = y + 6;
                                const left = x + width - 24;
                                return (
                                    <CommentBadge 
                                        key={`badge-${id}`}
                                        count={count}
                                        style={{ position: 'absolute', top, left }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            selectMeasure(id);
                                            onOpenComments?.();
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}