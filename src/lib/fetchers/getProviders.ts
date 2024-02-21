import { TypeOfflineSchedules } from "../routes";

export const getProviders = async (
  InputObj: TProviderInputType
): Promise<{ providers: TypeProviderObj[] }> => {
  console.log(InputObj);
  const response = await fetch("/api/provider", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(InputObj),
  });

  if (!response.ok) {
    throw new Error("Failed to perform search");
  }

  const data = await response.json();
  return data;
};

export interface TProviderInputType {
  page?: number;
  serviceName?: string;
  lat?: number;
  long?: number;
  sort?: {
    rating?: number;
    distance?: number;
  };
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

export interface TypeProviderObj {
  id: string;
  name: string;
  email: string;
  lat: number;
  long: number;
  offlineDuration: number;
  offlineSchedules: TypeOfflineSchedules[];
  serviceName: string;
  mobile: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
  slots: Slot[];
  ratings: Rating[];
}
