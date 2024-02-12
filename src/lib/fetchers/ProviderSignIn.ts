import AuthType from "../types/authType";

export const providerSignUp = async (
  providerReq: providerReq
): Promise<AuthType> => {
  const response = await fetch("/api/provider/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(providerReq),
  });

  const res = await response.json();


  if (!response.ok) {
    throw Error(res?.message || "Invalid Credentials");
  }
  return res;
};



interface providerReq {
  email: string;
  password: string;

}

