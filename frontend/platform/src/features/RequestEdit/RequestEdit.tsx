import { useSuggestions } from "@/shared/api/requests";
import RequestEditCard from "@/components/RequestEditCard/RequestEditCard";
import styles from "./requestedit.module.scss";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/app/providers/context/UserContext";
import { useAppSelector } from "@/app/redux/hooks";

export const Requests = () => {
  const navigate = useNavigate();
	const { role } = useUserContext();
  const { data: suggestions, isLoading, isError } = useSuggestions();
	const { profile: reduxProfile } = useAppSelector(
    (state) => state.profile
  );

  const handleNewRequest = () => {
		if (role === "federal" || role === "region"){
    	navigate("/profile/requests/new");
		} else {
			navigate(`/profile/${reduxProfile?.teams[0].name}/requests/new`)
		}
  };

  const handleCardClick = (id: number) => {
		if (role === "federal" || role === "region"){
			navigate(`/profile/requests/${id}/edit`); // Navigate to EditRequest
		} else {
			// navigate(`/profile/requests/${id}/edit`)
		}
  };

  return (
    <>
			<div className={styles.header}>
				<h1 className={styles.headerText}>Заявки</h1>

				<Button
					className="h-[50px] bg-[#463ACB] hover:bg-[#3d33b0] text-[20px] self-end"
					onClick={handleNewRequest}
				>
					Новая заявка
				</Button>
			</div>
      <div className={styles.contet}>
        <div className={styles.profileEditComponenst}>
          {isLoading && <p className="text-black">Загрузка заявок...</p>}
          {isError && (
            <p className="text-red-500">Ошибка при загрузке заявок.</p>
          )}
          {suggestions?.map((suggestion) => (
            <RequestEditCard
              key={suggestion.id}
              suggestion={suggestion}
              onClick={() => handleCardClick(suggestion.id)} // Pass navigation handler
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Requests;
