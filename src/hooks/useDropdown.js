import { useState, useEffect, useRef } from "react";

export default function useDropdown(onCloseCallback) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    const open = () => setIsOpen(true);
    const close = () => {
        setIsOpen(false);
        onCloseCallback?.();
    }

    const toggle = () => setIsOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)){
                close();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return {
        isOpen,
        open,
        close,
        toggle,
        dropdownRef
    };
}