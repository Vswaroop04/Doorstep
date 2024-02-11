import { IsLoggedIn } from "@/lib/fetchers/isLoggedIn";
import authAtom from "@/lib/store/AuthType";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

const AuthInit = () => {
  const authSetter = useSetAtom(authAtom);
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await IsLoggedIn();
      console.log(data)
      authSetter(data);
      return data;
    },
  });
  return null;
};


export default AuthInit