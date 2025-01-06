import TrashIconCircle from '../../assets/images/Icon-trash-circle.png';
import IDeleteCard from "../../types/IDeleteCard";
import "../DeleteCard/DeleteCard.css"
import { toastError, toastSuccess } from "../../utils/toastHot";
import { deleteThumbnailFromLocalStorage } from '../../utils/thumbFile';
import { deleteCard } from '../../services/Card/serviceCard';

const DeleteModal = (props: IDeleteCard) => {

    if (!props.isOpen) return null;

    async function handleDelete() {
        try {
            const response = await deleteCard(props.card);
            toastSuccess(response);
        } catch (error) {
            toastError("Erro ao tentar excluir o card");
        } finally {
            props.onDelete(props.card);
            props.onClose();
            deleteThumbnailFromLocalStorage(props.card.id.toString());
        }
    }

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal">
                <button className="delete-modal-close" onClick={props.onClose}>
                    X
                </button>
                <div className="delete-modal-content">
                    <div className="delete-circle">
                        <img src={TrashIconCircle} alt="Excluir" />
                    </div>
                    <div className='delete-text-container'>
                        <span className="delete-text">Excluir</span>
                    </div>
                    <p className='delete-text-confirm'>Certeza que deseja excluir?</p>
                    <div className="modal-separator"></div>
                    <div className="delete-modal-buttons">
                        <button className="delete-modal-confirm" onClick={handleDelete}>
                            Excluir
                        </button>
                        <button className="delete-modal-cancel" onClick={props.onClose}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default DeleteModal;
