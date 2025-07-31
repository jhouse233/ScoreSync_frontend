import React, { useState } from 'react';

import './Toolbar.css';
import ToolbarButton from './ToolBarButton';
// Note images
import sixtyFourthNote from '../../../assets/sixty-fourth-note.svg';
import thirtySecondNote from '../../../assets/thirty-second-note.svg';
import sixteenthNote from '../../../assets/sixteenth-note.svg';
import eighthNote from '../../../assets/eighth-note.svg';
import quarterNote from '../../../assets/quarter-note.svg';
import halfNote from '../../../assets/half-note.svg';
import wholeNote from '../../../assets/whole-note.svg';

import sixtyFourthRest from '../../../assets/sixty-fourth-rest.svg';
import thirtySecondRest from '../../../assets/sixty-fourth-rest.svg';
import sixteenthRest from '../../../assets/sixteenth-rest.svg';
import eighthRest from '../../../assets/eighth-rest.svg';
import quarterRest from '../../../assets/quarter-rest.svg';
import halfRest from '../../../assets/half-rest.svg';
import wholeRest from '../../../assets/whole-rest.svg';

import natural from '../../../assets/natural-sign.svg';
import flat from '../../../assets/flat-sign.svg';
import sharp from '../../../assets/sharp-sign.svg';
// Toolbar divider
import miniDivider from '../../../assets/minidivider.svg';

// Articulation images
import staccato from '../../../assets/staccato.svg';
import accent from '../../../assets/accent.svg';
import tenuto from '../../../assets/tenuto.svg';
import marcato from '../../../assets/marcato.svg';
import staccatissimo from '../../../assets/staccatissimo.svg';
import marcatostaccato from '../../../assets/marcatostaccato.svg';
import accentstaccato from '../../../assets/accentstaccato.svg';
import tenutostaccato from '../../../assets/tenutostaccato.svg';
import fermata from '../../../assets/fermata.svg';
import breathMark from '../../../assets/breathmark.svg';

// Expressions images
import crescendo from '../../../assets/crescendo.svg';
import decrescendo from '../../../assets/decrescendo.svg';
import pianississimo from '../../../assets/pianississimo.svg';
import pianissimo from '../../../assets/pianissimo.svg';
import piano from '../../../assets/piano.svg';
import mezzopiano from '../../../assets/mezzopiano.svg';
import mezzoforte from '../../../assets/mezzoforte.svg';
import forte from '../../../assets/forte.svg';
import fortissimo from '../../../assets/fortissimo.svg';
import fortississimo from '../../../assets/fortississimo.svg';
import fortepiano from '../../../assets/fortepiano.svg';
import sforzando from '../../../assets/sforzando.svg';

import pedal from '../../../assets/pedal.svg';
import pedalrelease from '../../../assets/pedalrelease.svg';
import pedaljog from '../../../assets/pedaljog.svg';

import accelerando from '../../../assets/accelerando.svg';
import ritardando from '../../../assets/ritardando.svg';

import ottava from '../../../assets/ottava.svg';
import ottavabassa from '../../../assets/ottavabassa.svg';
import quindicesima from '../../../assets/quindicesima.svg';
import quindicesimabassa from '../../../assets/quindicesimabassa.svg';

const noteButtons = [
    { icon: sixtyFourthNote, alt: '64th note' },
    { icon: thirtySecondNote, alt: '32nd note' },
    { icon: sixteenthNote, alt: '16th note' },
    { icon: eighthNote, alt: '8th note' },
    { icon: quarterNote, alt: 'quarter note' },
    { icon: halfNote, alt: 'half note' },
    { icon: wholeNote, alt: 'whole note' }
];
const restButtons = [
    { icon: sixtyFourthRest, alt: '64th rest' },
    { icon: thirtySecondRest, alt: '32nd rest' },
    { icon: sixteenthRest, alt: '16th rest' },
    { icon: eighthRest, alt: '8th rest' },
    { icon: quarterRest, alt: 'quarter rest' },
    { icon: halfRest, alt: 'half rest' },
    { icon: wholeRest, alt: 'whole rest' }
];

