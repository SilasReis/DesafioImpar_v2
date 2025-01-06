import ICard from '../../types/ICard'
import './Card.css'
import TrashIcon from '../../assets/images/Icon-trash.png'
import EditIcon from '../../assets/images/Icon-edit.png'


interface CardProps extends ICard {
    onEdit: () => void;
    onDelete: () => void;
}

function Card(props: CardProps) {

    return (
        <>
            <div className="card">
                <div className="card-icon">
                    <img src={props.photo.base64} alt={`Ícone do ${props.name}`} />
                </div>
                <div className="card-text">
                    {props.name}
                </div>
                <div className="card-actions">
                    <button className="card-action-delete" onClick={props.onDelete}>
                        <img src={TrashIcon} alt="Excluir" />
                        Excluir
                    </button>
                    <button className="card-action-edit" onClick={props.onEdit}>
                        <img src={EditIcon} alt="Editar" />
                        Editar
                    </button>
                </div>
            </div>
        </>
    )
}

export default Card