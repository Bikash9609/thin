import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Text, makeStyles } from '@rneui/themed';
import Input from '../Input';
import useRequest from '../../hooks/useRequest';
import { s } from 'react-native-size-matters';
import Header from './Header';

export interface Category {
  uuid: string;
  name: string;
}

interface CategorySelectorProps {
  onSelect: (uuid: string) => void;
  selectedCategory: string | null;
  showError?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelect,
  selectedCategory,
  showError,
}) => {
  const styles = useStyles();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: response, isLoading } = useRequest<Category[]>({
    method: 'get',
    url: '/post/categories',
    cacheTime: 86400000,
  });

  const handleSelectCategory = (category: Category) => {
    onSelect(category.uuid);
    setModalVisible(false);
  };

  const data = useMemo(() => {
    if (!selectedCategory || !response?.length) return response;

    const selectedIndex = response.findIndex(
      item => item.uuid === selectedCategory,
    );
    if (selectedIndex === -1) return response;

    const reorderedData = [
      response[selectedIndex],
      ...response.slice(0, selectedIndex),
      ...response.slice(selectedIndex + 1),
    ];

    return reorderedData;
  }, [response, selectedCategory]);

  const selectedItem = useMemo(() => {
    if (!response || !selectedCategory) return null;
    return response.find(item => item.uuid === selectedCategory);
  }, [response, selectedCategory]);

  if (isLoading)
    return (
      <View style={{ marginBottom: 10, height: s(30) }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <>
      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Input
            label="Select Category"
            value={selectedItem ? selectedItem.name : 'None'}
            onChangeText={() => {}} // No-op since selection is handled by modal
            placeholder="Select a category"
            editable={false} // Disable direct text input
            inputStyle={[styles.input]}
            showError={showError}
            errorMessage="Please select a category"
          />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <FlatList
              stickyHeaderIndices={[0]}
              ListHeaderComponent={() => (
                <Header onClose={() => setModalVisible(false)} />
              )}
              data={data ?? []}
              keyExtractor={item => item.uuid}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectCategory(item)}>
                  <View
                    style={[
                      styles.itemContainer,
                      item.uuid === selectedItem?.uuid
                        ? styles.selectedItemContainer
                        : undefined,
                    ]}>
                    <Text
                      style={[
                        styles.itemLabel,
                        item.uuid === selectedItem?.uuid
                          ? styles.disableLabel
                          : undefined,
                      ]}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  input: {
    borderBottomWidth: 0,
    paddingLeft: 0,
    fontSize: s(theme.fontSizes.base - 2),
    color: theme.text.dark.black,
    ...theme.fontWeights.medium,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: theme.border.size.hairline,
    borderBottomColor: '#ccc',
  },
  selectedItemContainer: {
    backgroundColor: theme.colors.blue[50],
  },
  itemLabel: {
    fontSize: s(theme.fontSizes.base - 2),
    color: theme.text.dark.black,
    ...theme.fontWeights.medium,
  },
  disableLabel: {
    color: theme.colors.blue[800],
    ...theme.fontWeights.extraBold,
  },
}));

export default CategorySelector;
