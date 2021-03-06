import accessToken from "@/global/apiAccessToken";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import { ItemList } from "../validation";

interface TokenHeader extends AxiosRequestHeaders {
  authorization: string;
}

const API_URL = process.env.VUE_APP_API_URL;
let waiting = false;

const extractErrorMessage = (error: AxiosError) => {
  const { response } = error;
  const { data } = response as any;
  return data?.response;
};

export const usePost = async (
  endpoint: string,
  payload: any,
  headers?: TokenHeader
) => {
  let data: any, error: any;
  if (!waiting) {
    waiting = true;

    const token = accessToken.getToken;
    if (token && !headers) headers = await accessToken.getHeader();

    try {
      const { data: responseData } = await axios.post(
        `${API_URL}/${endpoint}`,
        payload,
        { headers }
      );
      data = responseData;
    } catch (err) {
      error = err;
      if (err instanceof AxiosError) {
        error.message = extractErrorMessage(err);
      }
    } finally {
      waiting = false;
    }
  }
  return { data, error };
};

export const useGet = async (
  endpoint: string
): Promise<{ error: any; data: ItemList }> => {
  const headers = await accessToken.getHeader();
  let data: any, error: any;
  try {
    const { data: responseData } = await axios.get(`${API_URL}/${endpoint}`, {
      headers,
    });
    data = responseData;
  } catch (err) {
    error = err;
    if (err instanceof AxiosError) {
      error.message = extractErrorMessage(err);
    }
  }
  return { data, error };
};

export const useDelete = async (
  endpoint: string,
  id: string
): Promise<{ error: any }> => {
  const headers = await accessToken.getHeader();
  let error: any;
  try {
    await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers });
  } catch (err) {
    error = err;
    if (err instanceof AxiosError) {
      error.message = extractErrorMessage(err);
    }
  }
  return { error };
};
