import { useState, useEffect, useCallback, useMemo } from 'react';
import { uniqBy } from 'lodash';

type FetchFunction<T> = (page: number) => Promise<T[]>;
type Response<T> = [
  T[],
  {
    loading: boolean;
    hasMore: boolean;
    fetchMore: () => void;
    refreshData: () => void;
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    error: any;
    fetchedPages: number[];
  },
];

function useInfiniteQuery<T>(fetchData: FetchFunction<T>): Response<T> {
  const [state, setState] = useState({
    data: [] as T[],
    loading: false,
    hasMore: true,
    page: 1,
    error: null as any,
    fetchedPages: [] as number[],
  });

  const fetchDataAndAppend = useCallback(async () => {
    if (!state.hasMore || state.loading) return;

    setState(prevState => ({ ...prevState, loading: true, error: null }));

    try {
      const response = await fetchData(state.page);
      const hasMoreItem = response.length >= (__DEV__ ? 5 : 20);

      console.log(response.length);

      setState(prevState => {
        const newData = !hasMoreItem
          ? [...prevState.data, ...response, { noItemScreen: true } as any]
          : uniqBy([...prevState.data, ...response], (item: any) => item.uuid);

        const filteredData = newData.filter(
          item => !(item as any).loadingScreen && !(item as any).adsScreen,
        );

        const finalData = filteredData.reduce((acc, item, index) => {
          acc.push(item);
          if ((index + 1) % 5 === 0) {
            acc.push({ adsScreen: true } as any);
          }
          return acc;
        }, [] as T[]);

        return {
          ...prevState,
          data: finalData,
          loading: false,
          hasMore: hasMoreItem,
          fetchedPages: [...prevState.fetchedPages, prevState.page],
        };
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setState(prevState => ({
        ...prevState,
        loading: false,
        error,
      }));
    }
  }, [state.hasMore, state.loading, state.page, fetchData]);

  useEffect(() => {
    if (
      state.hasMore &&
      !state.loading &&
      !state.error &&
      !state.fetchedPages.includes(state.page)
    ) {
      fetchDataAndAppend();
    }
  }, [
    state.page,
    state.hasMore,
    state.loading,
    state.error,
    state.fetchedPages,
    fetchDataAndAppend,
  ]);

  const fetchMore = useCallback(() => {
    if (
      state.hasMore &&
      !state.loading &&
      state.fetchedPages.includes(state.page)
    ) {
      setState(prevState => ({
        ...prevState,
        page: prevState.page + 1,
        loading: true,
      }));
      setTimeout(() => fetchDataAndAppend().catch(error => {}), 20);
    }
  }, [state]);

  const refreshData = useCallback(() => {
    console.log('Refresh data called');
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        data: [],
        hasMore: true,
        page: 1,
        error: null,
        fetchedPages: [],
      }));
      fetchDataAndAppend().catch(error => {});
    }, 20);
  }, []);

  return useMemo(
    () => [
      state.data,
      {
        loading: state.loading,
        hasMore: state.hasMore,
        fetchMore,
        refreshData,
        setData: (newData: React.SetStateAction<T[]>) =>
          setState(prevState => ({
            ...prevState,
            data:
              typeof newData === 'function' ? newData(prevState.data) : newData,
          })),
        error: state.error,
        fetchedPages: state.fetchedPages,
      },
    ],
    [state, fetchMore, refreshData],
  );
}

export default useInfiniteQuery;
