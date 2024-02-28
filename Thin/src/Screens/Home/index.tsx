import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Linking } from 'react-native';
import moment from 'moment';
import useShare from '../../hooks/useShare';
import ViewShot from 'react-native-view-shot';
import useCardActions, { ActionType } from '../../hooks/useCardAction';
import { getPlural } from '../../helpers/wrods';
import useIsComponentInView from '../../hooks/useIsComponentInView';

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
}) => {
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
  const getActiveIcon = (
    type: ActionType,
    inactive: string,
    active: string,
  ) => {
    return type === activeUserValue ? active : inactive;
  };

  return (
    <View ref={componentRef} key={uuid} style={styles.container}>
      <StatusBar showHideTransition="slide" />
      <ViewShot ref={viewRef} style={styles.item}>
        <View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
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
            <Text style={styles.contentInfoText} numberOfLines={10}>
              {infoText}
            </Text>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <View style={[styles.footer, { backgroundColor: '#333' }]}>
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
            <View style={styles.reactionIcons}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() =>
                  handleShare({
                    title: `Get latest dev short blogs, news and regular updates on the only Thin App`,
                    message:
                      'Checkout the **Thin App**. Get latest dev short blogs, news and regular updates on the only Thin App. Download the app #link',
                  })
                }>
                <Icon name="refresh-outline" size={20} color="#808080" />
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
                <Icon name="share-social-outline" size={20} color="#808080" />
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
                  size={20}
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
                  size={20}
                  color={getActiveIconColor('like')}
                />
                <Text style={styles.iconText}>
                  {state.like} {getPlural(state.like, 'upvote', 'upvotes')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ViewShot>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: 210,
    resizeMode: 'cover',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },

  contentMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 6,
    paddingTop: 2,
  },
  contentIcon: {
    marginRight: 5,
  },
  contentMetaText: {
    fontSize: 12,
    color: '#808080',
    marginRight: 10,
  },
  website: {
    textDecorationLine: 'underline',
  },
  contentInfoText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 10,
    width: '100%',
  },

  imageContainer: {
    position: 'relative',
  },
  attributeIcon: {
    marginRight: 5,
  },
  attribute: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    top: 10,
    left: 10, // Change left: 10 to right: 10
  },
  attributeText: {
    color: '#fff',
    fontSize: 12,
  },
  authorAttr: {
    fontSize: 10,
  },
  infoAttr: {
    bottom: 10,
    right: 10,
    top: undefined,
    left: undefined,
  },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#808080',
    textAlign: 'center',
  },
  reactionIcons: {
    paddingTop: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Adjust width as needed
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconText: {
    fontSize: 10,
    color: '#808080',
  },
});

export default NewsItem;
