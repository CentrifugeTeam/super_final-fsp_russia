import { useSuggestions } from "@/shared/api/requests";
import RequestEditCard from "@/components/RequestEditCard/RequestEditCard";
import styles from "./requestedit.module.scss";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Requests = () => {
  const navigate = useNavigate();
  const { data: suggestions, isLoading, isError } = useSuggestions();

  const handleNewRequest = () => {
    navigate("/profile/requests/new");
  };

  const handleCardClick = (id: number) => {
    navigate(`/profile/requests/${id}/edit`); // Navigate to EditRequest
  };

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Заявки</h1>
        <Button
          className="h-[50px] bg-[#463ACB] text-[20px] mt-5"
          onClick={handleNewRequest}
        >
          Новая заявка
        </Button>
      </div>

      <div className={styles.profileEditComponenst}>
        {isLoading && <p className="text-black">Загрузка заявок...</p>}
        {isError && <p className="text-red-500">Ошибка при загрузке заявок.</p>}
        {suggestions?.map((suggestion) => (
          <RequestEditCard
            key={suggestion.id}
            suggestion={suggestion}
            onClick={() => handleCardClick(suggestion.id)} // Pass navigation handler
          />
        ))}
      </div>
    </div>
  );
};

export default Requests;
