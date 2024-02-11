import AuthType from "../types/authType";
export const IsLoggedIn = async (): Promise<AuthType> => {
  const response = await fetch("/api/auth/isLoggedIn", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const res = await response.json();

  return res;
};
