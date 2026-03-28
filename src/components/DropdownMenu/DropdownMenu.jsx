import { useEffect, useRef } from 'react';

import './DropdownMenu.css';

export default function DropdownMenu({ title, isOpen, onClose, children }){
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)){
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="dropdown-menu" ref={dropdownRef}>
            {title && <h4 className='dropdown-menu__title'>{title}</h4>}
            <div className="dropdown-menu__content">
                {children}
            </div>

        </div>
    )
}