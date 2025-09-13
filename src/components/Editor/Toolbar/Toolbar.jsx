import React, { useState, useCallback } from 'react';
import { useScore } from '../../../contexts/ScoreContext';

import './Toolbar.css';
import ToolbarButton from './ToolbarButton';
import PianoToggleButton from './ToolbarActionButtons/PianoToggleButton';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';
import ZoomControls from './ZoomControls';

// Note images
import sixtyFourthNote from '../../../assets/sixty-fourth-note.svg';
import thirtySecondNote from '../../../assets/thirty-second-note.svg';
import sixteenthNote from '../../../assets/sixteenth-note.svg';
import eighthNote from '../../../assets/eighth-note.svg';
import quarterNote from '../../../assets/quarter-note.svg';
import halfNote from '../../../assets/half-note.svg';
import wholeNote from '../../../assets/whole-note.svg';

import sixtyFourthRest from '../../../assets/sixty-fourth-rest.svg';
import thirtySecondRest from '../../../assets/thirty-second-rest.svg';
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

// Octave Changes
import ottava from '../../../assets/ottava.svg';
import ottavabassa from '../../../assets/ottavabassa.svg';
import quindicesima from '../../../assets/quindicesima.svg';
import quindicesimabassa from '../../../assets/quindicesimabassa.svg';

// Measure and clef images
import removeMeasure from '../../../assets/removemeasure.svg';
import addMeasure from '../../../assets/addmeasure.svg';
import insertMeasure from '../../../assets/insertmeasure.svg';
import trebleClef from '../../../assets/trebleclef.svg';
import bassClef from '../../../assets/bassclef.svg';
import timeSignature from '../../../assets/time-signature.svg'
import metronome from '../../../assets/metronome.svg';
import barline from '../../../assets/barline.svg';
import doubleBarline from '../../../assets/doublebarline.svg';

// import undo from '../../../assets/undo.svg';
// import redo from '../../../assets/redo.svg';
// import cut from '../../../assets/cut.svg';
// import copy from '../../../assets/copy.svg';
// import paste from '../../../assets/paste.svg';
// import zoomin from '../../../assets/zoomin.svg';
// import zoomout from '../../../assets/zoomout.svg';

const tabsButtons = ['Note', 'Articulation', 'Expression', 'Measure', 'Text'];

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

const measureEditButtons =[
    { icon: removeMeasure, alt: 'remove measure'},
    { icon: addMeasure, alt: 'add measure'},
    { icon: insertMeasure, alt: 'insert measure'},
];

const clefChangeButtons = [
    { icon: trebleClef, alt: 'treble clef'},
    { icon: bassClef, alt: 'bass clef'},
    { icon: timeSignature, alt: 'time signature'},
    { icon: metronome, alt: 'metronome'},
];

const barlineChangeButtons = [
    { icon: barline, alt: 'barline'}, 
    { icon: doubleBarline, alt: 'double barline'}
];

const noteDurationMap = {
    '64th note': '64',
    '32nd note': '32',
    '16th note': '16',
    '8th note':  '8',
    'quarter note': 'q',
    'half note': 'h',
    'whole note': 'w',
};
  
const restDurationMap = {
    '64th rest': '64r',
    '32nd rest': '32r',
    '16th rest': '16r',
    '8th rest':  '8r',
    'quarter rest': 'qr',
    'half rest': 'hr',
    'whole rest': 'wr',
};


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
    ],
    Measure: [
       { key: 'measure', buttons: measureEditButtons, className: 'toolbar__group-measure' },
       { key: 'clef', buttons: clefChangeButtons, className: 'toolbar__group-clef' },
       { key: 'barline', buttons: barlineChangeButtons, className: 'toolbar__group-barline'}
    ]
};

const timeSignatureOptions = ['2/4', '3/4', '4/4', '6/8', '9/8', '12/8']


function TimeSignatureDropdown({ icon, alt, disabled, onSelect }) {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        if (disabled) return;
        setOpen((o) => !o)
    };

    const handlePick = (sig) => {
        onSelect?.(sig);
        setOpen(false);

    }

    return (
        <div className="toolbar__dropdown-anchor">
            <button 
                type='button'
                className="toolbar__button"
                onClick={toggle}
                disabled={disabled}
                title={disabled ? 'Select a measure first' : alt}
                aria-label={alt}
            >
                <img src={icon} alt={alt} />
            </button>

            <DropdownMenu
                title='Time Signature'
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <ul className="dropdown-menu__list">
                    {timeSignatureOptions.map((sig) => (
                        <li key={sig}>
                            <button
                                type='button'
                                className="dropdown-menu__item"
                                onClick={() => handlePick(sig)}
                            >
                                {sig}
                            </button>
                        </li>
                    ))}
                </ul>
            </DropdownMenu>
        </div>
    );
}



