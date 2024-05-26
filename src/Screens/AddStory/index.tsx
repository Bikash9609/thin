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
import { useCallback, useEffect, useState } from 'react';
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
import CategorySelector from '../../components/CategorySelector';
import useScrollView from '../../hooks/useScrollView';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Snackbar from 'react-native-snackbar';
import LinearProgressGeneric from '../../components/LinearProgress';

const validationSchema = [
  Yup.object().shape({
    categoryId: Yup.string().uuid().required('Category is required'),
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(60, 'Title must be at most 60 characters')
      .required('Title is required'),
    subtitle: Yup.string()
      .min(3, 'Subtitle must be at least 3 characters')
      .max(60, 'Subtitle must be at most 60 characters')
      .required('Subtitle is required'),
  }),
  Yup.object().shape({
    description: Yup.string()
      .test(
        'min-word-count',
        'Description should be at least 100 words',
        function (value) {
          return getWordCount(value ?? '') >= 100;
        },
      )
      .test(
        'max-word-count',
        'Description exceeds maximum word count',
        function (value) {
          return validateWordCount(value ?? '', 300);
        },
      )
      .required('Description is required'),
  }),
  Yup.object().shape({
    footerText: Yup.string().max(
      60,
      'Footer text must be at most 60 characters',
    ),
    imageAttr: Yup.string()
      .max(30, 'Image attribute must be at most 30 characters')
      .min(1, 'Image attribute is required'),
    imageAttrUrl: Yup.string().url('Invalid URL').optional(),
    imageUrl: Yup.string()
      .required('Image is required')
      .min(3, 'Image URL must be at least 3 characters'),
  }),
];

type Form = {
  title?: string;
  subtitle?: string;
  description?: string;
  footerText?: string;
  imageUrl?: string;
  imageAttr?: string;
  imageAttrUrl?: string;
};

const { height } = Dimensions.get('screen');

