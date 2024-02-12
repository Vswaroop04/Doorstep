import AuthType from "../types/authType";
export const LogOut = async (): Promise<AuthType> => {
  const response = await fetch("/api/auth/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const res = await response.json();

  return res;
};
