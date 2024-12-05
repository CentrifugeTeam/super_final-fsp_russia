import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { registerRequest, RegisterInput } from "@/shared/api/registration";

// Define the error response interface
interface RegisterErrorResponse {
  message: string; // Add other fields if necessary
}

export const useRegisterUserMutation = () => {
  const mutation = useMutation<
    number,
    AxiosError<RegisterErrorResponse>,
    RegisterInput
  >({
    mutationFn: registerRequest,
    onError: (error: AxiosError<RegisterErrorResponse>) => {
      console.error(
        "Registration error:",
        error.response?.status,
        error.response?.data
      );
    },
    onSuccess: (status: number) => {
      console.log("User registered successfully with status:", status);
    },
  });

  return mutation;
};
