import React, { createContext, useState, useContext, ReactNode } from 'react';
import useInfiniteQuery from '../hooks/useInfiniteQuery';
import { PostResponse } from '../Screens/Home';
import { request } from '../axios';
import useFirebasePushNotifications from '../hooks/useFcmToken';

interface InViewContextProps {
  currentIndex: number;
  totalViewed: number;
  viewedItems: string[];
  setCurrentIndex: (index: number) => void;
  addItemToViewed: (index: number) => void;
  data: PostResponse[];
  fetchMore: () => void;
  hasMore: boolean;
  loading: boolean;
  refreshData: () => void;
}

const fetchPosts = async (page: number) => {
  const res = await request<PostResponse[]>({
    method: 'get',
    url: '/posts',
    params: { page },
  });
  return res;
};

const updatePostViewed = async (item: PostResponse) => {
  try {
    if (!item) return;
    await request({
      method: 'post',
      url: `/post/view/${item.uuid}`,
    });
    console.log('Post viewed', item.uuid);
  } catch (error) {
    console.error(`Error viewing post ${item.uuid}`);
  }
};

const HomeContext = createContext<InViewContextProps | undefined>(undefined);

export const HomeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  useFirebasePushNotifications();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewedItems, setViewedItems] = useState<string[]>([]);
  const [data, { fetchMore, loading, refreshData, hasMore }] =
    useInfiniteQuery(fetchPosts);

  const addItemToViewed = (slideIndex: number) => {
    const item = data[slideIndex];

    if (item && item.uuid && !viewedItems.includes(item.uuid)) {
      updatePostViewed(item);
      setViewedItems(prevItems => {
        if (!prevItems.includes(item.uuid)) {
          return [...prevItems, item.uuid];
        }
        return prevItems;
      });
    }
  };

  return (
    <HomeContext.Provider
      value={{
        currentIndex,
        totalViewed: viewedItems.length,
        viewedItems,
        setCurrentIndex,
        data,
        fetchMore,
        loading,
        refreshData,
        addItemToViewed,
        hasMore,
      }}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = (): InViewContextProps => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useInViewContext must be used within an InViewProvider');
  }
  return context;
};
