
import './ToolbarButton.css';

export default function ToolbarButton({ 
    icon, 
    alt, 
    onClick, 
    disabled = false, 
    title, 
    isSelected = false, 
    isToggle = false 
}){
    const label = title || alt;

    return (
        <button 
            onClick={disabled ? undefined : onClick}
            className={`toolbar__button ${isSelected ? 'toolbar__button--active' : ''} ${disabled ? 'is-disabled' : ''}`}
            title={label}
            type='button'
            disabled={disabled}
            aria-pressed={isToggle ? isSelected : undefined}
            aria-label={label}
            >
                <img src={icon} alt='' className="toolbar__image" />
        </button>
    )
}
