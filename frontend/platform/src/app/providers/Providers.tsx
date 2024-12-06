import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/app/redux/store";

interface IProviders {
  children: JSX.Element;
}

const queryClient = new QueryClient();

export const Providers: FC<IProviders> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
};

export default Providers;
