import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Pressable,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';
import ViewShot from 'react-native-view-shot';
import { makeStyles } from '@rneui/themed';
import { Linking } from 'react-native';
import moment from 'moment';
import { scale, verticalScale } from 'react-native-size-matters';

import useShare from '../../hooks/useShare';
import useCardActions, { ActionType } from '../../hooks/useCardAction';
import { getPlural } from '../../helpers/wrods';
import useIsComponentInView from '../../hooks/useIsComponentInView';
import FullScreenComponent from './FullScreenView';

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
}) => {
  const styles = useStyles();
  const [isInView, componentRef] = useIsComponentInView();
  const { handleShare, viewRef } = useShare();
  const { handleAction, state, activeUserValue } = useCardActions(
    {
      dislike: +dislikes,
      like: +likes,
      share: 0,
      postUuid: uuid,
    },
    viewerReaction,
    isInView,
  );

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const [fullScreenView, setFullScreenView] = useState(false);

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

  const toggleFullScreenView = () => {
    setFullScreenView(prev => !prev);
  };

  const getActiveIconColor = (type: ActionType) => {
    return type === activeUserValue ? '#fff' : '#808080';
  };
  const getActiveIcon = (
    type: ActionType,
    inactive: string,
    active: string,
  ) => {
    return type === activeUserValue ? active : inactive;
  };

  const footerIconSize = scale(23);

  return (
    <View ref={componentRef} key={uuid} style={styles.container}>
      <StatusBar showHideTransition="slide" />
      <FullScreenComponent
        content={infoText}
        onClose={toggleFullScreenView}
        visible={fullScreenView}
      />
      <ViewShot ref={viewRef} style={styles.item}>
        <View>
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
            {imageAttr.title && (
              <TouchableOpacity
                onPress={handleOpenLink(imageAttr.url)}
                style={styles.attribute}>
                <Icon
                  style={styles.attributeIcon}
                  name="person-outline"
                  color={'#fff'}
                />
                <Text
                  style={[styles.attributeText, styles.authorAttr]}
                  numberOfLines={1}>
                  Image by {imageAttr.title}
                </Text>
              </TouchableOpacity>
            )}
            {attributeKeyword && (
              <View style={[styles.attribute, styles.infoAttr]}>
                <Icon
                  style={styles.attributeIcon}
                  name="information-circle-outline"
                  color={'#fff'}
                />
                <Text style={styles.attributeText} numberOfLines={1}>
                  {attributeKeyword}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Text
              style={styles.title}
              numberOfLines={3}
              onPress={handleOpenLink(link)}>
              {title}
            </Text>
            <View style={styles.contentMetaInfo}>
              <TouchableOpacity
                onPress={handleOpenLink(website)}
                style={styles.contentMetaInfo}>
                <Icon
                  name="person-outline"
                  size={14}
                  color="#808080"
                  style={styles.contentIcon}
                />
                <Text style={styles.contentMetaText}>{author}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contentMetaInfo}
                onPress={handleOpenLink(link)}>
                <Icon
                  name="calendar-outline"
                  size={14}
                  color="#808080"
                  style={styles.contentIcon}
                />
                <Text style={styles.contentMetaText}>
                  {renderMetaText(datePublished)}
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={styles.contentInfoText}
              numberOfLines={scale(10)}
              onPress={toggleFullScreenView}>
              {infoText}
            </Text>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <ImageBackground
            source={{ uri: imageUrl }}
            imageStyle={styles.footerBg}>
            <View style={[styles.footer]}>
              <Text style={styles.subtitle} numberOfLines={2}>
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
                  style={styles.iconContainer}
                  onPress={() =>
                    handleShare({
                      title: `Get latest dev short blogs, news and regular updates on the only Thin App`,
                      message:
                        'Checkout the **Thin App**. Get latest dev short blogs, news and regular updates on the only Thin App. Download the app #link',
                    })
                  }>
                  <Icon
                    name="share-social-outline"
                    size={footerIconSize}
                    color="#808080"
                  />
                  <Text style={styles.iconText}>share</Text>
                </TouchableOpacity>

                <TouchableOpacity
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
                    {state.dislike}{' '}
                    {getPlural(state.dislike, 'downvote', 'downvotes')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={handleLike}>
                  <Icon
                    name={getActiveIcon('like', 'arrow-up', 'arrow-up-circle')}
                    size={footerIconSize}
                    color={getActiveIconColor('like')}
                  />
                  <Text style={styles.iconText}>
                    {state.like} {getPlural(state.like, 'upvote', 'upvotes')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </ViewShot>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  item: {
    flex: 1,
    backgroundColor: '#fffffc',
    borderRadius: scale(10),
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
    marginBottom: scale(5),
    fontSize: scale(theme.fontSizes.base - 3),
    color: theme.text.dark.black,
    ...theme.fontWeights.bold,
  },
  infoText: {
    fontSize: scale(16),
    marginBottom: scale(10),
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
    fontSize: scale(theme.fontSizes.xs - 3),
    color: theme.text.dark.dimGray,
    marginRight: scale(10),
    ...theme.fontWeights.normal,
  },
  website: {
    textDecorationLine: 'underline',
  },
  contentInfoText: {
    lineHeight: scale(20),
    marginBottom: scale(10),
    width: '100%',
    fontSize: scale(theme.fontSizes.sm - 2.4),
    color: theme.text.dark.black,
    ...theme.fontWeights.normal,
  },
  imageContainer: {
    position: 'relative',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: scale(5),
    paddingHorizontal: scale(5),
    paddingVertical: scale(2),
    top: scale(10),
    left: scale(10),
  },
  attributeText: {
    fontSize: scale(theme.fontSizes.xs),
    color: theme.text.light.lightGray,
    textAlign: 'center',
    ...theme.fontWeights.medium,
  },
  authorAttr: {
    fontSize: scale(10),
  },
  infoAttr: {
    bottom: scale(10),
    right: scale(10),
    top: undefined,
    left: undefined,
  },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
  subtitle: {
    width: '100%',
    paddingTop: scale(3),
    fontSize: scale(theme.fontSizes.xs - 2),
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
    fontSize: scale(theme.fontSizes.xs - 2),
    color: theme.text.light.lightGray,
    textAlign: 'center',
    ...theme.fontWeights.medium,
  },
}));

export default React.memo(NewsItem);
