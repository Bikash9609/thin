import { useEffect, useRef, useState } from 'react';
import { request, RequestOptions } from '../axios'; // Import your request function
import AsyncStorageUtils from '../helpers/asyncStorage';

export interface UseRequestOptions<T> extends RequestOptions {
  initialData?: T;
  onSuccess?: (data: T) => void;
  cacheTime?: number; // Cache time in milliseconds
}

const CACHE_PREFIX = 'cache_';

const getCacheKey = (url: string, method: string, data: any, params: any) => {
  return `${CACHE_PREFIX}${url}_${method}_${JSON.stringify(data)}_${JSON.stringify(params)}`;
};

const useRequest = <T>({
  initialData,
  onSuccess,
  cacheTime = 60000, // Default cache time to 60 seconds
  ...options
}: UseRequestOptions<T>) => {
  const originalData = useRef<T | undefined>(undefined);
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const [failureCount, setFailureCount] = useState<number>(0);

  const fetchData = async () => {
    setIsLoading(true);
    const cacheKey = getCacheKey(
      options.url,
      options.method,
      options.data,
      options.params,
    );

    try {
      // Check cache
      const cachedResponse = await AsyncStorageUtils.getItem(cacheKey);
      if (cachedResponse) {
        const { data: cachedData, timestamp } = JSON.parse(cachedResponse);
        const isCacheValid = Date.now() - timestamp < cacheTime;

        if (isCacheValid) {
          setData(cachedData);
          setIsLoading(false);
          if (onSuccess) onSuccess(cachedData);
          return;
        } else {
          // Invalidate cache
          await AsyncStorageUtils.removeItem(cacheKey);
        }
      }

      // Fetch new data if cache is invalid or doesn't exist
      const responseData = await request<T>(options);
      setData(responseData);
      // @ts-ignore
      originalData.current = Array.isArray(responseData)
        ? // @ts-ignore
          [...(originalData.current ?? []), ...responseData]
        : responseData;

      // Save to cache
      await AsyncStorageUtils.setItem(
        cacheKey,
        JSON.stringify({ data: responseData, timestamp: Date.now() }),
      );

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
