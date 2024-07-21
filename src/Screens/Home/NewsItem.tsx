import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Pressable,
  ImageBackground,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';
import ViewShot from 'react-native-view-shot';
import { LinearProgress, makeStyles, useTheme } from '@rneui/themed';
import { Linking } from 'react-native';
import moment from 'moment';
import { scale, verticalScale, vs, s } from 'react-native-size-matters';

import useShare from '../../hooks/useShare';
import useCardActions, { ActionType } from '../../hooks/useCardAction';
import { getPlural } from '../../helpers/words';
import { numberToWords } from '../../helpers/numbers';
import { ScreenWidth } from '@rneui/base';
import { useAppBar } from '../../context/AppBarProvider';
import AnimatedIconButton from '../../components/AnimatedIconButton';
import Stack from '../../components/Stack';
import SheetOptions, { Option } from '../../components/SheetOptions';
import useReport from '../../hooks/useReport';
import { fs } from '../../utils/font';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
export interface NewsItemProps {
  uuid: string;
  title: string; // Title of the news item (max 60 characters)
  infoText: string; // Short description of the news item (max 100 words)
  imageUrl: string; // URL of the image for the news item
  attributeKeyword: string; // Keyword associated with the news item
  subtitle: string; // Subtitle of the news item (max 2 lines)
  link?: string; // Optional URL to redirect to when clicking on the news item
  author: string;
  website: string;
  datePublished: string;
  likes: number;
  dislikes: number;
  imageAttr: {
    url: string;
    title: string;
  };
  viewerReaction?: 'like' | 'dislike';
  refreshData: () => void;
  isInView?: boolean;
}

