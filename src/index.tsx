import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import NewsItem from './Screens/Home';
import useInfiniteQuery from './hooks/useInfiniteQuery';
import { request } from './axios';
import AuthLoading from './components/AuthLoading';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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

  const handleItemViewed = React.useCallback(
    (slideIndex: number) => {
      const item = data[slideIndex];
      if (item && !viewedPosts.includes(item.uuid)) {
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

  const renderNewsItem = useCallback(
    ({ item }: { item: PostResponse }) => (
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
    ),
    [],
  );

  if (loading && !data.length) return <AuthLoading />;
  if (!loading && !data.length && !hasMore) throw new Error('No items found');

  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        renderItem={renderNewsItem}
        keyExtractor={item => item.uuid}
        sliderHeight={SCREEN_HEIGHT}
        itemHeight={SCREEN_HEIGHT}
        vertical={true}
        swipeThreshold={10}
        scrollEnabled
        onEndReached={fetchMore}
        onEndReachedThreshold={0.4}
        onSnapToItem={handleItemViewed}
        activeSlideOffset={0}
        ListFooterComponent={
          <View>
            <ActivityIndicator size={'large'} />
          </View>
        }
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
