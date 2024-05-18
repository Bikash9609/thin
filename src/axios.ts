import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import config from './config/config';
import AsyncStorageUtils from './helpers/asyncStorage';

// Define interface for response data
type ApiResponse<T = any> = T;

// Define interface for error response data
interface ApiError {
  message: string;
}

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: config.baseURL, // Replace with your API base URL
  timeout: 10000, // Adjust timeout as needed
});

export interface RequestOptions {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  url: string;
  data?: any;
  defaultHeaders?: Record<string, string>;
  params?: Record<string, any>;
}

// Define generic request function
export const request = async <T>({
  method,
  url,
  data,
  defaultHeaders,
  params,
}: RequestOptions): Promise<T> => {
  try {
    const token = await AsyncStorageUtils.getItem(config.tokenStorageKey);

    const response: AxiosResponse<ApiResponse<T>> = await api.request<
      ApiResponse<T>
    >({
      method,
      url,
      params,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(defaultHeaders || {}), // Ensure defaultHeaders is an object
      },
      data, // Pass data directly here
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      const axiosError: AxiosError<ApiError> = error;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(axiosError.response.data.message);
      } else if (axiosError.request) {
        // The request was made but no response was received
        throw new Error('No response received from the server');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error('Request failed');
      }
    } else {
      // Error is not AxiosError
      throw new Error('Unknown error occurred');
    }
  }
};
