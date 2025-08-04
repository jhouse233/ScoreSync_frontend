import './ModalWithForm.css';
import closeIcon from '../../assets/modalclose.svg';


export default function ModalWithForm({ title, isOpen, onClose, onSubmit, buttonText, children, showDefaultButton = true}){

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    }
    return(
        <div className={`modal modal_type_${name} ${isOpen ? 'modal_opened' : ''} `}>
            <div className="modal__content">
                <h3 className="modal__title">{title}</h3>
                <button className="modal__close" type='button' onClick={onClose}>
                    <img src={closeIcon} alt=" Close Button" />
                </button>
                <form onSubmit={handleSubmit} className="modal__form">
                    {children}
                    {showDefaultButton && (
                        <button className="modal__submit" type='submit'>
                            {buttonText}
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
}