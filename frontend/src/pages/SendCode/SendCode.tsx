import { BeatLoader } from "react-spinners";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styles from "./sendcode.module.scss";
import { fetchYandexAuth } from "@/shared/api/auth";

export const SendCode = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  const mutation = useMutation({
    mutationFn: fetchYandexAuth,
    onSuccess: (data) => {
      console.log("Successfully authenticated:", data);
    },
    onError: (error) => {
      console.error("Error during authentication:", error);
    },
  });

  useEffect(() => {
    if (code) {
      mutation.mutate(code);
    } else {
      console.error("Code not found in URL");
    }
  }, [code, mutation]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {mutation.status === "pending" && (
          <BeatLoader color="#ffffff" margin={10} size={39} />
        )}
        {mutation.status === "success" && <p>Successfully authenticated</p>}
        {mutation.status === "error" && (
          <p>Error occurred during authentication</p>
        )}
      </div>
    </div>
  );
};

export default SendCode;
