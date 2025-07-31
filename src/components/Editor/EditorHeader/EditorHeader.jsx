import './EditorHeader.css';

// Import Images
import logo from '../../../assets/logo.svg';
import volume from '../../../assets/volume.svg';
import edit from '../../../assets/edit.svg';
import savehistory from '../../../assets/savehistory.svg';
import share from '../../../assets/share.svg';
import user from '../../../assets/user.svg';

export default function EditorHeader(){
    return (
        <header className="editor-header">
            <div className="editor-header__project-tools">
                <div className="editor-header__logo-container">
                    <img src={logo} alt="" className="editor-header__logo" />
                </div>
                <div className="editor-header__title">
                    <h3 className="editor-header__title-score">Title</h3>
                </div>
                <div className="editor-header__volume">
                    <button 
                        type='button' 
                        className="editor-header__volume-button">
                        <img src={volume} alt="Volume" className="editor-header__volume-image" />
                    </button>
                </div>
                <div className="editor-header__edit">
                    <button type='button' className="editor-header__edit-button">
                        <img src={edit} alt="Edit" className="editor-header__edit-image" />
                    </button>
                </div>
            </div>
            <div className="editor-header__user-tools">
                <div className="editor-header__save-history">
                    <button type='button' className="editor-header__save-history-button">
                        <img src={savehistory} alt="Save History" className="editor-header__save-history-image" />
                    </button>
                </div>
                <div className="editor-header__share">
                    <button type='button' className="editor-header__share-button">
                        <img src={share} alt="Share" className="editor-header__share-image" />
                    </button>
                </div>
                <div className="editor-header__user">
                    <button type='button' className="editor-header__user-button">
                        <img src={user} alt="Share" className="editor-header__user-image" />
                    </button>
                </div>
            </div>
        </header>
    )
}