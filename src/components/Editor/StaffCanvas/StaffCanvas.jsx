import { useEffect, useRef, useState, useMemo } from 'react';
import { Renderer, Stave } from 'vexflow';
import { useScore } from '../../../contexts/ScoreContext';

import './StaffCanvas.css'

export default function StaffCanvas() {
    const { measures } = useScore();

    // Layout Constants
    const MEASURES_PER_ROW = 3;
    const MEASURE_WIDTH = 400;
    const FIRST_MEASURE_WIDTH = MEASURE_WIDTH;
    const START_X = 60;
    const STAVE_PADDING_TOP = 60;
    const STAVE_PADDING_RIGHT = 60;
    const STAVE_HEIGHT = 140;
    const ROW_GAP = STAVE_PADDING_TOP;
    const STAVE_Y_GAP = STAVE_HEIGHT + ROW_GAP;

    const HIL_PAD_X = 1;
    const HIL_PAD_Y = 40;
    const HIL_RADIUS = 6;

    // State
    const [selectedMeasureId, setSelectedMeasureId] = useState(null);

    const selectMeasure = (id) => setSelectedMeasureId(id);
    const clearSelection = () => setSelectedMeasureId(null);
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


    // Layout geometry for every measure
    const layout = useMemo(() => {
        return measures.map((m, i) => {
            const row = Math.floor(i / MEASURES_PER_ROW);
            const col = i % MEASURES_PER_ROW;
            const x = START_X + col * MEASURE_WIDTH;
            const y = STAVE_PADDING_TOP + row * STAVE_Y_GAP;
            const width = col === 0 ? FIRST_MEASURE_WIDTH : MEASURE_WIDTH;
            const height = STAVE_HEIGHT;
            return { id: m.id ?? `m-${i}`, i, row, col, x, y, width, height};
        });
    }, [measures]);

    // canvas size derived from layout
    const totalRows = Math.max(1, Math.ceil(measures.length / MEASURES_PER_ROW));
    const svgWidth = START_X + MEASURES_PER_ROW * MEASURE_WIDTH + STAVE_PADDING_RIGHT;
    const svgHeight = STAVE_PADDING_TOP + totalRows * STAVE_Y_GAP;

    // VexFlow renderer
    const hostRef = useRef(null);
    const rendererRef = useRef(null);

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

        layout.forEach(({ x, y, width }) => {
            new Stave(x, y, width).setContext(ctx).draw();
        });

        return () => {
            const svg = ctx?.svg ?? host.querySelector('svg');
            svg?.replaceChildren?.();
        }
    }, [layout, svgWidth, svgHeight]);





    useEffect(() => {
        if (selectedMeasureId && !layout.some(l => l.id === selectedMeasureId)) {
            setSelectedMeasureId(null);
        }
    }, [layout, selectedMeasureId])


    const handleBgClick = (e) => {e.preventDefault(); clearSelection();}
    const handleDbClick = (id) => {
        console.log('Doubleclick measure', id);
        selectMeasure(id);
    }


    return (
        <div className="staff__canvas">
            <div className="staffcanvas__composition-content">
                <div className="staffcanvas__stage">
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

                        {layout.map(({ id, x, y, width, height }) => {
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
                </div>
            </div>
        </div>
    )
}