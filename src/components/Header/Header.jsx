import './Header.css';
import logo from '../../assets/logo.svg'
import mobileHamburger from '../../assets/mobilehamburger.svg'


export default function Header() {
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
            <div className="header__hamburger">
                <img src={mobileHamburger} 
                    alt="Menu"
                    className='header__hamburger-icon' 
                />
            </div>
        </header>
    )
}