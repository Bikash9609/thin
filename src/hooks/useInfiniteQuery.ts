import { useState, useEffect, useCallback, useMemo } from 'react';
import { uniqBy } from 'lodash'; // Make sure to import uniqBy or replace with your own implementation

type FetchFunction<T> = (page: number) => Promise<T[]>;
type Response<T> = [
  T[],
  {
    loading: boolean;
    hasMore: boolean;
    fetchMore: () => void;
    refreshData: () => void;
    setData: React.Dispatch<React.SetStateAction<T[]>>;
  },
];

function useInfiniteQuery<T>(
  fetchData: FetchFunction<T>,
  withoutAdditionalScreen?: boolean,
): Response<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<any | null>(null);
  const [fetchedPages, setFetchedPages] = useState<number[]>([]);

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
    if (!hasMore || loading) return;

    setError(null);
    setLoading(true);
    let tries = 0;
    let delay = 1000; // Initial delay in milliseconds

    // Add placeholder loading screen
    if (data.length) addLoadingScreen();

    while (tries < 3) {
      try {
        setFetchedPages(prev => [...prev, page]);
        const response = await fetchData(page);
        const hasMoreItem = !!(
          response &&
          response.length > 0 &&
          response.length >= (__DEV__ ? 5 : 20)
        );
        setHasMore(hasMoreItem);
        setData(prevData => {
          const newData =
            !hasMoreItem && !withoutAdditionalScreen
              ? [
                  ...prevData,
                  ...(response ?? []),
                  { noItemScreen: true } as any,
                ]
              : uniqBy([...prevData, ...response], (item: any) => item.uuid);

          // Filter out loadingScreen items
          const filteredData = newData.filter(
            item => !(item as any).loadingScreen || (item as any).adsScreen,
          );

          // Add adsScreen: true after every 5th item
          const finalData = [];
          for (let i = 0; i < filteredData.length; i++) {
            finalData.push(filteredData[i]);
            if ((i + 1) % 5 === 0) {
              finalData.push({ adsScreen: true } as any);
            }
          }

          return finalData;
        });
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
  }, [
    hasMore,
    loading,
    page,
    data,
    addLoadingScreen,
    fetchData,
    withoutAdditionalScreen,
  ]);

  useEffect(() => {
    if (!fetchedPages.includes(page) && !loading && !error)
      fetchDataAndAppend();
  }, [page, fetchDataAndAppend, loading, error]);

  const fetchMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const refreshData = () => {
    setFetchedPages([]);
    setData([]);
    setPage(1);
    setLoading(false);
    setError(null);
    setHasMore(true);
  };

  const values: Response<T> = useMemo(() => {
    return [
      data,
      {
        loading,
        hasMore,
        fetchMore,
        refreshData,
        setData,
        error,
        fetchedPages,
      },
    ];
  }, [data, loading, hasMore]);

  return values;
}

export default useInfiniteQuery;
