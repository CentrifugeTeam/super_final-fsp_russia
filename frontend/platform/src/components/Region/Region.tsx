import React, { useState, useEffect, useRef } from "react";
import { IRegion } from "@/interfaces";
import { useNavigate } from "react-router-dom";
import style from "./Region.module.scss";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUserByUsername, useUpdateUser } from "@/shared/api/users"; // Import the hooks
import { validateEmail } from "@/features/Registration/utils/validators";
import { useUserContext } from "@/app/providers/context/UserContext";

const Region: React.FC<{ region: IRegion }> = ({ region }) => {
  const navigate = useNavigate(); // Initialize navigate
  const modalRef = useRef<HTMLDivElement>(null); // Reference for modal window
  const { role } = useUserContext(); // Get user role from context

  // State for modal window
  const [isModalOpen, setModalOpen] = useState(false);
  // State for form inputs and validation errors
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
  });
  const [emailError, setEmailError] = useState<string>("");

  // Check if leader exists to avoid TypeError
  const leader = region.leader || null;
  const leaderFullName = leader
    ? `${leader.last_name} ${leader.first_name} ${
        leader.middle_name || ""
      }`.trim()
    : "<Неизвестно>";

  // Function to handle region click
  const handleRegionClick = () => {
    if (region.representation?.id) {
      navigate(`/regions/region/${region.representation.id}`);
    }
  };

  // Function to handle leader click
  const handleLeaderClick = () => {
    // Проверяем, что роль пользователя "federal", чтобы открыть модальное окно
    if (role === "federal") {
      setModalOpen(true); // Открываем модальное окно
    }
    // Для других ролей (region и usual) не делаем ничего, модальное окно не откроется
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get leader data using the hook
  const {
    data: leaderData,
    isLoading,
    error,
  } = useUserByUsername(leader?.username || "");

  // Use mutation hook to update user data
  const { mutate: updateUser } = useUpdateUser();

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle form submission
  const handleFormSubmit = () => {
    const email = formData.email || leaderData?.email || "";
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError); // Set email error if invalid
      return; // Prevent form submission if the email is invalid
    } else {
      setEmailError(""); // Reset email error if valid
    }
    if (leader.username) {
      const data = {
        ...formData,
        email, // Ensure email is always present
        first_name: formData.first_name || leaderData?.first_name || "",
        last_name: formData.last_name || leaderData?.last_name || "",
        middle_name: formData.middle_name || leaderData?.middle_name || "",
      };
      updateUser({ username: leader.username, data });
      closeModal();
    }
  };

  return (
    <div className={style.region}>
      {/* Add onClick to navigate by URL */}
      <h4
        className={`${style.text} ${style.regionName}`}
        onClick={handleRegionClick}
      >
        {region.representation?.name || "Неизвестный регион"}
      </h4>
      {/* Display leader info if exists */}
      {leader && leader.first_name !== "<Неизвестно>" ? (
        <h4
          className={`${style.text} ${style.leader} ${
            role !== "federal" ? style.disabled : ""
          }`}
          onClick={role === "federal" ? handleLeaderClick : undefined} // Allow click only for federal role
        >
          {leaderFullName}
        </h4>
      ) : (
        <h4 className={`${style.text} ${style.leader}`}>Нет данных о лидере</h4>
      )}
      <h4 className={`${style.text} ${style.contacts}`}>
        {region.representation?.contacts || "Нет контактов"}
      </h4>
      {/* Modal for editing leader info */}
      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.modalContent} ref={modalRef}>
            <h2>Редактировать информацию о региональном представителе</h2>
            {/* Display loading or error state */}
            {isLoading ? (
              <p>Загрузка...</p>
            ) : error ? (
              <p>Ошибка загрузки данных</p>
            ) : (
              <>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="text"
                    id="first_name"
                    value={formData.first_name || leaderData?.first_name || ""}
                    placeholder="Имя"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="text"
                    id="last_name"
                    value={formData.last_name || leaderData?.last_name || ""}
                    placeholder="Фамилия"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="text"
                    id="middle_name"
                    value={
                      formData.middle_name || leaderData?.middle_name || ""
                    }
                    placeholder="Отчество"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    type="email"
                    id="email"
                    value={formData.email || leaderData?.email || ""}
                    placeholder="Email"
                    onChange={handleInputChange}
                  />
                  {/* Display email validation error */}
                  {emailError && <p className="text-red-500">{emailError}</p>}
                </div>
              </>
            )}
            <Button className="bg-[#463ACB]" onClick={handleFormSubmit}>
              Отправить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Region;
