import './Whitekey.css'

import whiteKeyImage from '../../../../assets/whitekey.svg';

export default function Whitekey({ note, onClick, isSelected }){
    return (
        <img 
            src={whiteKeyImage} 
            alt="White Key" 
            className={`white__key ${isSelected ? 'white__key--selected' : ''}`} 
            onClick={() => onClick(note)}    
        />
    )
}