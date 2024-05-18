import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Skeleton, Text, makeStyles } from '@rneui/themed';
import Input from './Input';
import useRequest from '../hooks/useRequest';
import { s } from 'react-native-size-matters';
import FullScreenLoader from './FullScreenLoader';

export interface Category {
  uuid: string;
  name: string;
}

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  selectedCategory: Category | null;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelect,
  selectedCategory,
}) => {
  const styles = useStyles();
  const [modalVisible, setModalVisible] = useState(false);

  const { data, isLoading } = useRequest<Category[]>({
    method: 'get',
    url: '/post/categories',
  });

  const handleSelectCategory = (category: Category) => {
    onSelect(category);
    setModalVisible(false);
  };

  if (isLoading)
    return (
      <View style={{ marginBottom: 10, height: s(30) }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Input
          label="Select Category"
          value={selectedCategory ? selectedCategory.name : 'None'}
          onChangeText={() => {}} // No-op since selection is handled by modal
          placeholder="Select a category"
          editable={false} // Disable direct text input
          inputStyle={[styles.input]}
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={data ?? []}
            keyExtractor={item => item.uuid}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectCategory(item)}>
                <View style={styles.itemContainer}>
                  <Text
                    style={[
                      styles.itemLabel,
                      item.name === selectedCategory?.name
                        ? styles.disableLabel
                        : undefined,
                    ]}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  input: {
    borderBottomWidth: 0,
    paddingLeft: 0,
    fontSize: s(theme.fontSizes.base - 2),
    color: theme.text.dark.black,
    ...theme.fontWeights.normal,
  },
  modalContainer: {
    flex: 1,
    // padding: 20,
    backgroundColor: 'white',
    paddingBottom: s(20),
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: theme.border.size.hairline,
    borderBottomColor: '#ccc',
  },
  itemLabel: {
    fontSize: s(theme.fontSizes.base - 2),
    color: theme.text.dark.black,
    ...theme.fontWeights.normal,
  },
  disableLabel: {
    color: theme.colors.blue[800],
    ...theme.fontWeights.bold,
  },
  closeButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: s(10),
    width: '100%',
  },
  closeButton: {
    backgroundColor: theme.colors.blue[700],
    padding: s(8),
    textAlign: 'center',
    fontSize: theme.fontSizes.sm,
    color: theme.text.light.white,
    width: s(100),
    borderRadius: theme.borderRadius.md,
  },
}));

export default CategorySelector;
