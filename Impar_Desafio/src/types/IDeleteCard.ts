import ICard from "./ICard";

export default interface INewEditCard{
    card: ICard;
    cards: ICard[];
    isOpen: boolean;
    onClose: () => void;
    onDelete: (deleteCard: ICard) => void;
}