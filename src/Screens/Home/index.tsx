import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import NewsItem from './NewsItem';
import AuthLoading from '../../components/AuthLoading';
import EndOfPosts from '../../components/EndOfPosts';
import LoadingOfPosts from '../../components/LoadingOfPosts';
import useCarouselGuide from './useCarouselGuide';
import useCarouselPrefetcher from './useCarousel';
import { HomeProvider, useHome } from '../../context/HomeProvider';

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

const Main = () => {
  const {
    currentIndex,
    addItemToViewed,
    data,
    fetchMore,
    hasMore,
    loading,
    refreshData,
    viewedItems,
    setCurrentIndex,
  } = useHome();

  const { carouselRef, onScroll } = useCarouselGuide({
    enabled: !!(!loading && data.length),
  });

  useCarouselPrefetcher({
    enabled: hasMore,
    viewedItems: viewedItems.length,
    isLoading: loading,
    totalItems: data.length ?? 0,
    onPrefetch: fetchMore,
  });

  const handleItemViewed = React.useCallback(
    (slideIndex: number) => {
      setCurrentIndex(slideIndex);
      onScroll();
      addItemToViewed(slideIndex);
    },
    [data, viewedItems],
  );

  useEffect(() => {
    if (data?.[0] && !viewedItems.includes(data?.[0]?.uuid)) {
      handleItemViewed(0);
    }
  }, [data]);

  const renderNewsItem = useCallback(
    ({ item }: { item: PostResponse }) => {
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
          isInView={item.uuid === data[currentIndex].uuid}
        />
      );
    },
    [currentIndex, data],
  );

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
        viewabilityConfig={{ itemVisiblePercentThreshold: 3 }}
      />
    </View>
  );
};

const HomeScreen = () => {
  return (
    <HomeProvider>
      <Main />
    </HomeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
