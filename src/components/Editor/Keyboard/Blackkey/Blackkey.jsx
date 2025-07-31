import './Blackkey.css';

import blackKeyImage from '../../../../assets/blackkey.svg';

export default function Blackkey({ note, onClick, style }) {
    return (
        <img 
            src={blackKeyImage} 
            alt={note} 
            className="black__key"
            style={style}
            onClick={() => onClick(note)} 
        />
    );
}