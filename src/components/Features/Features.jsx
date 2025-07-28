import { useState } from 'react'
import './Features.css'
import FeaturesTabButton from './FeaturesTabButton';

import activeRefine from '../../assets/activeRefine.svg';
import activeReview from '../../assets/activeReview.svg';
import activeTogether from '../../assets/activeTogether.svg';
import activeWrite from '../../assets/activeWrite.svg';
import defaultRefine from '../../assets/defaultRefine.svg';
import defaultReview from '../../assets/defaultReview.svg';
import defaultTogether from '../../assets/defaultTogether.svg';
import defaultWrite from '../../assets/defaultWrite.svg';
import hoverRefine from '../../assets/hoverRefine.svg';
import hoverReview from '../../assets/hoverReview.svg';
import hoverTogether from '../../assets/hoverTogether.svg';
import hoverWrite from '../../assets/hoverWrite.svg';


export default function Features(){
    const [activeTab, setActiveTab] = useState('write');

    const tabContent = {
        write: {
            title: 'Write music.Instantly.Anywhere',
            text: `Capture your ideas the moment inspiration strikes. 
            With ScoreSync, you can compose directly in the browser with no extra software,
            no delays, and no distractions. Sketch a melody, build harmonies, or orchestrate an entire piece - all in real time`
        },
        review: {
            title: 'Review with ease. Feedback in flow.',
            text: `Invite collaborators to leave comments, suggest edits, or make
            annotations - all within the score. Rehearse feedback loops, see updates live,
            and acoid clunky back-and-forth emails.`
        },
        refine: {
            title: 'Refine your ideas.Sharpen your score.',
            text: `Polish your compositions with smart layout tools,
            plaback features, and dynamic part management. Whether
            adjusting note spacing opr revising instrucmentatuion, ScoreSynbc helps you
            perfect your piece with clarity and control.`
        },
        together: {
            title: 'Together in perfect harmony.',
            text: `ScoreSync is built for collaboration. Work across time zones,
            share creative control, and compose together in a truly social music environment.
            Creativity flourishes when you're not alone in the process.`
        }
    }
    return(
        <section className="features">
            <div className="features__tabs">
                <FeaturesTabButton 
                    alt='Write'
                    defaultImg={defaultWrite}
                    hoverImg={hoverWrite}
                    activeImg={activeWrite}
                    isActive={activeTab === 'write'}
                    onClick={() => setActiveTab('write')}
                />
                <FeaturesTabButton 
                    alt='Review'
                    defaultImg={defaultReview}
                    hoverImg={hoverReview}
                    activeImg={activeReview}
                    isActive={activeTab === 'review'}
                    onClick={() => setActiveTab('review')}
                />
                <FeaturesTabButton 
                    alt='Refine'
                    defaultImg={defaultRefine}
                    hoverImg={hoverRefine}
                    activeImg={activeRefine}
                    isActive={activeTab === 'refine'}
                    onClick={() => setActiveTab('refine')}
                />
                <FeaturesTabButton 
                    alt='Together'
                    defaultImg={defaultTogether}
                    hoverImg={hoverTogether}
                    activeImg={activeTogether}
                    isActive={activeTab === 'together'}
                    onClick={() => setActiveTab('together')}
                />
            </div>
            <div className="features__panel">
                <h3 className="features__title">{tabContent[activeTab].title}</h3>
                <p className="features__text">{tabContent[activeTab].text}</p>
            </div>
        </section>
    )
}