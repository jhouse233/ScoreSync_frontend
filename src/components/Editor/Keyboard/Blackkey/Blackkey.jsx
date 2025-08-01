import './Blackkey.css';

import blackKeyImage from '../../../../assets/blackkey.svg';

export default function Blackkey({ note, onClick, style, isSelected}) {
    return (
        <img 
            src={blackKeyImage} 
            alt={note} 
            className={`black__key ${isSelected ? 'black__key--selected' : ''}`}
            style={style}
            onClick={() => onClick(note)} 
        />
    );
}