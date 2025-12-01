import './DesktopOnly.css';
import logo from '../../assets/logoBlack.svg';

export default function DesktopOnly() {
    return (
        <div className="desktop-only">
            <div className="desktop-only__container">
                <img src={logo} alt="ScoreSync Logo" className="desktop-only__logo" />
                <div className="desktop-only__dext">
                    <p className="desktop-only__small">Looks like you're on mobile!</p>

                    <h1 className="desktop-only__headline">
                        Some things are meant to be viewed on a larger screen
                    </h1>
                    <p className="desktop-only__body">
                        ScoreSync editor performs best on a bigger stage. <br />
                        Try logging in from your desktop to start composing
                    </p>
                </div>
            </div>
        </div>
    )
} 

