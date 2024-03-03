export const providerSignUp = async (
  providerReq: providerReq
): Promise<providerResponse> => {
  const response = await fetch("/api/provider/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(providerReq),
  });

  const res = await response.json();

  if (res.error) {
    if (res.error.detail) {
      throw Error(res.error.detail);
    } else {
      throw Error("SignUp Error");
    }
  }
  return res;
};

interface providerResponse {
  message: string;
  provider?: Provider;
}

export interface Provider {
  slots: number[];
  id: string;
  name: string;
  email: string;
  lat: number;
  long: number;
  mobile: number;
  offlineDuration: number;
  createdAt: string;
  updatedAt: string;
}

interface providerReq {
  email: string;
  password: string;
  name: string;
  lat: number;
  long: number;
  slots: number[];
  offlinePrice: number;
  onlinePrice: number;
  mobile: number;
}
