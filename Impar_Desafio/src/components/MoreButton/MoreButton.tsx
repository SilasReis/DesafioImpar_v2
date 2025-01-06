import IMoreButton from "../../types/IMoreButton";
import "../MoreButton/MoreButton.css"

function App(props: IMoreButton) {
  if (!props.hasMore)
    return null;

  return (
    <div className="hasMore-container">
      <button onClick={props.onClick} className="hasMore-button" disabled={props.isLoading}>
        {props.isLoading ? "Carregando..." : "Ver Mais"}
      </button>
    </div>
  );
}

export default App