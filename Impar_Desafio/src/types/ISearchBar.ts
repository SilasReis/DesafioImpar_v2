import ICard from "./ICard";

export default interface ISearchBar {
    cards: ICard[]; 
    onSearchResult: (results: ICard[], hasMore: boolean) => void; 
  }