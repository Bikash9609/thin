import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import NewsItem from './NewsItem';
import AuthLoading from '../../components/AuthLoading';
import EndOfPosts from '../../components/EndOfPosts';
import LoadingOfPosts from '../../components/LoadingOfPosts';
import useCarouselGuide from './useCarouselGuide';
import useCarouselPrefetcher, { isAlmostViewed } from './useCarousel';
import { HomeProvider, useHome } from '../../context/HomeProvider';
import AdUnit from './AdUnit';
import NoNewsItems from './NoNewsItems';
import LoadingPill from '@/components/LoadingPill';
import StackCardsCarousel from '@/components/StackCardCarousel';

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
    totalViewed,
  } = useHome();

  const { carouselRef, onScroll } = useCarouselGuide({
    enabled: !loading && !!data.length,
  });

  const handleItemViewed = React.useCallback(
    (slideIndex: number) => {
      setCurrentIndex(slideIndex);
      onScroll();
      addItemToViewed(slideIndex);
    },
    [data, viewedItems],
  );

  const onProgressChange = useCallback(
    (offsetProgress: number, absoluteProgress: number) => {
      const totalItems = data.length;
      const currentPercentage = (absoluteProgress / totalItems) * 100;

      if (currentPercentage >= 70 && !loading && hasMore) {
        fetchMore();
      }
    },
    [data, fetchMore],
  );

  useEffect(() => {
    if (data?.[0] && !viewedItems.includes(data?.[0]?.uuid)) {
      handleItemViewed(0);
    }
  }, [data]);

  const renderNewsItem = useCallback(
    ({ item, index }: { item: PostResponse; index: number }) => {
      const keyExtractor = () => {
        if (!(item as any).uuid)
          return `${Object.keys(item)[0]}-default-${index}`;
        return item.uuid;
      };

      const key = keyExtractor();
      if (!item.uuid) {
        if ((item as any).adsScreen) {
          return <AdUnit key={key} />;
        }
        if ((item as any).noItemScreen) {
          return <EndOfPosts refreshData={refreshData} key={key} />;
        }
        if ((item as any).loadingScreen) {
          return <LoadingOfPosts key={key} />;
        }
      }

      return (
        <NewsItem
          key={key}
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

  if (!data.length) return <NoNewsItems refreshData={refreshData} />;

  return (
    <View style={styles.container}>
      <LoadingPill isLoading={loading} message="Fetching more..." />
      <StackCardsCarousel
        data={data}
        renderItem={renderNewsItem}
        onSnapToItem={handleItemViewed}
        onProgressChange={onProgressChange}
        ref={carouselRef as any}
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
