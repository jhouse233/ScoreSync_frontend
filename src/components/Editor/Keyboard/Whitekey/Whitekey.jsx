import './Whitekey.css'

import whiteKeyImage from '../../../../assets/whitekey.svg';

export default function Whitekey({ note, onClick }){
    return (
        <img 
            src={whiteKeyImage} 
            alt="White Key" 
            className="white__key" 
            onClick={() => onClick(note)}    
        />
    )
}