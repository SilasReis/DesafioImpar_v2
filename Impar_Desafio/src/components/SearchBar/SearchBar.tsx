import { useState } from "react";
import ISearchBar from "../../types/ISearchBar";
import ICard from "../../types/ICard";
import { fetchCardsByName } from "../../services/Card/serviceCard";
import '../SearchBar/SearchBar.css'
import { toastError } from "../../utils/toastHot";

function App(props: ISearchBar) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [localCards, setLocalCards] = useState<ICard[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);

        if (!event.target.value.length) {
            props.onSearchResult(localCards, true);
            return;
        }
    };

    const handleSearch = async () => {
        if (!localCards.length)
            setLocalCards(props.cards.slice(0, 10));

        if (!searchTerm) {
            props.onSearchResult(localCards, true);
            return;
        }

        const localResults = props.cards.filter((card) =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (localResults.length > 0) {
            props.onSearchResult(localResults, false);
        } else {
            try {
                fetchCardsByName(searchTerm).then((data => props.onSearchResult(data, false)));

            } catch (error) {
                toastError("Erro ao tentar buscar os cards pelo nome!");
            }
        }
    };

    return (
        <div className="busca-container">
            <input
                type="text"
                placeholder="Digite aqui sua busca..."
                className="busca-input"
                value={searchTerm}
                onChange={handleInputChange}
            />
            <button className="busca-button" onClick={handleSearch}></button>
        </div>
    );
};

export default App;