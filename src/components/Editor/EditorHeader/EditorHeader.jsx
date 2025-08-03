import './EditorHeader.css';

// Import Images
import logo from '../../../assets/logo.svg';
import volume from '../../../assets/volume.svg';
import edit from '../../../assets/edit.svg';
import savehistory from '../../../assets/savehistory.svg';
import share from '../../../assets/share.svg';
import user from '../../../assets/user.svg';


export default function EditorHeader(){
    const projectTools = [
        { 
            key: 'logo', 
            content: (
                <img 
                    src={logo} 
                    alt='Logo' 
                    className='editor-header__logo' 
                />
            )
        },
        { 
            key: 'title', 
            content: (
                <button 
                    type='button'
                    className='editor-header__title-score'
                >
                    Title
                </button>
            )
        },
        { 
            key: 'volume', 
            content: (
                <button 
                    type='button' 
                    className='editor-header__volume-button'
                >
                    <img 
                        src={volume} 
                        alt='Volume'
                        className='editor-header__volume-image'
                    />
                </button>
            )
        },
        {
            key: 'edit',
            content: (
                <button 
                    type='button' 
                    className='editor-header__edit-button'
                >
                        <img 
                            src={edit} 
                            alt='Edit'
                            className='editor-header__edit-image'
                        />
                </button>
            )
        },
    ];

    const userTools = [
        { 
            key: 'save-history',
            content: (
                <button 
                    type='button' 
                    className="editor-header__save-history-button"
                >
                <img 
                    src={savehistory} 
                    alt="Save History" 
                    className="editor-header__save-history-image" 
                />
                </button>
            )
        },
        {
            key: 'share',
            content: (
                <button 
                    type='button' 
                    className="editor-header__share-button"
                >
                    <img 
                        src={share} 
                        alt="Share" 
                        className="editor-header__share-image" 
                    />
                </button>
            )
        },
        {
            key: 'user',
            content: (
                <button 
                    type='button' 
                    className="editor-header__user-button"
                >
                    <img 
                        src={user} 
                        alt="User" 
                        className="editor-header__user-image" 
                    />
                </button>
            )
        }
    ];



    return (
        <header className="editor-header">
            <div className="editor-header__project-tools">
                {projectTools.map(({ key, content }) => (
                    <div key={key} className={`editor-header__${key}`}>
                        {content}
                    </div>
                ))}
            </div>

            <div className="editor-header__user-tools">
                {userTools.map(({ key, content }) => (
                    <div key={key} className={`editor-header__${key}`}>
                        {content}
                    </div>
                ))}
            </div>
        </header>
    )
}