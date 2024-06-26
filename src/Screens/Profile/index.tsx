import { makeStyles } from '@rneui/themed';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  Pressable,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { s, scale } from 'react-native-size-matters';
import Header from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Button from '../../components/UI';
import useMutation from '../../hooks/useMutation';
import LinearProgressGeneric from '../../components/LinearProgress';
import { renderMetaText } from '../../utils';
import useInfiniteQuery from '../../hooks/useInfiniteQuery';
import Stack from '../../components/Stack';

type Item = {
  uuid: string;
  title: string;
  infoText: string;
  datePublished: Date;
  createdAt: Date;
  imageUrl: string;
};

const ProfileScreen: React.FC = () => {
  const styles = useStyles();
  const { navigate } = useNavigation() as any;
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const ownPostsQuery = useMutation<Item[]>({
    method: 'get',
    url: '/posts/own',
  });

  const [data, { fetchMore, hasMore, loading, refreshData, setData }] =
    useInfiniteQuery(
      page =>
        ownPostsQuery.mutate(undefined, { params: { page } }) as Promise<
          Item[]
        >,
      true,
    );

  const { mutate, isLoading } = useMutation({
    method: 'delete',
    url: `/post/${selectedItem?.uuid}`,
    onSuccess() {
      const updatedItems = data.filter(i => i.uuid !== selectedItem?.uuid);
      setData(updatedItems);
      setSelectedItem(null);
      setIsModalVisible(false);
    },
  });

  const renderItem = ({ item }: { item: Item }) =>
    item.uuid ? (
      <Pressable
        onPress={() => navigate(`NewsItemScreen`, { uuid: item.uuid })}>
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.itemContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.infoText}
            </Text>

            <View style={styles.contentFooterBar}>
              <Text
                style={
                  styles.lastPublished
                }>{`Published ${renderMetaText(item.datePublished as unknown as string)}`}</Text>
              <Ionicons
                onPress={() => handleDeleteItem(item)}
                name="trash-outline"
                size={s(18)}
                color="black"
                style={styles.deleteButtonIcon}
              />
            </View>
          </View>
        </View>
      </Pressable>
    ) : (
      <View />
    );

  const handleDeleteItem = (item: Item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    try {
      if (selectedItem) {
        mutate(undefined, { url: `/post/${selectedItem.uuid}` });
      }
    } catch (error) {
      Alert.alert('Error', 'Error deleting item. Pleaes try again.');
    }
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const handleRefresh = () => {
    if (!loading) refreshData();
  };

  const handleLoaderMore = () => {
    if (!loading && hasMore) {
      fetchMore();
    }
  };

  console.log(data.length);

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.uuid?.toString?.()}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <Header
              onAddNewContent={() => navigate('AddStory')}
              isLoading={loading || isLoading}
            />
          )}
          ListFooterComponent={() =>
            hasMore ? (
              <Stack
                direction="row"
                alignI="center"
                justifyC="center"
                mt={scale(10)}>
                <Button
                  loading={loading}
                  title="Load more"
                  disabled={loading}
                  onPress={handleLoaderMore}
                  style={{ width: '100%', marginBottom: s(30) }}
                />
              </Stack>
            ) : (
              <Text style={styles.noMoreItems}>The End! 😃 </Text>
            )
          }
          refreshControl={
            <RefreshControl refreshing={!!loading} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <>
          <Header
            onAddNewContent={() => navigate('AddStory')}
            isLoading={loading}
          />
          {loading ? (
            <View style={styles.centeredContent}>
              <LottieView
                source={require('../../assets/lottie/2.json')} // Use require for local assets
                autoPlay={true}
                loop={true}
                style={styles.lottieView} // Avoid full screen stretching
              />
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={!!loading}
                  onRefresh={handleRefresh}
                />
              }
              contentContainerStyle={styles.noItemsContainer}>
              <LottieView
                source={require('../../assets/lottie/4.json')} // Use require for local assets
                autoPlay={true}
                loop={true}
                style={styles.lottieView} // Avoid full screen stretching
              />
              <Text style={styles.noItemsText}>
                No posts found. Add some stories and get upvotes!
              </Text>
            </ScrollView>
          )}
        </>
      )}

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this item?
            </Text>
            {isLoading ? (
              <LinearProgressGeneric />
            ) : (
              <View style={styles.modalButtons}>
                <Button
                  disabled={isLoading}
                  title="Delete"
                  onPress={handleConfirmDelete}
                  style={styles.modalButtonDelete}
                />
                <Button
                  disabled={isLoading}
                  title="Cancel"
                  onPress={handleCancelDelete}
                  style={styles.modalButtonCancel}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    padding: s(10),
    paddingBottom: 0,
    backgroundColor: theme.colors.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: s(10),
  },
  image: {
    width: s(100),
    height: s(100),
    borderRadius: s(10),
    marginRight: s(10),
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: s(theme.fontSizes.base - 3),
    color: theme.text.dark.black,
    marginBottom: s(5),
    ...theme.fontWeights.semiBold,
  },
  description: {
    fontSize: s(theme.fontSizes.sm - 3),
    color: theme.text.dark.deepGray,
    marginBottom: s(3),
    ...theme.fontWeights.normal,
  },
  contentFooterBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastPublished: {
    fontSize: s(theme.fontSizes.xs - 3),
    color: theme.text.dark.dimGray,
    ...theme.fontWeights.medium,
  },
  deleteButtonIcon: {
    color: theme.colors.dark[400],
    marginTop: s(5),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    fontSize: s(theme.fontSizes.base),
    color: theme.text.dark.black,
    ...theme.fontWeights.semiBold,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButtonDelete: {
    backgroundColor: theme.colors.red[700],
    width: s(100),
  },
  modalButtonCancel: {
    backgroundColor: theme.colors.blue[600],
    width: s(100),
    marginLeft: s(10),
  },

  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsText: {
    color: theme.text.dark.dimGray,
    textAlign: 'center',
    maxWidth: '80%',
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.semiBold,
  },

  centeredContent: {
    alignItems: 'center',
  },
  lottieView: {
    // Adjust width and height as needed, avoid full-screen stretching
    width: s(350), // Example width, adjust based on your Lottie animation size
    height: s(300), // Example height, adjust based on your Lottie animation size
  },

  noMoreItems: {
    color: theme.text.dark.dimGray,
    textAlign: 'center',
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.semiBold,
    marginVertical: s(10),
    marginBottom: s(30),
    paddingTop: s(10),
    borderTopWidth: theme.border.size.hairline,
    borderTopColor: theme.border.color.lightGray,
  },
}));

export default ProfileScreen;
