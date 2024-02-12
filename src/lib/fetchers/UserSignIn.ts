import AuthType from "../types/authType";

export const userSignup = async (userReq: userReq): Promise<AuthType> => {
  const response = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userReq),
  });

  const res = await response.json();

  if (!response.ok) {
    throw Error(res?.message || "Invalid Credentials");
  }
  return res;
};



interface userReq {
  email: string;
  password: string;
}