const accidentalButtons = [
    { icon: natural, alt: 'natural' },
    { icon: flat, alt: 'flat' },
    { icon: sharp, alt: 'sharp'}
];

const articulationButtons = [
    { icon: staccato, alt: 'staccato' },
    { icon: accent, alt: 'accent' },
    { icon: tenuto, alt: 'tenuto' },
    { icon: marcato, alt: 'marcato' },
    { icon: staccatissimo, alt: 'staccatissimo' },
    { icon: marcatostaccato, alt: 'marcatostaccato' },
    { icon: accentstaccato, alt: 'accentstaccato' },
    { icon: tenutostaccato, alt: 'tenutostaccato' },
];

const inflectionButtons = [
    { icon: fermata, alt: 'fermata' },
    { icon: breathMark, alt: 'breath mark' }
];

const expressionButtons = [
    { icon: crescendo, alt: 'crescendo' },
    { icon: decrescendo, alt: 'decrescendo' },
    { icon: pianississimo, alt: 'pianississimo' },
    { icon: pianissimo, alt: 'pianissimo' },
    { icon: piano, alt: 'piano' },
    { icon: mezzopiano, alt: 'mezopiano' },
    { icon: mezzoforte, alt: 'mezoforte' },
    { icon: forte, alt: 'forte' },
    { icon: fortissimo, alt: 'fortissimo' },
    { icon: fortississimo, alt: 'fortississimo' },
    { icon: fortepiano, alt: 'fortepiano' },
    { icon: sforzando, alt: 'sfortzando' }
];

const pianoExpressionButtons = [
    {icon: pedal, alt: 'pedal'},
    {icon: pedalrelease, alt: 'pedal release'},
    {icon: pedaljog, alt: 'pedal jog'}
];

const tempoExpressionButtons = [
    { icon: accelerando, alt: 'accelerando' },
    { icon: ritardando, alt: 'ritardando'}
];

const octaveShiftButtons = [
    { icon: ottava, alt: 'ottava'},
    { icon: ottavabassa, alt: 'ottava bassa'},
    { icon: quindicesima, alt: 'quindicesima'},
    { icon: quindicesimabassa, alt: 'quindicesima bassa'},
];

const toolbarConfig = {
    Note: [
        { key: 'notes', buttons: noteButtons, className: 'toolbar__group-notes' },
        { key: 'rests', buttons: restButtons, className: 'toolbar__group-rests' },
        { key: 'accidentals', buttons: accidentalButtons, className: 'toolbar__group-accidental' },
    ],
    Articulation: [
        { key: 'articulations', buttons: articulationButtons, className: 'toolbar__group-articulations' },
        { key: 'inflection', buttons: inflectionButtons, className: 'toolbar__group-inflection' },
    ],
    Expression: [
        { key: 'expression', buttons: expressionButtons, className: 'toolbar__group-expression' },
        { key: 'piano', buttons: pianoExpressionButtons, className: 'toolbar__group-piano' },
        { key: 'tempo', buttons: tempoExpressionButtons, className: 'toolbar__group-tempo-expression-buttons' },
        { key: 'octaveShift', buttons: octaveShiftButtons, className: 'toolbar__group-octave-shift-buttons' },
    ]
};



const tabsButtons = ['Note', 'Articulation', 'Expression', 'Measure', 'Text']

