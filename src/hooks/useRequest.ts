import { useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { request, RequestOptions } from '../axios'; // Import your request function

interface UseRequestOptions<T> extends RequestOptions {
  initialData?: T;
  onSuccess?: (data: T) => void;
}

const useRequest = <T>({
  initialData,
  onSuccess,
  ...options
}: UseRequestOptions<T>) => {
  const originalData = useRef<T | undefined>(undefined);
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const [failureCount, setFailureCount] = useState<number>(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const responseData = await request<T>(options);
      setData(responseData);
      // @ts-ignore
      originalData.current = Array.isArray(responseData)
        ? // @ts-ignore
          [...(originalData.current ?? []), ...responseData]
        : responseData;
      if (onSuccess) onSuccess(responseData);
    } catch (err) {
      setError(err as Error);
      setFailureCount(prevCount => prevCount + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const retry = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.url, options.method, options.data, options.params]);

  return { data, isLoading, error, retry, failureCount, setData, originalData };
};

export default useRequest;