export default function Toolbar({ isKeyBoardVisible, toggleKeyboard }){
    const [activeTab, setActiveTab] = useState('Note')

    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedAccidental, setSelectedAccidental] = useState(null);
    const [selectedArticulation, setSelectedArticulation] = useState(null);

    const { 
        selectedMeasureId, 
        addMeasure, insertBefore, removeMeasure,
        setClefAtSelectedMeasure,
        setEntryDuration, setEntryAccidental,
        addRestToSelected,
        setTimeSignatureAtSelectedMeasure,
    } = useScore();

    const handleSelectTimeSignature = useCallback((sig) => {
        if (!selectedMeasureId) return;
        setTimeSignatureAtSelectedMeasure(sig);
    }, [selectedMeasureId, setTimeSignatureAtSelectedMeasure]);

    const handleSelectedNote = (alt, groupKey) => {
        switch (groupKey) {
            case 'notes': {
                const dur = noteDurationMap[alt] || null;
                setSelectedDuration(dur);
                if (dur) setEntryDuration(dur);
                break;
            }

            case 'rests': {
                const dur = restDurationMap[alt] || null;
                setSelectedDuration(dur);
                if (selectedMeasureId && dur) addRestToSelected(dur);
                break;
            }

            case 'accidentals': {
                const accidentalMap = {
                    'natural': 'n',
                    'sharp': '#',
                    'flat': 'b',
                };
                
                const newAcc = accidentalMap[alt] ?? null;
                const nextAcc = (selectedAccidental === newAcc ? null : newAcc);
                setSelectedAccidental(nextAcc);
                setEntryAccidental(nextAcc);
                break;
            }
            
            case 'articulations':
                setSelectedArticulation(
                    selectedArticulation === alt ? null : alt
                );
                break;

            case 'measure': {
                if (alt === 'add measure') {
                    addMeasure();
                    break;
                }
                if (alt === 'insert measure') {
                    if (!selectedMeasureId) return;
                    insertBefore(selectedMeasureId);
                    break;
                }
                if (alt === 'remove measure') {
                    if (!selectedMeasureId) return;
                    removeMeasure(selectedMeasureId);
                    break;
                }
                break;
            }

            case 'clef': {
                if (!selectedMeasureId) return;
                if (alt === 'treble clef') setClefAtSelectedMeasure('treble');
                if (alt === 'bass clef') setClefAtSelectedMeasure('bass');
                break;
            }

            default:
                console.log(`Unhandled group key: ${groupKey}`)
                break;
            
        }
    }

    return (
        <div className="toolbar">
            <div className="toolbar__tabs-row">
                <div className="toolbar__tabs">
                    {tabsButtons.map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`toolbar__tab ${activeTab === tab ? 'toolbar__tab--active' : ''}`}
                            type='button'
                            >
                                {tab}
                        </button>
                    ))}
                </div>
                <div className="toolbar__actions">
                    <ZoomControls />
                    <PianoToggleButton 
                        isActive={isKeyBoardVisible}
                        onClick={toggleKeyboard}
                    />
                </div>
            </div>
            {toolbarConfig[activeTab] && (
                <div className={`toolbar__${activeTab.toLowerCase()}-buttons`}>
                    {toolbarConfig[activeTab].map((group, index) => (
                        <React.Fragment key={group.key}>
                            <div className={`toolbar__group ${group.className}`}>
                                {group.buttons.map((button, idx) => {
                                    const isMeasureGroup = group.key === 'measure';
                                    const requireSelection = isMeasureGroup && button.alt !== 'add measure';
                                    const disabled = requireSelection && !selectedMeasureId;

                                    const isTimeSignature = group.key === 'clef' && button.alt === 'time signature';
                                    const disabledTimeSig = !selectedMeasureId;

                                    if (isTimeSignature) {
                                        return (
                                            <TimeSignatureDropdown 
                                                key={`${group.key}-${idx}`}
                                                icon={button.icon}
                                                alt={button.alt}
                                                disabled={disabledTimeSig}
                                                onSelect={handleSelectTimeSignature}
                                            />
                                        )
                                    }
                                    
                                    return (
                                        <ToolbarButton 
                                            key={`${group.key}-${idx}`}
                                            icon={button.icon}
                                            alt={button.alt}
                                            onClick={() => !disabled && handleSelectedNote(button.alt, group.key)}
                                            disabled={disabled}
                                            title={disabled ? 'Select a measure first' : button.alt}
                                        />
                                    );
                                })}
                            </div>
                            {index < toolbarConfig[activeTab].length - 1 && (
                                <img src={miniDivider} alt="Divider" className="toolbar__divider-icon" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    )
}