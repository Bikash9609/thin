import { useState, useEffect, useMemo, useCallback } from 'react';
import { uniqBy } from '../helpers/arrays';

type FetchFunction<T> = (page: number) => Promise<T[]>;

type Response<T> = [
  T[],
  {
    loading: boolean;
    hasMore: boolean;
    fetchMore: () => void;
    refreshData: () => void;
  },
];
function useInfiniteQuery<T>(fetchData: FetchFunction<T>): Response<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<any | null>(null);

  const addLoadingScreen = useCallback((remove?: boolean) => {
    if (remove) {
      setData(prevData =>
        prevData.filter(item => !(item as any).loadingScreen),
      );
      return;
    }
    setData(prevData => [...prevData, { loadingScreen: true } as any]);
  }, []);

  const fetchDataAndAppend = useCallback(async () => {
    setLoading(true);
    let tries = 0;
    let delay = 1000; // Initial delay in milliseconds

    // Add placeholder loading screen
    addLoadingScreen();

    while (tries < 3) {
      try {
        const response = await fetchData(page);
        setHasMore(!!response?.length);
        setData(prevData =>
          !response?.length
            ? [...prevData, { noItemScreen: true } as any]
            : uniqBy([...prevData, ...response], (item: any) => item.uuid),
        );
        addLoadingScreen(true);
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

    // Remove placeholder loading screen
    addLoadingScreen(true);

    // If unsuccessful after three attempts, set loading to false
    setLoading(false);
  }, []);

  useEffect(() => {
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
    if (hasMore && !loading && data.length) setPage(prevPage => prevPage + 1);
  };

  const refreshData = () => {
    setPage(1);
    setData([]);
    setHasMore(true);
    setLoading(false);
    setError(null);
    setTimeout(() => {
      fetchDataAndAppend();
    }, 5);
  };

  const values: Response<T> = useMemo(() => {
    return [data, { loading, hasMore, fetchMore, refreshData }];
  }, [data, loading, hasMore]);

  return values;
}

export default useInfiniteQuery;
