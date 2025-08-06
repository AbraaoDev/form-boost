import { api } from "@/lib/axios";

export interface DeleteFormParams {
  formId: string;
}

export async function deleteForm({formId} : DeleteFormParams){
  await api.delete(`/forms/${formId}`) 
 }
 