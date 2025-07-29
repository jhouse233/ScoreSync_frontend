import './Introduction.css'

import realtime from '../../assets/real-time.svg';
import accessAnyWhere from '../../assets/accessanywhere.svg';
import versionControl from '../../assets/versionControl.svg';

export default function Introduction(){
    return (
        <section className="introduction">
            <div className="introduction__overlay">
                <p className="intro__tagline">Collaborate<br /> on music. In <span className='intro__tagline-highlight'>perfect</span><br /> Harmony</p>
                
            </div>
            <div className="introduction__features">
                    <div className="intro-feature">
                        <h3 className="intro-feature__title">Real-Time Collaboration</h3>
                        <img src={realtime} alt="Real-Time Collaboration" className="intro-feature__icon" />
                        <p className="intro-feature__caption">Compose together, stay in sync</p>
                    </div>
                    <div className="intro-feature">
                        <h3 className="intro-feature__title">Version Control</h3>
                        <img src={versionControl} alt="Version Control" className="intro-feature__icon" />
                        <p className="intro-feature__caption">Keep every version of your ScoreSync</p>
                    </div>
                    <div className="intro-feature">
                        <h3 className="intro-feature__title">Access Anywhere</h3>
                        <img src={accessAnyWhere} alt="Access Anywhere" className="intro-feature__icon" />
                        <p className="intro-feature__caption">Write from anywhere</p>
                    </div>
                </div>
        </section>
    )
}