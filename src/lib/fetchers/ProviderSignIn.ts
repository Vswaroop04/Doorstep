export const providerSignUp = async (
  providerReq: providerReq
): Promise<providerResponse> => {
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

interface providerResponse {
  message: string;
  provider?: Provider;
}


interface providerReq {
  email: string;
  password: string;

}

interface Provider {
  id: string;
  name: string;
  password: string;
  email: string;
  lat: number;
  long: number;
  offlineDuration: number;
  serviceName: string;
  mobile: number;
  averageRating?: any;
  createdAt: string;
  updatedAt: string;
  slots?: Slot[];
  offlineSchedules?: OfflineSchedule[];
  ratings?: Rating[];
}

interface Rating {
  id: string;
  userId: string;
  providerId: string;
  punctuality: number;
  professionalism: number;
  problemResolution: number;
  efficiency: number;
  cleanliness: number;
  responseTime: number;
  resolutionTime: number;
  createdAt: string;
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

interface Slot {
  id: string;
  providerId: string;
  date: string;
  slotTime: string;
  slotDuration: number;
  slotStatus: string;
  createdAt: string;
  updatedAt: string;
  meetings?: any[];
}