const AddStoryScreen = () => {
  const { navigate } = useNavigation() as any;
  const styles = useStyles();
  const { theme } = useTheme();
  const { getScrollViewRef, scrollToTop } = useScrollView();

  const [activeStep, setActiveStep] = useState(1);
  const [imageUploader, setImageUploader] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [data, setData] = useState<Record<string, any>>({
    title: '',
    subtitle: '',
    description: '',
    footerText: '',
    imageAttr: '',
    imageAttrUrl: '',
    imageUrl: '',
    categoryId: '',
  });

  const {
    values,
    handleChange,
    setValues,
    handleBlur,
    errors,
    isValid,
    validateForm,
    resetForm,
  } = useFormik({
    onSubmit: values => {
      handleStepChange();
    },
    validateOnChange: true,
    initialValues: data,
    validationSchema: validationSchema[activeStep - 1],
    validateOnBlur: true,
  });

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
      const data = { ...values, title: toTitleCase(values.title) };
      const formData = new FormData();
      Object.keys(data).forEach(item => {
        if (item === 'imageUrl') return;

        formData.append(item, (data as any)[item] as string);
      });
      formData.append('file', {
        uri: values.imageUrl,
        name: 'thumbnail.jpg',
        type: 'image/jpeg', // Adjust the type according to your file type
      });
      await mutate(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStepChange = async (back?: boolean) => {
    if (back) {
      if (activeStep > 1) {
        setActiveStep(step => step - 1);
      }
      return;
    }

    if (!isValid) {
      Snackbar.show({
        text: 'Please fix the form errors to continue. Highlighted in red color.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    if (activeStep > 2) {
      return handleSave();
    }

    setData(prev => ({ ...prev, ...values }));
    scrollToTop();
    setActiveStep(step => step + 1);
    setTimeout(() => {
      validateForm();
    }, 10);
  };

  const onChange = (type: string) => (value: string | ImagePickerResponse) => {
    if (type === 'imageUrl') {
      const imageUri = (value as ImagePickerResponse).assets?.[0]?.uri;
      setImageUploader(false);
      setValues(prev => ({ ...prev, imageUrl: imageUri }) as any);
      return setImageUrl(imageUri ?? '');
    }
  };

  const getErrorProps = useCallback(
    (field: keyof typeof values) => {
      return {
        showError: !!errors[field],
        errorMessage: errors[field] as string,
      };
    },
    [errors],
  );

  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    setValues(prev => ({ ...data, ...prev }));
  }, [activeStep]);

  let progress = 0.33333;
  if (activeStep > 1) progress = 0.63333;
  if (activeStep > 2) progress = 1;

  return (
    <View>
      <Header
        onClose={() => navigate('ProfileScreen')}
        handleStepChange={() => handleStepChange(false)}
        activeStep={activeStep}
        disabled={isLoading}
      />
      {isLoading && <LinearProgressGeneric />}

      <ScrollView
        ref={getScrollViewRef()}
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
              selectedCategory={values.categoryId ?? null}
              onSelect={handleChange('categoryId')}
              showError={!!errors.categoryId}
            />
            <Input
              multiline
              value={values.title ?? ''}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              inputStyle={[styles.input, styles.title]}
              label="Title"
              placeholder="Enter a title for your story"
              maxLength={60}
              {...getErrorProps('title')}
            />

            <Input
              multiline
              value={values.subtitle ?? ''}
              onChangeText={handleChange('subtitle')}
              onBlur={handleBlur('subtitle')}
              inputStyle={[styles.input, styles.subtitle]}
              label="Subtitle"
              placeholder="Enter a subtitle for your story"
              {...getErrorProps('subtitle')}
            />
          </>
        )}

        {activeStep === 2 && (
          <Input
            multiline
            value={values.description ?? ''}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            inputStyle={[styles.input, styles.description]}
            containerStyle={{ minHeight: s(200) }}
            label="Description"
            placeholder="Enter a description for your story"
            {...getErrorProps('description')}
          />
        )}

        {activeStep === 3 && (
          <>
            <Pressable onPress={() => setImageUploader(true)}>
              <View
                style={[
                  styles.imageUploadContainer,
                  getErrorProps('imageUrl').showError
                    ? styles.imageUploadContainerError
                    : [],
                ].flat()}>
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.headerImage}
                  />
                ) : (
                  <>
                    <Text
                      style={[
                        styles.thumbnailUploadHeader,
                        getErrorProps('imageUrl').showError
                          ? styles.thumbnailUploadHeaderError
                          : [],
                      ].flat()}>
                      Upload Thumbnail
                    </Text>
                    <Ionicons
                      name="camera-outline"
                      size={s(24)}
                      color={
                        getErrorProps('imageUrl').showError
                          ? theme.colors.red[500]
                          : theme.colors.blue[500]
                      }
                    />
                  </>
                )}
                <ImageUploader
                  isOpen={imageUploader}
                  onClose={() => setImageUploader(false)}
                  onCaptured={onChange('imageUrl')}
                />
              </View>
            </Pressable>

            <Input
              label="Image by"
              value={values.imageAttr ?? ''}
              onChangeText={handleChange('imageAttr')}
              onBlur={handleBlur('imageAttr')}
              placeholder="Image by ..."
              inputStyle={[styles.input]}
              {...getErrorProps('imageAttr')}
            />

            <Input
              label="Image attribute link (optional)"
              value={values.imageAttrUrl ?? ''}
              onChangeText={handleChange('imageAttrUrl')}
              onBlur={handleBlur('imageAttrUrl')}
              placeholder="Image Link (Optional)"
              inputStyle={[styles.input]}
              {...getErrorProps('imageAttrUrl')}
            />

            <Input
              multiline
              label="Footer Text"
              value={values.footerText ?? ''}
              onChangeText={handleChange('footerText')}
              onBlur={handleBlur('footerText')}
              placeholder="Footer Text"
              inputStyle={[styles.input]}
              {...getErrorProps('footerText')}
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
    ...theme.fontWeights.normal,
  },
  title: {
    paddingBottom: 0,
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
  thumbnailUploadHeader: {
    marginBottom: s(5),
    color: theme.text.dark.black,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.semiBold,
  },
  thumbnailUploadHeaderError: {
    color: theme.colors.red[500],
  },
  imageUploadContainerError: {
    borderColor: theme.colors.red[500],
    backgroundColor: theme.colors.red[50],
  },
  headerImage: {
    width: '100%',
    height: s(200),
    backgroundColor: theme.colors.blue[50],
    borderRadius: theme.borderRadius.md,
  },
}));
