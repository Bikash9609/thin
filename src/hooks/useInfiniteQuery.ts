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
  },
];

function useInfiniteQuery<T>(
  fetchData: FetchFunction<T>,
  withoutAdditionalScreen?: boolean,
): Response<T> {
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
    let tries = 0;
    let delay = 1000;

    while (tries < 3) {
      try {
        const response = await fetchData(state.page);
        const hasMoreItem = response && response.length >= (__DEV__ ? 5 : 20);

        setState(prevState => {
          const newData =
            !hasMoreItem && !withoutAdditionalScreen
              ? [...prevState.data, ...response, { noItemScreen: true } as any]
              : uniqBy(
                  [...prevState.data, ...response],
                  (item: any) => item.uuid,
                );

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

        return;
      } catch (error) {
        console.error(`Error fetching data (attempt ${tries + 1}):`, error);
        tries++;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }

    setState(prevState => ({
      ...prevState,
      loading: false,
      error: 'Failed to fetch data',
    }));
  }, [
    state.hasMore,
    state.loading,
    state.page,
    state.data.length,
    fetchData,
    withoutAdditionalScreen,
  ]);

  useEffect(() => {
    if (
      !state.fetchedPages.includes(state.page) &&
      !state.loading &&
      !state.error
    ) {
      fetchDataAndAppend();
    }
  }, [
    state.page,
    fetchDataAndAppend,
    state.loading,
    state.error,
    state.fetchedPages,
  ]);

  const fetchMore = useCallback(() => {
    if (state.hasMore && !state.loading) {
      setState(prevState => ({ ...prevState, page: prevState.page + 1 }));
    }
  }, [state.hasMore, state.loading]);

  const refreshData = useCallback(() => {
    setState({
      data: [],
      loading: false,
      hasMore: true,
      page: 1,
      error: null,
      fetchedPages: [],
    });
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
