import { View, ScrollView, Dimensions, Pressable, Text } from 'react-native';
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
import { toTitleCase, validateWordCount } from '../../helpers/words';
import ImageUploader from '../../components/ImageUploader';
import Header from './Header';
import { useNavigation } from '@react-navigation/native';

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

  const [form, setForm] = useState<Form>({});

  const [activeStep, setActiveStep] = useState(1);
  const [imageUploader, setImageUploader] = useState(false);

  const handleSave = () => {
    // Implement your logic to save the data here
    console.log('Saving post...');
  };

  const handleStepChange = (back?: boolean) => {
    if (back && activeStep <= 1) return;
    setActiveStep(step => (back ? step - 1 : step + 1));
  };

  const validations = (type: string, value: string) => {
    const updatedValue = value;
    if (type === 'title') {
      return toTitleCase(value.substring(0, 60));
    }
    if (type === 'subtitle') {
      return value.substring(0, 60);
    }
    if (type === 'description') {
      return validateWordCount(value, 500);
    }
    if (type === 'footerText') {
      return value.substring(0, 60);
    }
    if (type === 'imageAttr') {
      return value.substring(0, 30);
    }
    return updatedValue;
  };

  const onChange = (type: string) => (value: string) => {
    setForm(prev => ({ ...prev, [type]: validations(type, value) }));
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
                <Ionicons
                  name="camera-outline"
                  size={s(24)}
                  color={theme.colors.blue[500]}
                />
                <ImageUploader
                  isOpen={imageUploader}
                  onClose={() => setImageUploader(false)}
                  onCaptured={() => {}}
                />
              </View>
            </Pressable>

            <Input
              label="Image Text"
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
    height: s(100),
    borderWidth: theme.border.size.hairline,
    borderColor: theme.colors.blue[500],
    backgroundColor: theme.colors.blue[50],
  },
}));
