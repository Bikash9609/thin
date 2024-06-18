import React from 'react';
import { StyleSheet, View } from 'react-native';
import useRequest from '../../hooks/useRequest';
import NewsItem from '../Home/NewsItem';
import { PostResponse } from '../Home';
import { PageProps } from '../../Navigator';
import LottieView from 'lottie-react-native';
import { s } from 'react-native-size-matters';
import LinearProgressGeneric from '../../components/LinearProgress';

function NewsItemScreen({
  route,
}: PageProps<'NewsItemScreen'> | PageProps<'PublicNewsItemScreen'>) {
  const {
    data: item,
    isLoading,
    retry,
  } = useRequest<PostResponse>({
    method: 'get',
    url: `/post/${route.params.uuid}`,
  });

  if (isLoading || !item)
    return (
      <>
        <LinearProgressGeneric />
        <View style={styles.centeredContent}>
          <LottieView
            source={require('../../assets/lottie/2.json')} // Use require for local assets
            autoPlay={true}
            loop={true}
            style={styles.lottieView} // Avoid full screen stretching
          />
        </View>
      </>
    );

  return (
    <View style={styles.container}>
      <NewsItem
        isInView
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
        refreshData={retry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centeredContent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100%',
  },
  lottieView: {
    // Adjust width and height as needed, avoid full-screen stretching
    width: s(350), // Example width, adjust based on your Lottie animation size
    height: s(300), // Example height, adjust based on your Lottie animation size
  },
});

export default NewsItemScreen;
