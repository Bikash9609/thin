import React from 'react';

import { BottomSheet, Icon, ListItem, makeStyles } from '@rneui/themed';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

const useStyles = makeStyles(theme => ({
  root: {},
  listItem: {
    backgroundColor: theme.colors.coolGray[50],
  },
}));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCaptured: (res: ImagePickerResponse) => void;
};

const ImageUploader = ({ isOpen, onClose, onCaptured }: Props) => {
  const styles = useStyles();

  const handleOptionPress = async (type: 'gallery' | 'camera') => {
    try {
      let result = null;
      if (type === 'gallery') {
        result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.3,
          selectionLimit: 1,
          includeBase64: true,
        });
      } else {
        result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'front',
          quality: 0.3,
          includeBase64: true,
        });
      }
      onCaptured(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BottomSheet
      containerStyle={styles.root}
      modalProps={{}}
      onBackdropPress={onClose}
      isVisible={isOpen}>
      <ListItem
        containerStyle={styles.listItem}
        onPress={() => handleOptionPress('camera')}>
        <Icon name="camera-outline" type="ionicon" />
        <ListItem.Content>
          <ListItem.Title>Open Camera</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem
        containerStyle={styles.listItem}
        onPress={() => handleOptionPress('gallery')}>
        <Icon name="image-outline" type="ionicon" />
        <ListItem.Content>
          <ListItem.Title>Select from gallery</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </BottomSheet>
  );
};

export default ImageUploader;
