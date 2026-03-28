import './DashboardSidebar.css';

import createButton from '../../../../assets/createscore.svg';

export default function DashboardSidebar() {
    return (
        <div className="dashboard-sidebar">
            <h3 className="dashboard-sidebar__title">Your Library</h3>
            <button 
                type='button' 
                className="dashboard-sidebar__button"
            >
                <img 
                    src={createButton} 
                    alt="create button" 
                    className="dashboard-sidebar__button-image" 
                />
            </button>
        </div>
    )
}