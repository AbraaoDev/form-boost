import { api } from "@/lib/axios";

export interface GetFormsQuery {
  page?: number | null
  lengthPage?: number | null
  name?: string | null
  order?: string | null
}

export interface GetFormsResponse {
  page_active: number;
  total_pages: number;
  total_itens: number;
  forms: Array<{
    id: string;
    name: string;
    schema_version: number ;
    createdAt: string;
    isActive?: boolean;
    deletedAt?: string ;
    userDeleted?: string ;
  }>;
}

export async function getForms({ page, lengthPage, name, order }: GetFormsQuery){
 const response = await api.get<GetFormsResponse>('/forms', {
  params: {
    page,
    length_page: lengthPage,
    name,
    order
  }
 }) 
 return response.data
}