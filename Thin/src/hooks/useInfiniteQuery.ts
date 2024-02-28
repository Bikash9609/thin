import { useState, useEffect, useMemo } from 'react';

type FetchFunction<T> = (page: number) => Promise<T[]>;

type Response<T> = [
  T[],
  { loading: boolean; hasMore: boolean; fetchMore: () => void },
];
function useInfiniteQuery<T>(fetchData: FetchFunction<T>): Response<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    async function fetchDataAndAppend() {
      setLoading(true);
      let tries = 0;
      let delay = 1000; // Initial delay in milliseconds

      while (tries < 3) {
        try {
          const response = await fetchData(page);
          setData(prevData => [...prevData, ...response]);
          setHasMore(!!response?.length);
          setLoading(false);
          return; // If successful, exit the function
        } catch (error) {
          setError(error);
          console.error(`Error fetching data (attempt ${tries + 1}):`, error);
          tries++;
          await new Promise(resolve => setTimeout(resolve, delay)); // Delay before next attempt
          delay *= 2; // Double the delay for the next attempt
        }
      }

      // If unsuccessful after three attempts, set loading to false
      setLoading(false);
    }
    if (!error && !loading) {
      if (page === 1) {
        setData([]);
        setHasMore(true);
        fetchDataAndAppend();
      } else {
        fetchDataAndAppend();
      }
    }
  }, [page, error, fetchData]);

  const fetchMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const values: Response<T> = useMemo(() => {
    return [data, { loading, hasMore, fetchMore }];
  }, [data, loading, hasMore]);

  return values;
}

export default useInfiniteQuery;
