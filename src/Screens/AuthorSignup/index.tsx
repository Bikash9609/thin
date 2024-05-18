import { useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { makeStyles, Text, useTheme } from '@rneui/themed';
import { s } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Input from '../../components/Input';
import config from '../../config/config';
import useMutation from '../../hooks/useMutation';
import SmartAvatar from '../../components/SmartAvatar';
import Stack from '../../components/Stack';
import ImageUploader from '../../components/ImageUploader';
import { ImagePickerResponse } from 'react-native-image-picker';
import FullScreenLoader from '../../components/FullScreenLoader';
import { useNavigation } from '@react-navigation/native';
import { UserStored, useAuth } from '../../context/AuthProvider';

const AuthorSignupScreen = () => {
  const { setData: setAuthData } = useAuth();
  const { navigate } = useNavigation() as any;
  const { mutate, isLoading } = useMutation({
    method: 'put',
    url: '/author/signup',
    defaultHeaders: {
      'Content-Type': 'multipart/form-data',
    },
    onSuccess(data: { authorDetails: { uuid: string } }) {
      if (data?.authorDetails?.uuid) {
        setAuthData(((prev: UserStored) => ({
          ...prev,
          user: { ...prev.user, authorId: data.authorDetails.uuid },
        })) as any as UserStored);
        navigate('AddStory');
      }
    },
  });
  const styles = useStyles();
  const [data, setData] = useState({ name: '', website: '' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);

  const validations = (type: string, value: string) => {
    const updatedValue = value;
    if (['name'].includes(type)) {
      return value.substring(0, 30);
    }
    return updatedValue;
  };

  const onChange = (type: string) => (value: string) => {
    setData(prev => ({ ...prev, [type]: validations(type, value) }));
  };

  const handleOpenLink = (link: string) => async () => {
    await Linking.openURL(link);
  };

  const handleCreateProfile = () => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('file', {
      uri: selectedImage,
      name: 'profile_pic.jpg',
      type: 'image/jpeg', // Adjust the type according to your file type
    });
    if (data.website) formData.append('website', data.website);
    mutate(formData).catch(error => console.log(error));
  };

  const handleImagePickerToggle = () => {
    setShowImagePicker(!showImagePicker);
  };

  const handleImageUpload = async (image: ImagePickerResponse) => {
    handleImagePickerToggle();
    if (!image.assets || image.assets.length <= 0) {
      return;
    }
    setSelectedImage(image.assets[0].uri ?? null);
  };

  const avatarSource = selectedImage
    ? selectedImage
    : config.authorAvatarPlaceholder;

  return (
    <ScrollView style={styles.container}>
      {isLoading && <FullScreenLoader fixedFullScreen />}
      <View style={styles.headerContainer}>
        <View style={styles.headerIconContainer}>
          <Ionicons
            name="rocket-outline"
            size={s(24)}
            color="black"
            style={styles.headerIcon}
          />
        </View>

        <Text style={styles.headerText}>
          Just one more step before you start writing!
        </Text>
      </View>

      <View style={styles.inputsContainer}>
        <Stack direction="row" alignI="center" justifyC="center" mb={20}>
          <SmartAvatar
            size={32}
            src={avatarSource}
            onPress={handleImagePickerToggle}
            icon="camera-outline"
          />
          <ImageUploader
            isOpen={showImagePicker}
            onClose={handleImagePickerToggle}
            onCaptured={handleImageUpload}
          />
        </Stack>

        <Input
          multiline
          value={data.name}
          onChangeText={onChange('name')}
          inputStyle={[styles.input]}
          label="Name"
          placeholder="Name for your author profile"
          autoFocus
        />

        <Input
          multiline
          value={data.website}
          onChangeText={onChange('website')}
          inputStyle={[styles.input]}
          label="Website"
          placeholder="(Optional) Website URL"
        />
      </View>

      <Pressable onPress={handleOpenLink(config.authorTermsAndConditionUrl)}>
        <Text style={styles.footerTermsAndConditions}>
          By continuing, you understand and agree to our author terms. Click to
          read.
        </Text>
      </Pressable>
      <Pressable disabled={isLoading} onPress={handleCreateProfile}>
        <View style={styles.footerBtn}>
          <Text style={styles.footerBtnTitle}>Continue</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default AuthorSignupScreen;

const useStyles = makeStyles(theme => ({
  container: {
    padding: s(theme.spacing.lg),
    backgroundColor: theme.colors.white,
  },

  headerContainer: {
    display: 'flex',
    flexDirection: 'column', // Ensures that the icon and text are aligned horizontally
    alignItems: 'center',
  },
  headerIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    backgroundColor: theme.colors.blue[600],
    color: theme.text.light.white,
    borderRadius: theme.borderRadius.xxl,
    padding: s(theme.spacing.sm),
    height: s(40),
    width: s(40),
  },
  headerText: {
    textAlign: 'center',
    color: theme.text.dark.black,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.medium,
    marginTop: s(5),
  },

  inputsContainer: {
    marginVertical: s(20),
  },

  input: {
    borderBottomWidth: 0,
    paddingLeft: 0,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.normal,
  },

  footerTermsAndConditions: {
    fontSize: s(theme.fontSizes.xs),
    ...theme.fontWeights.normal,
    color: theme.text.dark.dimGray,
    marginBottom: s(20),
    textAlign: 'center',
  },

  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.main[600],
    padding: s(theme.spacing.sm),
    borderRadius: s(theme.borderRadius.md),
    height: s(40),
  },
  footerBtnTitle: {
    color: theme.text.light.white,
    marginLeft: s(3),
    fontSize: s(theme.fontSizes.base - 3),
    ...theme.fontWeights.bold,
  },
}));
