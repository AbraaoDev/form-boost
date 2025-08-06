import { api } from "../lib/axios";

export interface GetProfileResponse {
  user: {
    id: string;
    name: string | null;
    email: string;
  }
}

export async function getProfile(){
  const response = await api.get<GetProfileResponse>('/profile')
  return response.data
}