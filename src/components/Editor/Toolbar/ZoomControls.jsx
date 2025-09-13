import React from 'react';
import { useScore } from '../../../contexts/ScoreContext';
import { ZOOM_MIN, ZOOM_MAX } from '../../../contexts/ScoreContext';

import zoomInIcon from '../../../assets/zoomin.svg';
import zoomOutIcon from '../../../assets/zoomout.svg';

export default function ZoomControls() {
    const { zoom, zoomIn, zoomOut } = useScore();

    // const pct = Math.round(zoom * 100);
    const atMin = zoom <= ZOOM_MIN + 1e-6;
    const atMax = zoom >= ZOOM_MAX - 1e-6;

    return (
        <div className="toolbar__zoom">
            <button 
                className="toolbar__button"
                type='button'
                onClick={zoomOut}
                disabled={atMin}
                aria-label='Zoom out'
                title='Zoom out'
            >
                <img src={zoomOutIcon} alt="" className="toolbar__icon" />
            </button>
            <button 
                className="toolbar__button"
                type='button'
                onClick={zoomIn}
                disabled={atMax}
                aria-label='Zoom in'
                title='Zoom in'
            >
                <img src={zoomInIcon} alt="" className="toolbar__icon" />
            </button>
        </div>
    )
}