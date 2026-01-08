import { useEffect, useRef, useState } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.svg'
import mobileHamburger from '../../assets/mobilehamburger.svg'
import closeBlack from '../../assets/closeBlack.svg';


export default function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOverLightSection, setIsOverLightSection] = useState(false);
    const [forceDarkUntilIntersect, setForceDarkUntilIntersect] = useState(false);

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const shouldForceDark = location.pathname === '/' && location.state?.scrollTo === 'features';

    // const handleFeaturesClick = () => {
    //     if (location.pathname === '/') {
    //         const el = document.getElementById('features');
    //         if (el) {
    //             el.scrollIntoView({ behavior: 'smooth'})
    //         } else {
    //             navigate('/');
    //         }
    //     }
    // }
    const handleFeaturesClick = () => {
        const scrollToFeatures = () => {
            const el = document.getElementById('features');
            if (el) el.scrollIntoView({ behavior: 'smooth'});
        };

        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: 'features' } });
        } else {
            scrollToFeatures();
        }

        setIsMenuOpen(false);
    }

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

    useEffect(() => {
        if (location.pathname === '/' && location.state?.scrollTo === 'features') {
            setForceDarkUntilIntersect(true);

            setTimeout(() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                navigate('.', { replace: true, state: {} });
            }, 0);
        }
    }, [location.pathname, location.state, navigate]);

    useEffect(() => {
        const featuresEl = document.getElementById('features');
        if (!featuresEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isActive = entry.isIntersecting && entry.intersectionRatio >= 0.2;
                setIsOverLightSection(isActive);

                if (!isActive) setForceDarkUntilIntersect(false);
            },
            {
                root: null,
                threshold: [0, 0.2],
                rootMargin: '-80px 0px 0px 0px',
            }
        );

        observer.observe(featuresEl);

        return () => observer.disconnect();

    }, [location.pathname]);



    return (
        <header className={`header ${(isOverLightSection || forceDarkUntilIntersect) ? 'header--dark' : ''}`}>
            <div 
                className="header__logo-container"
                role='button'
                tabIndex={0}
                onClick={() => navigate('/')}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            >
                <img src={logo} alt="ScoreSync Logo" className="header__logo" />
            </div>
            <div className="header__access-container">
                <button 
                    type='button'
                    onClick={handleFeaturesClick}
                    className="header__features">
                        Features
                </button>
                <button 
                    type='button'
                    onClick={() => navigate('/login')}
                    className="header__login-button">
                        Login
                </button>
                <button 
                    type='button' 
                    onClick={() => navigate('/register')}
                    className="header__signup-button">
                        Get Started
                </button>
            </div>
            {/* mobile */}
            <button 
                className="header__menu-button"
                ref={buttonRef}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-haspopup='menu'
                aria-controls='mobile-menu'
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((v) => !v)}
                type='button'
            >
                <img src={isMenuOpen ? closeBlack : mobileHamburger} alt="" className='header__hamburger-icon' />
            </button>
            {/* Mobile Menu Dropdown */}
            <nav 
                id='mobile-menu'
                ref={menuRef}
                className={`mobile-menu ${isMenuOpen ? 'mobile-menu--open' : ''}`}
                role='menu'
            >
                <button className="mobile-menu__item" role='menuitem'>Features</button>
                <button className="mobile-menu__item" role='menuitem'>Login</button>
                <button className="mobile-menu__item mobile-menu__item--primary" role='menuitem'>Get Started</button>
            </nav>
            {/* <div className="header__hamburger">
                <img src={mobileHamburger} 
                    alt="Menu"
                    className='header__hamburger-icon' 
                />
            </div> */}
        </header>
    )
}