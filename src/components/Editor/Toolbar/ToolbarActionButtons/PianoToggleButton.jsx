import React from 'react';

import keyboardIcon from '../../../../assets/pianoon.svg';

export default function PianoToggleButton({ isActive, onClick }) {
    return(
        <button
            title='Toggle Keyboard'
            className={`toolbar__action-button ${isActive ? 'active' : '' }`}
            onClick={onClick}
        >
            <img src={keyboardIcon} alt='Toggle Keyboard' />
        </button>
    )
}