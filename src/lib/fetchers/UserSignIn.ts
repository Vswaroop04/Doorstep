export const userSignup = async (userReq: userReq): Promise<UserResponse> => {
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

interface UserResponse {
  message: string;
  user?: User;
}

interface userReq {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  lat: number;
  long: number;
  mobile: number;
  createdAt: string;
  offlineSchedules?: OfflineSchedule[];
  meetings?: Meeting[];
}

interface Meeting {
  id: string;
  slotId: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  slot?: Slot;
}

interface Slot {
  id: string;
  providerId: string;
  date: string;
  slotTime: string;
  slotDuration: number;
  slotStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface OfflineSchedule {
  id: string;
  userId: string;
  providerId: string;
  date: string;
  offlineSlotTime: string;
  offlineSlotDuration: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
}
