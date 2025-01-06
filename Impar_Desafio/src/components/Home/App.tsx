import { useEffect, useState } from 'react';
import './App.css'
import Card from '../Card/Card'
import ICard from '../../types/ICard'
import { fetchCards } from '../../services/Card/serviceCard'
import MoreButton from '../MoreButton/MoreButton';
import SearchBar from '../SearchBar/SearchBar';
import NewEditCardModal from '../NewEditCard/NewEditCard';
import { Toaster } from 'react-hot-toast';
import DeleteCardModal from '../DeleteCard/DeleteCard';

function App() {
  const [cards, setCards] = useState<ICard[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasLoading, setHasLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    loadCards(currentPage);
  }, [currentPage]);


  const loadCards = async (page: number) => {
    setHasLoading(true);
    const newCards = await fetchCards(page, 10);

    setCards((prevCards) => {
      const existingKeys = new Set(prevCards.map((card) => card.id));

      const filteredCards = newCards.filter((card) => !existingKeys.has(card.id));

      return [...prevCards, ...filteredCards];
    });

    if (newCards.length < 10) {
      setHasMore(false);
    }
    setHasLoading(false);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleSearchResult = (results: ICard[], hasMoreResults: boolean) => {
    setCurrentPage(1);
    setCards(results);
    setHasMore(hasMoreResults);
  };


  const handleOpenModal = (card?: ICard) => {
    setSelectedCard(card || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal =(card: ICard) => {
    setSelectedCard(card);
    setIsDeleteModalOpen(true);
};

const handleCloseDeleteModal = () => {
    setSelectedCard(null);
    setIsDeleteModalOpen(false);
};

  const handleSaveCard = async (updatedCard: ICard) => {
    if (updatedCard.id) {
      setCards((prevCards) =>
        prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      );
    } else
      setCards((prevCards) => [...prevCards, { ...updatedCard, id: Date.now() }]);

    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = (deletedCard: { id: number }) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== deletedCard.id));
};


  return (
    <>
      <div className="container">
        <div className="header">
          <div className="logo-teste"></div>
        </div>
        <div className="busca-fundo">
          <SearchBar cards={cards} onSearchResult={handleSearchResult} />
        </div>
        <div className="resultado-busca">Resultado de busca
          <button className="novo-button" onClick={() => handleOpenModal()}>
            <span className="novo-label">Novo Card</span>
          </button>
        </div>
        <div className="cards-container">
          {cards.map((card) => (
            <Card
              key={card.id}
              {...card}
              onEdit={() => handleOpenModal(card)}
              onDelete={() => handleOpenDeleteModal(card)}
            />
          ))}

          <NewEditCardModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            cards={cards}
            card={selectedCard || { id: 0, name: "", status: true, photo: { id: 0, base64: "" } }}
            onSave={handleSaveCard}
          />

          <DeleteCardModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            cards={cards}
            card={selectedCard!}
            onDelete={handleDeleteCard}
          />

        </div>
        <MoreButton
          hasMore={hasMore}
          onClick={handleLoadMore}
          isLoading={hasLoading}
        />
      </div>
      <Toaster />
    </>
  )
}

export default App
