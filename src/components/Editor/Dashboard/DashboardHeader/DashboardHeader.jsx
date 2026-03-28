import './DashboardHeader.css';

import logo from '../../../../assets/logo.svg';
import yourLibrary from '../../../../assets/Yourlibrary.svg';

export default function DashboardHeader() {
    return (
        <div className="dashboard-header">
            <div className="dashboard-header__containter">
                <button 
                    type='button'
                    className="dashboard-header__logo-button"
                    to='home'
                >
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className="dashboard-header__logo" 
                    />
                </button>
                <button 
                    type='button'
                    className="dashboard-header__image-button"
                >
                    <img 
                        src={yourLibrary} 
                        alt="Your Library" 
                        className="dashboard-header__image-library" 
                    />

                </button>
                
            </div>
        </div>
    )
}