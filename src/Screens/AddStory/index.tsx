import {
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Text,
  Alert,
  Image,
} from 'react-native';
import {
  useTheme,
  Button,
  makeStyles,
  Divider,
  LinearProgress,
} from '@rneui/themed';
import { useState } from 'react';
import { ms, s } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from '../../components/Input';
import {
  getWordCount,
  toTitleCase,
  validateWordCount,
} from '../../helpers/words';
import ImageUploader from '../../components/ImageUploader';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';
import { ImagePickerResponse } from 'react-native-image-picker';
import useMutation from '../../hooks/useMutation';
import CategorySelector, { Category } from '../../components/CategorySelector';

type Form = {
  title?: string;
  subtitle?: string;
  description?: string;
  footerText?: string;
  imageUrl?: string;
  imageAttr?: string;
  imageAttrUrl?: string;
};

const stepWiseValidations = {
  step1: ['title', 'subtitle', 'categoryId'],
  step2: ['description'],
  step3: ['footerText', 'imageAttr', 'imageUrl'],
};

const { height } = Dimensions.get('screen');

const AddStoryScreen = () => {
  const { navigate } = useNavigation() as any;
  const styles = useStyles();
  const { theme } = useTheme();

  const [form, setForm] = useState<Form>({});

  const [activeStep, setActiveStep] = useState(1);
  const [imageUploader, setImageUploader] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { mutate, isLoading } = useMutation({
    method: 'put',
    url: '/post/create',
    defaultHeaders: {
      'Content-Type': 'multipart/form-data',
    },
    onSuccess(data: { uuid: string }) {
      if (data.uuid) {
        navigate('ProfileScreen');
      }
    },
  });

  const handleSave = async () => {
    try {
      const data = { ...form, categoryId: selectedCategory!.uuid };
      // Implement your logic to save the data here
      console.log('Saving post...', {
        ...form,
        categoryId: selectedCategory!.uuid,
        imageUrl,
      });
      const formData = new FormData();
      Object.keys(data).forEach(item =>
        formData.append(item, (data as any)[item] as string),
      );
      formData.append('file', {
        uri: imageUrl,
        name: 'thumbnail.jpg',
        type: 'image/jpeg', // Adjust the type according to your file type
      });
      await mutate(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeValidations = (type: string, value: string) => {
    const updatedValue = value;
    if (type === 'title') {
      return toTitleCase(value.substring(0, 60));
    }
    if (type === 'subtitle') {
      return value.substring(0, 60);
    }
    if (type === 'description') {
      return validateWordCount(value, 500) ? value : value.substring(0, 500);
    }
    if (type === 'footerText') {
      return value.substring(0, 60);
    }
    if (type === 'imageAttr') {
      return value.substring(0, 30);
    }
    return updatedValue;
  };

  const onSaveValidator = (type: string) => {
    const value = {
      ...form,
      categoryId: selectedCategory?.uuid,
      imageUrl,
    }[type];

    if (type === 'categoryId') return !!selectedCategory?.uuid;
    if (type === 'imageUrl') return !!imageUrl;

    if (value === undefined || value === null || value.trim() === '') {
      return false;
    }

    if (
      type === 'title' ||
      type === 'subtitle' ||
      type === 'footerText' ||
      type === 'imageAttr'
    ) {
      const maxLength = type === 'imageAttr' ? 30 : 60;
      return value.length >= 3 && value.length <= maxLength;
    }

    if (type === 'description') {
      return getWordCount(value) > 100 && validateWordCount(value, 500);
    }

    return true;
  };

  const validateStepData = (stepTypes: string[]) => {
    for (const type of stepTypes) {
      const value = {
        ...(form[type as keyof Form] as any),
        categoryId: selectedCategory?.uuid,
        imageUrl,
      };

      if (value === undefined || value === null || !onSaveValidator(type)) {
        return false;
      }
      console.log(type);
    }
    return true;
  };

  const handleStepChange = (back?: boolean) => {
    if (back && activeStep <= 1) return;

    if (
      !back &&
      !validateStepData(
        stepWiseValidations[
          `step${activeStep}` as keyof typeof stepWiseValidations
        ],
      )
    )
      return;

    if (activeStep > 2) return handleSave();

    setActiveStep(step => (back ? step - 1 : step + 1));
  };

  const onChange = (type: string) => (value: string | ImagePickerResponse) => {
    if (type === 'imageUrl') {
      const imageUri = (value as ImagePickerResponse).assets?.[0]?.uri;
      setImageUploader(false);
      return setImageUrl(imageUri ?? '');
    }
    setForm(prev => ({
      ...prev,
      [type]: onChangeValidations(type, value as string),
    }));
  };

  let progress = 0.33333;
  if (activeStep > 1) progress = 0.63333;
  if (activeStep > 2) progress = 1;

  return (
    <View>
      <Header
        onClose={() => navigate('ProfileScreen')}
        handleStepChange={() => handleStepChange(false)}
        activeStep={activeStep}
      />

      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            marginBottom: s(10),
            ...theme.fontWeights.semiBold,
            color: theme.text.dark.black,
          }}>
          Step {activeStep}/3
        </Text>
        <LinearProgress
          style={{ marginBottom: s(20) }}
          value={progress}
          variant="determinate"
          color={theme.colors.blue[300]}
          trackColor={theme.colors.blue[50]}
        />

        {activeStep === 1 && (
          <>
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <Input
              multiline
              value={form.title ?? ''}
              onChangeText={onChange('title')}
              inputStyle={[styles.input, styles.title]}
              label="Title"
              placeholder="Enter a title for your story"
            />

            <Input
              multiline
              value={form.subtitle ?? ''}
              onChangeText={onChange('subtitle')}
              inputStyle={[styles.input, styles.subtitle]}
              label="Subtitle"
              placeholder="Enter a subtitle for your story"
            />
          </>
        )}

        {activeStep === 2 && (
          <Input
            multiline
            value={form.description ?? ''}
            onChangeText={onChange('description')}
            inputStyle={[styles.input, styles.description]}
            containerStyle={{ minHeight: s(200) }}
            label="Description"
            placeholder="Enter a description for your story"
          />
        )}

        {activeStep === 3 && (
          <>
            <Pressable onPress={() => setImageUploader(true)}>
              <View style={styles.imageUploadContainer}>
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.headerImage}
                  />
                ) : (
                  <Ionicons
                    name="camera-outline"
                    size={s(24)}
                    color={theme.colors.blue[500]}
                  />
                )}
                <ImageUploader
                  isOpen={imageUploader}
                  onClose={() => setImageUploader(false)}
                  onCaptured={onChange('imageUrl')}
                />
              </View>
            </Pressable>

            <Input
              label="Image Attribution Text"
              value={form.imageAttr ?? ''}
              onChangeText={onChange('imageAttr')}
              placeholder="Image Text"
              inputStyle={[styles.input]}
            />

            <Input
              label="Image attribute link (optional)"
              value={form.imageAttrUrl ?? ''}
              onChangeText={onChange('imageAttrUrl')}
              placeholder="Image Link (Optional)"
              inputStyle={[styles.input]}
            />

            <Input
              multiline
              label="Footer Text"
              value={form.footerText ?? ''}
              onChangeText={onChange('footerText')}
              placeholder="Footer Text"
              inputStyle={[styles.input]}
            />
          </>
        )}
        {activeStep > 1 && (
          <Pressable onPress={() => handleStepChange(true)}>
            <View style={styles.footerBtn}>
              <Ionicons
                name="arrow-back"
                size={s(18)}
                color={theme.text.dark.dimGray}
              />
              <Text style={styles.footerBtnTitle}>Previous Step</Text>
            </View>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
};

export default AddStoryScreen;

const useStyles = makeStyles(theme => ({
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBtnTitle: {
    color: theme.text.dark.dimGray,
    marginLeft: s(3),
    fontSize: s(theme.fontSizes.base - 3),
    ...theme.fontWeights.bold,
  },
  scrollViewContainer: {
    padding: ms(10),
    backgroundColor: theme.colors.white,
    paddingTop: ms(20),
    paddingBottom: s(200),
    flexGrow: 1,
    minHeight: height - s(40),
  },
  label: {
    fontSize: theme.fontSizes.xs,
    ...theme.fontWeights.semiBold,
  },
  inputC: {
    borderBottomWidth: 0,
    paddingLeft: 0,
  },
  input: {
    borderBottomWidth: 0,
    paddingLeft: 0,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.normal,
  },
  title: {
    paddingBottom: 0,
    ...theme.fontWeights.bold,
  },
  subtitle: {},
  description: {},
  imageUploadContainer: {
    borderRadius: theme.borderRadius.md,
    marginTop: s(10),
    marginBottom: s(20),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: s(200),
    borderWidth: theme.border.size.hairline,
    borderColor: theme.colors.blue[500],
    backgroundColor: theme.colors.blue[50],
  },
  headerImage: {
    width: '100%',
    height: s(200),
    backgroundColor: theme.colors.blue[50],
    borderRadius: theme.borderRadius.md,
  },
}));
