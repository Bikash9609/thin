import { makeStyles } from '@rneui/themed';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  Button,
  Pressable,
} from 'react-native';
import { s } from 'react-native-size-matters';
import Header from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useRequest from '../../hooks/useRequest';

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

  const ownPostsQuery = useRequest<Item[]>({
    method: 'get',
    url: '/posts/own',
  });

  const renderItem = ({ item }: { item: Item }) => (
    <Pressable onPress={() => navigate(`NewsItemScreen`, { uuid: item.uuid })}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.itemContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.infoText}
          </Text>

          <Ionicons
            onPress={() => handleDeleteItem(item)}
            name="trash-outline"
            size={20}
            color="black"
            style={styles.deleteButtonIcon}
          />
        </View>
      </View>
    </Pressable>
  );

  const handleDeleteItem = (item: Item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      const updatedItems = ownPostsQuery.data!.filter(
        i => i.uuid !== selectedItem.uuid,
      );
      ownPostsQuery.setData(updatedItems);
      setIsModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      {ownPostsQuery.data && ownPostsQuery.data.length > 0 ? (
        <FlatList
          data={ownPostsQuery.data}
          renderItem={renderItem}
          keyExtractor={item => item.uuid.toString()}
          ListHeaderComponent={() => (
            <Header onAddNewContent={() => navigate('AddStory')} />
          )}
        />
      ) : (
        <>
          <Header onAddNewContent={() => navigate('AddStory')} />
          <View style={styles.noItemsContainer}>
            <Text style={styles.noItemsText}>
              No posts found. Add some posts by creating new stories!
            </Text>
          </View>
        </>
      )}

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this item?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={handleCancelDelete} />
              <Button
                title="Delete"
                onPress={handleConfirmDelete}
                color="red"
              />
            </View>
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
    backgroundColor: theme.colors.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsText: {
    color: theme.text.dark.dimGray,
    textAlign: 'center',
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.semiBold,
  },
}));

export default ProfileScreen;
