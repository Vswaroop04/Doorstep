export const userSignup = async (userReq: userReq): Promise<UserResponse> => {
  const response = await fetch("/api/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userReq),
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

interface UserResponse {
  message: string;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  lat: number;
  long: number;
  mobile: number;
  createdAt: string;
}

interface userReq {
  email: string;
  password: string;
  name: string;
  lat: number;
  long: number;
  mobile: number;
}
