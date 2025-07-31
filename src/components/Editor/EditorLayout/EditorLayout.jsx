import Toolbar from '../Toolbar/Toolbar';
import StaffCanvas from '../StaffCanvas/StaffCanvas';
import PianoInput from '../PianoInput/PianoInput';

export default function EditorLayout(){
    return(
        <div className="editor">
            <Toolbar />
            <StaffCanvas />
            <PianoInput />
        </div>
    )
}