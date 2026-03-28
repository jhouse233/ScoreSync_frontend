import './DashboardPage.css';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import ScoreLibrary from '../../ScoreLibrary/ScoreLibrary';
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';

export default function DashboardPage() {
    return (
        <div className="dashboard-page">
            <DashboardHeader />
            <div className="dashboard-page__content">
                <DashboardSidebar />
                <ScoreLibrary />
            </div>
        </div>
    )
}
