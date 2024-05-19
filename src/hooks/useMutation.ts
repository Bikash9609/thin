import { useState } from 'react';
import { AxiosError } from 'axios';
import { request, RequestOptions } from '../axios'; // Import your request function

interface UseMutationOptions<T> extends RequestOptions {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  data?: RequestOptions['data'];
}

const useMutation = <T>({
  onSuccess,
  onError,
  ...options
}: UseMutationOptions<T>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  const mutate = async (
    data?: RequestOptions['data'],
    _options?: Partial<UseMutationOptions<T>>,
  ) => {
    setIsLoading(true);
    try {
      const responseData = await request<T>({
        ...options,
        ..._options,
        data: options?.data ?? data,
      });
      if (onSuccess) {
        onSuccess(responseData);
      }
    } catch (err) {
      setError(err as Error);
      if (onError) {
        onError(err as Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

export default useMutation;
