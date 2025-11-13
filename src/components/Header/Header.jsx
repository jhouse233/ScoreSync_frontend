import { useEffect, useRef, useState } from 'react'; 
import './Header.css';
import logo from '../../assets/logo.svg'
import mobileHamburger from '../../assets/mobilehamburger.svg'


export default function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const remuRef = useRef(null);
    const buttonRef = useRef(null);

    // Close on Escape
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === 'Escape') setIsMenuOpen(false);
        }
        if (isMenuOpen) document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isMenuOpen]);

    // Close when clicking outside
    useEffect(() => {
        function onClickAway(e) {
            if (!menuRef.current) return;
            if (
                isMenuOpen &&
                !menuRef.current.contains(e.target) &&
                !buttonRef.current.contains(e.target)
            ) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickAway);
        return () => document.removeEventListener('mousedown', onClickAway);
    }, [isMenuOpen]);



    return (
        <header className="header">
            <div className="header__logo-container">
                <img src={logo} alt="ScoreSync Logo" className="header__logo" />
            </div>
            <div className="header__access-container">
                <button 
                    type='button'
                    className="header__features">
                        Features
                </button>
                <button 
                    type='button'
                    className="header__login-button">
                        Login
                </button>
                <button 
                    type='button' 
                    className="header__signup-button">
                        Get Started
                </button>
            </div>
            {/* mobile */}
            <button 
                className="header__menu-button"
                ref={buttonRef}
                aria-label='Open menu'
                aria-haspopup='menu'
                aria-controls='mobile-menu'
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((v) => !v)}
                type='button'
            >
                <img src={mobileHamburger} alt="" className='header__hamburger-icon' />
            </button>
            {/* <div className="header__hamburger">
                <img src={mobileHamburger} 
                    alt="Menu"
                    className='header__hamburger-icon' 
                />
            </div> */}
        </header>
    )
}