const renderMetaText = (datePublished: string) => {
  const now = moment();
  const publishedTime = moment(datePublished);
  const diffInHours = now.diff(publishedTime, 'hours');
  const diffInDays = now.diff(publishedTime, 'days');
  const diffInMonths = now.diff(publishedTime, 'months');

  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

const NewsItem: React.FC<NewsItemProps> = ({
  title,
  infoText,
  imageUrl,
  attributeKeyword,
  subtitle,
  link,
  author,
  website,
  datePublished,
  likes,
  dislikes,
  uuid,
  imageAttr,
  viewerReaction,
  refreshData,
  isInView,
}) => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const { bottom } = useSafeAreaInsets();
  const { reportPost } = useReport({ postuuid: uuid });
  const { toggleAppBarVisibility, isAppBarVisible } = useAppBar();
  const { theme } = useTheme();
  const styles = useStyles({ bottom });
  const { handleShare, viewRef, isLoading } = useShare({ storyUuid: uuid });
  const { handleAction, state, activeUserValue, loading } = useCardActions(
    {
      dislike: +dislikes,
      like: +likes,
      share: 0,
      postUuid: uuid,
    },
    viewerReaction,
  );

  const [moreMenu, setMoreMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    handleAction('like');
  };
  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    handleAction('dislike');
  };

  const handleOpenLink = (link: string | undefined) => () => {
    if (link) {
      Linking.openURL(link);
    }
  };

  const getActiveIconColor = (type: ActionType) => {
    return type === activeUserValue ? '#fff' : '#808080';
  };

  const handleMenuOptionClick = ({ id }: Option) => {
    if (id === 1) {
      setMoreMenu(false);
      reportPost();
    }
  };

  const getActiveIcon = (
    type: ActionType,
    inactive: string,
    active: string,
  ) => {
    return type === activeUserValue ? active : inactive;
  };

  useEffect(() => {
    scrollViewRef?.current?.scrollTo({ y: 0, animated: true });
  }, [isInView]);

  const footerIconSize = scale(23);

  return (
    <View key={uuid} style={styles.container}>
      <StatusBar showHideTransition="slide" />

      <ViewShot ref={viewRef} style={styles.item}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: s(80) }}>
          <View style={styles.imageContainer}>
            <Pressable onPress={() => setZoomImage(true)}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </Pressable>
            <ImageView
              images={[{ uri: imageUrl }]}
              imageIndex={0}
              visible={zoomImage}
              onRequestClose={() => setZoomImage(false)}
            />

            {imageAttr.title ? (
              <AnimatedIconButton
                isInView={!!isInView}
                iconName="information-circle-outline"
                label={`Image by ${imageAttr.title}`}
                onPress={handleOpenLink(imageAttr.url)}
                timeToHide={6}
                containerStyles={[styles.attribute]}
                iconStyles={[styles.attributeIcon]}
                labelStyles={[styles.attributeText, styles.authorAttr]}
              />
            ) : (
              <View />
            )}
            <Icon
              name="ellipsis-vertical-outline"
              size={s(14)}
              color="#fff"
              style={[styles.attribute, styles.moreMenuIcon]}
              onPress={() => setMoreMenu(true)}
            />
            <SheetOptions
              isOpen={moreMenu}
              onClose={() => setMoreMenu(false)}
              onOptionPress={handleMenuOptionClick}
              options={[{ id: 1, label: 'Report', icon: 'flag-outline' }]}
            />
          </View>

          <Pressable onPress={toggleAppBarVisibility}>
            <View style={styles.content}>
              <Text
                style={styles.title}
                numberOfLines={3}
                maxFontSizeMultiplier={1}
                onPress={handleOpenLink(link)}>
                {title}
              </Text>
              {attributeKeyword && (
                <Text
                  style={styles.summary}
                  numberOfLines={2}
                  maxFontSizeMultiplier={1.05}>
                  {attributeKeyword}
                </Text>
              )}

              <Text style={styles.contentInfoText} maxFontSizeMultiplier={1}>
                {infoText}
              </Text>

              <View style={styles.contentMetaInfo}>
                <TouchableOpacity
                  onPress={handleOpenLink(website)}
                  style={styles.contentMetaInfo}>
                  <Icon
                    name="person-outline"
                    size={s(14)}
                    color="#808080"
                    style={styles.contentIcon}
                  />
                  <Text
                    maxFontSizeMultiplier={1}
                    style={styles.contentMetaText}>
                    {author}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.contentMetaInfo}
                  onPress={handleOpenLink(link)}>
                  <Icon
                    name="calendar-outline"
                    size={s(14)}
                    color="#808080"
                    style={styles.contentIcon}
                  />
                  <Text
                    maxFontSizeMultiplier={1}
                    style={styles.contentMetaText}>
                    {renderMetaText(datePublished)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </ScrollView>

        {!isAppBarVisible && (
          <View style={styles.footerContainer}>
            {loading && (
              <View style={styles.linearProgressContainer}>
                <LinearProgress
                  variant="indeterminate"
                  color={theme.colors.blue[400]}
                  style={{
                    height: s(3),
                    width: ScreenWidth - s(20),
                    borderTopRightRadius: 300,
                    borderTopLeftRadius: 300,
                  }}
                />
              </View>
            )}
            <ImageBackground
              source={{ uri: imageUrl }}
              imageStyle={styles.footerBg}>
              <View style={[styles.footer]}>
                <Text
                  style={styles.footerText}
                  numberOfLines={2}
                  maxFontSizeMultiplier={1.1}
                  onPress={handleOpenLink(link)}>
                  {subtitle}
                </Text>

                <View style={styles.reactionIcons}>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={refreshData}>
                    <Icon
                      name="refresh-outline"
                      size={footerIconSize}
                      color="#808080"
                    />
                    <Text style={styles.iconText}>refresh feed</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={isLoading}
                    style={styles.iconContainer}
                    onPress={() => handleShare({})}>
                    <Icon
                      name="share-social-outline"
                      size={footerIconSize}
                      color="#808080"
                    />
                    <Text style={styles.iconText}>share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={loading}
                    style={styles.iconContainer}
                    onPress={handleDislike}>
                    <Icon
                      name={getActiveIcon(
                        'dislike',
                        'arrow-down',
                        'arrow-down-circle',
                      )}
                      size={footerIconSize}
                      color={getActiveIconColor('dislike')}
                    />
                    <Text style={styles.iconText}>
                      {numberToWords(state.dislike.toString())}{' '}
                      {getPlural(state.dislike, 'downvote', 'downvotes')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={loading}
                    style={styles.iconContainer}
                    onPress={handleLike}>
                    <Icon
                      name={getActiveIcon(
                        'like',
                        'arrow-up',
                        'arrow-up-circle',
                      )}
                      size={footerIconSize}
                      color={getActiveIconColor('like')}
                    />
                    <Text style={styles.iconText}>
                      {numberToWords(state.like.toString())}{' '}
                      {getPlural(state.like, 'upvote', 'upvotes')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        )}
      </ViewShot>
    </View>
  );
};

type UseStylesProps = {
  bottom: number;
};

const useStyles = makeStyles((theme, props: UseStylesProps) => ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
    shadowOffset: { width: 10, height: 20 },
    shadowColor: 'black',
    shadowOpacity: 1,
  },
  item: {
    flex: 1,
    backgroundColor: '#fffffc',
    borderRadius: scale(30),
    shadowColor: '#000',
    shadowRadius: scale(10),
  },
  image: {
    width: '100%',
    height: verticalScale(240),
    resizeMode: 'cover',
    borderBottomLeftRadius: scale(16),
    borderBottomRightRadius: scale(16),
  },

  content: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
  },
  title: {
    marginBottom: scale(2),
    fontSize: fs(theme.fontSizes.base),
    color: theme.text.dark.black,
    ...theme.fontWeights.bold,
  },

  // subtitle
  summary: {
    marginBottom: scale(5),
    fontSize: fs(theme.fontSizes.sm - 1),
    color: theme.text.dark.dimGray,
    textAlign: 'left',
    ...theme.fontWeights.normal,
  },

  contentMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: scale(6),
    paddingTop: scale(2),
  },
  contentIcon: {
    marginRight: scale(5),
  },
  contentMetaText: {
    fontSize: fs(theme.fontSizes.xs - 1),
    color: theme.text.dark.dimGray,
    marginRight: scale(10),
    ...theme.fontWeights.normal,
  },
  website: {
    textDecorationLine: 'underline',
  },
  contentInfoScrollView: {
    maxHeight: vs(225),
  },
  contentInfoText: {
    lineHeight: scale(21),
    marginBottom: scale(10),
    paddingBottom: scale(10),
    width: '100%',
    fontSize: fs(theme.fontSizes.sm),
    color: theme.text.dark.black,
    ...theme.fontWeights.normal,
  },
  imageContainer: {
    position: 'relative',
    borderBottomWidth: theme.border.size.hairline,
    borderBottomColor: theme.border.color.midGray,
    borderBottomLeftRadius: scale(16),
    borderBottomRightRadius: scale(16),
  },

  attributeIcon: {
    marginRight: scale(5),
  },
  attribute: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: scale(5),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    top: scale(10),
    left: scale(10),
  },
  attributeText: {
    fontSize: fs(theme.fontSizes.sm - 1),
    color: theme.text.light.lightGray,
    textAlign: 'center',
    ...theme.fontWeights.medium,
  },
  moreMenuIcon: {
    top: scale(10),
    left: undefined,
    right: scale(10),
  },

  authorAttr: {
    fontSize: scale(10),
  },

  linearProgressContainer: { display: 'flex', alignItems: 'center' },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: props.bottom ?? 0,
  },
  footerBg: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
    backgroundColor: 'rgba(0, 0, 0, 0.87)',
  },
  footerText: {
    width: '100%',
    // paddingTop: scale(3),
    fontSize: fs(theme.fontSizes.xs - 1),
    color: theme.text.light.lightGray,
    textAlign: 'center',
    ...theme.fontWeights.normal,
  },
  reactionIcons: {
    paddingTop: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Adjust width as needed
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconText: {
    fontSize: fs(theme.fontSizes.xs - 2),
    color: theme.text.light.lightGray,
    textAlign: 'center',
    ...theme.fontWeights.medium,
  },
}));

export default React.memo(NewsItem);
