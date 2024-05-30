import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import NewsItem from './NewsItem';
import useInfiniteQuery from '../../hooks/useInfiniteQuery';
import { request } from '../../axios';
import AuthLoading from '../../components/AuthLoading';
import EndOfPosts from '../../components/EndOfPosts';
import LoadingOfPosts from '../../components/LoadingOfPosts';
import useCarouselGuide from './useCarouselGuide';
import useCarouselPrefetcher from './useCarousel';
import { useAppBar } from '../../context/AppBarProvider';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export interface PostResponse {
  uuid: string;
  title: string;
  infoText: string;
  imageUrl: string;
  imageAttr: string;
  imageAttrUrl: string;
  link: string;
  subtitle: string;
  attributeKeyword: string;
  datePublished: string;
  author_name: string;
  author_uuid: string;
  category_name: string;
  category_uuid: string;
  likes: number;
  dislikes: number;
  viewer_reaction?: string;
  author_website?: string;
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

const Navigator = () => {
  const [viewedPosts, setViewedPosts] = useState<string[]>([]);
  const [data, { fetchMore, loading, refreshData, hasMore }] =
    useInfiniteQuery(fetchPosts);

  const { carouselRef, onScroll } = useCarouselGuide({
    enabled: !!(!loading && data.length),
  });

  useCarouselPrefetcher({
    enabled: hasMore,
    viewedItems: viewedPosts.length,
    isLoading: loading,
    totalItems: data.length ?? 0,
    onPrefetch: fetchMore,
  });

  const handleItemViewed = React.useCallback(
    (slideIndex: number) => {
      onScroll();
      const item = data[slideIndex];

      if (item && item.uuid && !viewedPosts.includes(item.uuid)) {
        updatePostViewed(item);
        setViewedPosts(prev => [...prev, item.uuid]);
      }
    },
    [data, viewedPosts],
  );

  useEffect(() => {
    if (data?.[0] && !viewedPosts.includes(data?.[0]?.uuid)) {
      handleItemViewed(0);
    }
  }, [data]);

  const renderNewsItem = useCallback(({ item }: { item: PostResponse }) => {
    if (!item.uuid) {
      if ((item as any).noItemScreen) {
        return <EndOfPosts refreshData={refreshData} />;
      }
      if ((item as any).loadingScreen) {
        return <LoadingOfPosts />;
      }
    }

    return (
      <NewsItem
        uuid={item.uuid}
        author={item.author_name}
        datePublished={item.datePublished}
        website={item.author_website as string}
        link={item.link}
        subtitle={item.subtitle}
        imageUrl={item.imageUrl}
        title={item.title}
        attributeKeyword={item.attributeKeyword}
        infoText={item.infoText}
        likes={item.likes}
        dislikes={item.dislikes}
        imageAttr={{ url: item.imageAttrUrl, title: item.imageAttr }}
        viewerReaction={(item.viewer_reaction as any) ?? undefined}
        refreshData={refreshData}
      />
    );
  }, []);

  if (loading && !data.length) return <AuthLoading />;

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={data}
        renderItem={renderNewsItem}
        keyExtractor={item => {
          if (!(item as any).uuid) return Object.keys(item)[0];
          return item.uuid;
        }}
        sliderWidth={SCREEN_WIDTH} // Set sliderWidth instead of sliderHeight for horizontal scrolling
        itemWidth={SCREEN_WIDTH} // Set itemWidth instead of itemHeight for horizontal scrolling
        vertical={false} // Set vertical to false for horizontal scrolling
        swipeThreshold={10}
        scrollEnabled
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        onSnapToItem={handleItemViewed}
        activeSlideOffset={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Navigator;
