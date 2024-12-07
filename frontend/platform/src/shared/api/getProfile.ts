import { useQuery } from "@tanstack/react-query";
import { api } from "./base";

const fetchUserProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    // staleTime: 1000 * 60 * 5, // 5 минут данные считаются свежими
  });
};
