import { useState, useEffect } from "react";
import INewEditCard from "../../types/INewEditCard";
import "../NewEditCard/NewEditCard.css"
import CreateIcon from '../../assets/images/icone_criar.png';
import { saveCard, createCardObject, editCard, validateCardFields } from '../../services/Card/serviceCard'
import { toastError, toastSuccess, toastWarning } from "../../utils/toastHot";
import { deleteThumbnailFromLocalStorage } from "../../utils/thumbFile";

export default function NewEditCard(props: INewEditCard) {
    const [name, setName] = useState("");
    const [fileName, setFileName] = useState("Nenhum arquivo selecionado");
    const [fileBase64, setFileBase64] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (props.isOpen && props.card.id) {
            setName(props.card.name || "");
            setFileBase64(props.card.photo?.base64 || "");
        }
    }, [props.isOpen, props.card]);

    if (!props.isOpen) return null;

    async function handleSubmit() {
        const validation = validateCardFields(name, fileBase64);

        if (!validation.isValid) {
            toastWarning(validation.errors.name || "Preencha todos os valores do Card!");
            return;
        }

        setIsSaving(true);

        let updatedCard = {
            ...props.card, name, photo: { ...props.card.photo, base64: fileBase64 }
        };

        try {
            if (props.card.id) {
                const cardObject = createCardObject(name, fileBase64 || props.card.photo.base64, props.card.id, props.card.photo.id);
                const response = await editCard(cardObject);
                toastSuccess(response);
                deleteThumbnailFromLocalStorage(props.card.id.toString());
            } else {
                const cardObject = createCardObject(name, fileBase64);
                const response = await saveCard(cardObject);
                toastSuccess(response);
            }

            if (props.cards) {
                const updatedCards = props.cards.map((card) =>
                    card.id === updatedCard.id ? updatedCard : card
                );

                if (!props.cards.some((card) => card.id === updatedCard.id))
                    updatedCards.push(updatedCard);

                props.onSave(updatedCard);
            }

            setName("");
            setFileName("Nenhum arquivo selecionado");
            setFileBase64("");

            props.onClose();
        } catch (error) {
            toastError("Erro ao tentar salvar o card");
        } finally {
            setName("");
            setFileName("Nenhum arquivo selecionado");
            setFileBase64("");
            setIsSaving(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (file.type !== "image/jpeg") {
                toastWarning("Apenas arquivos JPG são permitidos.");
                return;
            }

            setFileName(file.name);

            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === "string") {
                    setFileBase64(reader.result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setFileName("Nenhum arquivo selecionado");
            setFileBase64("");
        }
    };

    const handleClose = () => {
        setName("");
        setFileName("Nenhum arquivo selecionado");
        setFileBase64("");
        props.onClose();
    };


    return (
        <div className="modal" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <img className="modal-icon" src={CreateIcon} alt="Ícone criar" />
                    <span className="modal-create-card-titulo">
                        {props.card.id !== 0 ? "Editar Card" : "Criar Card"}
                    </span>
                </div>
                <div className="modal-separator"></div>
                <div className="modal-nome-container">
                    <span className="modal-titulo">DIGITE UM NOME PARA O CARD</span>
                    <div className="modal-input-container">
                        <input
                            type="text"
                            placeholder="Digite o título"
                            className="modal-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="modal-nome-container">
                    <span className="modal-titulo">INCLUA UMA IMAGEM PARA APARECER NO CARD</span>
                    <div className="modal-input-container">
                        <input
                            type="text"
                            className="modal-input"
                            placeholder={fileName}
                            readOnly
                        />
                        <label htmlFor="file-upload" className="file-upload-button">
                            Escolher arquivo
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            className="file-input"
                            accept="image/jpeg"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className="modal-separator-final"></div>
                <button className="cria-card-button" onClick={handleSubmit} disabled={isSaving}>
                    <span className="novo-label">
                        {isSaving ? "Salvando..." : props.card.id ? "Salvar Alterações" : "Criar Card"}
                    </span>
                </button>
            </div>
        </div>
    );
}
