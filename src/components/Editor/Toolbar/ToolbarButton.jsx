import { useState } from 'react';

import './ToolbarButton.css';

export default function ToolbarButton({ icon, alt, onClick, isSelected }){
    const [activeButton, setActiveButton] = useState(false);


    return (
        <button 
            onClick={onClick}
            className={`toolbar__button ${isSelected ? 'toolbar__button--active' : ''}`}
            title={alt}
            >
                <img src={icon} alt={alt} className="toolbar__image" />
        </button>
    )
}
