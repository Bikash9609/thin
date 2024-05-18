import React from 'react';
import { StyleSheet, View } from 'react-native';
import useRequest from '../../hooks/useRequest';
import FullScreenLoader from '../../components/FullScreenLoader';
import NewsItem from '../Home/NewsItem';
import { PostResponse } from '../Home';
import { PageProps } from '../../Navigator';

function NewsItemScreen({ route }: PageProps<'NewsItemScreen'>) {
  const {
    data: item,
    isLoading,
    retry,
  } = useRequest<PostResponse>({
    method: 'get',
    url: `/post/${route.params.uuid}`,
  });

  if (isLoading || !item) return <FullScreenLoader />;

  return (
    <View style={styles.container}>
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
        refreshData={retry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NewsItemScreen;
