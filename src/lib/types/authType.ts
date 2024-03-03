export default interface AuthType {
  message: string;
  user?: User;
  provider?: Provider;
  admin?: Admin;
}
interface Admin {
  name: string;
  email: string;
}

export interface Provider {
  id: string;
  name: string;
  password: string;
  email: string;
  lat: number;
  long: number;
  offlineDuration: number;
  serviceName: string;
  mobile: number;
  onlinePrice: number;
  offlinePrice: number;
  averageRating?: any;
  slotsArray?: number[];
  createdAt: string;
  updatedAt: string;
  slots?: Slot[];
  offlineSchedules?: OfflineSchedule[];
  ratings?: Rating[];
}
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  lat?: number;
  long?: number;
  mobile: number;
  createdAt: string;
  offlineSchedules?: OfflineSchedule[];
  meetings?: Meeting[];
}

export interface Meeting {
  id: string;
  slotId: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  slot?: Slot;
  user?: User;
  provider?: Provider;
}

export interface Slot {
  id: string;
  providerId: string;
  date: string;
  slotTime: string;
  slotDuration: number;
  slotStatus: string;
  createdAt: string;
  updatedAt: string;
  meetings?: Meeting[];
  provider?: Provider;
}

export interface OfflineSchedule {
  id: string;
  userId: string;
  providerId: string;
  date: string;
  offlineSlotTime: string;
  offlineSlotDuration: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
  provider?: Provider;
  user?: User;
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
  provider?: Provider;
}