export default function Toolbar(){
    const [selectedNote, setSelectedNote] = useState(null);
    const [activeTab, setActiveTab] = useState('Note')

    const handleSelectedNote = (note) => {
        setSelectedNote(note);
    }
    return (
        <div className="toolbar">
            <div className="toolbar__tabs">
                {tabsButtons.map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`toolbar__tab ${activeTab === tab ? 'toolbar__tab--active' : ''}`}
                        >
                            {tab}
                    </button>
                ))}
            </div>
            {toolbarConfig[activeTab] && (
                <div className={`toolbar__${activeTab.toLowerCase()}-buttons`}>
                    {toolbarConfig[activeTab].map((group, index) => (
                        <React.Fragment key={group.key}>
                            <div className={`toolbar__group ${group.className}`}>
                                {group.buttons.map((button, idx) => (
                                    <ToolbarButton 
                                        key={`${group.key}-${idx}`}
                                        icon={button.icon}
                                        alt={button.alt}
                                        onClick={() => handleSelectedNote(button.alt)}
                                    />
                                ))}
                            </div>
                            {index < toolbarConfig[activeTab].length - 1 && (
                                <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
            {/* {activeTab === 'Note' && (
                <div className="toolbar__note-buttons">
                    <div className="toolbar__group toolbar__group-notes">
                        {noteButtons.map((button, index) => (
                            <ToolbarButton 
                                key={index}
                                icon={button.icon}
                                alt={button.alt}
                                onClick={() => handleSelectedNote(button.alt)}
                                isSelected={selectedNote === button.alt}
                            />
                        ))}
                    </div>
                    <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                    <div className="toolbar__group toolbar__group-rests">
                        {restButtons.map((button, index) => (
                            <ToolbarButton 
                                key={`rest-${index}`}
                                icon={button.icon}
                                alt={button.alt}
                                onClick={() => handleSelectedNote(button.alt)}
                                isSelected={selectedNote === button.alt}
                            />
                        ))}
                    </div>
                    <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />

                    <div className="toolbar__group toolbar__group-accidental">
                        {accidentalButtons.map((button, index) => (
                            <ToolbarButton 
                                key={`rest-${index}`}
                                icon={button.icon}
                                alt={button.alt}
                                onClick={() => handleSelectedNote(button.alt)}
                                isSelected={selectedNote === button.alt}
                            />
                        ))}
                    </div>
                    <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                </div>
            )}
            {activeTab === 'Articulation' && (
                <div className="toolbar__articulation-buttons">
                    <div className="toolbar__group toolbar__group-articulations">
                        {articulationButtons.map((button, index) => (
                            <ToolbarButton 
                                key={index}
                                icon={button.icon}
                                alt={button.alt}
                                onClick={() => handleSelectedNote(button.alt)}
                                isSelected={selectedNote === button.alt}
                            />
                        ))}
                    </div>
                    <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                    <div className="toolbar__group toolbar__group-inflection">
                        {inflectionButtons.map((button, index) => (
                            <ToolbarButton 
                                key={`rest-${index}`}
                                icon={button.icon}
                                alt={button.alt}
                                onClick={() => handleSelectedNote(button.alt)}
                                isSelected={selectedNote === button.alt}
                            />
                        ))}
                    </div>
                    <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                </div>
            )}
            {activeTab === 'Expression' && (
                <div className="toolbar__expression-buttons">
                    <div className="toolbar__group toolbar__group-expression">
                        {expressionButtons.map((button, index) => (
                            <ToolbarButton 
                                key={index}
                                icon={button.icon}
                                alt={button.alt}
                                onClick={() => handleSelectedNote(button.alt)}
                                isSelected={selectedNote === button.alt}
                            />
                        ))}
                    </div>
                    <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                    <div className="toolbar__group toolbar__group-piano">
                        {pianoExpressionButtons.map((button, index) => (
                            <ToolbarButton 
                                key={`rest-${index}`}
                                icon={button.icon}
                                alt={button.alt}
                                onClick={() => handleSelectedNote(button.alt)}
                                isSelected={selectedNote === button.alt}
                            />
                        ))}
                    </div>
                    <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                    <div className="toolbar__group toolbar__group-tempo-expression-buttons">
                        {tempoExpressionButtons.map((button, index) => (
                            <ToolbarButton 
                                key={`rest-${index}`}
                                icon={button.icon}
                                alt={button.alt}
                                onClick={() => handleSelectedNote(button.alt)}
                                isSelected={selectedNote === button.alt}
                            />
                        ))}
                    </div>
                    <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                    <div className="toolbar__group toolbar__group-octave-shift-buttons">
                        {octaveShiftButtons.map((button, index) => (
                            <ToolbarButton 
                                key={`rest-${index}`}
                                icon={button.icon}
                                alt={button.alt}
                                onClick={() => handleSelectedNote(button.alt)}
                                isSelected={selectedNote === button.alt}
                            />
                        ))}
                    </div>
                    <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                </div>
            )} */}
            
        </div>
    )
}