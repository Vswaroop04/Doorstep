import Loading from "@/components/home/Loading";
import { IsLoggedIn } from "@/lib/fetchers/isLoggedIn";
import authAtom from "@/lib/store/AuthType";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";


const AuthInit = ({ children }: { children: React.ReactNode }) => {
  const authSetter = useSetAtom(authAtom);
  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await IsLoggedIn();
      authSetter(data);
      return data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }

  return children;
};

export default AuthInit;
