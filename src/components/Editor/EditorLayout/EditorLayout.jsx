import Toolbar from '../Toolbar/Toolbar';
import StaffCanvas from '../StaffCanvas/StaffCanvas';
import PianoInput from '../PianoInput/PianoInput';
import EditorHeader from '../EditorHeader/EditorHeader';

export default function EditorLayout({ isKeyBoardVisible, toggleKeyboard }){
    return(
        <div className="editor">
            <EditorHeader />
            <Toolbar 
                isKeyBoardVisible={isKeyBoardVisible}
                toggleKeyboard={toggleKeyboard}
            />
            <StaffCanvas />
        </div>
    )
}