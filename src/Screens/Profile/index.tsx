import { makeStyles } from '@rneui/themed';
import React, { useState } from 'react';
import { View, Text, Image, FlatList, Modal, Button } from 'react-native';
import { s } from 'react-native-size-matters';
import Header from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface Item {
  id: number;
  title: string;
  description: string;
  image: string;
}

const data: Item[] = [
  {
    id: 1,
    title: 'Item 1',
    description: 'Description of item 1',
    image:
      'https://static.inshorts.com/inshorts/images/v1/variants/webp/xs/2024/02_feb/10_sat/img_1707557430398_80.webp',
  },
  {
    id: 2,
    title: 'Item 2',
    description: 'Description of item 2',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    title: 'Item 3',
    description: 'Description of item 3',
    image: 'https://via.placeholder.com/150',
  },
  // Add more items as needed
];

const ProfileScreen: React.FC = () => {
  const styles = useStyles();
  const { navigate } = useNavigation() as any;
  const [items, setItems] = useState<Item[]>(data);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
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
  );

  const handleDeleteItem = (item: Item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      const updatedItems = items.filter(i => i.id !== selectedItem.id);
      setItems(updatedItems);
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
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={() => (
          <Header onAddNewContent={() => navigate('AddStory')} />
        )}
      />
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
    fontSize: s(theme.fontSizes.base),
    marginBottom: s(5),
    ...theme.fontWeights.semiBold,
  },
  description: {
    fontSize: s(theme.fontSizes.sm),
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
}));

export default ProfileScreen;
