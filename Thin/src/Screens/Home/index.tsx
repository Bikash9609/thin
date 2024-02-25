import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Linking } from 'react-native';
import moment from 'moment';

export interface NewsItemProps {
  id: number;
  title: string; // Title of the news item (max 60 characters)
  infoText: string; // Short description of the news item (max 100 words)
  imageUrl: string; // URL of the image for the news item
  attributeKeyword: string; // Keyword associated with the news item
  subtitle: string; // Subtitle of the news item (max 2 lines)
  link?: string; // Optional URL to redirect to when clicking on the news item
  author: string;
  website: string;
  datePublished: string;
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
}) => {
  const [upvotes, setUpvotes] = useState(20);
  const [downvotes, setDownvotes] = useState(10);
  const [comments, setComments] = useState(5);

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [slideAnimation] = useState(new Animated.Value(0));

  const handleLike = () => setIsLiked(!isLiked);
  const handleDislike = () => setIsDisliked(!isDisliked);
  const handleComment = () => {
    // Implement your comment functionality here (e.g., navigate to a comment screen)
  };
  const handleOpenLink = () => {
    if (link) {
      Linking.openURL(link);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.item}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <TouchableOpacity onPress={handleOpenLink} style={styles.attribute}>
            <View style={styles.attribute}>
              <Icon
                style={styles.attributeIcon}
                name="person-outline"
                color={'#fff'}
              />
              <Text
                style={[styles.attributeText, styles.authorAttr]}
                numberOfLines={1}>
                Image by Arjun
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenLink}>
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
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={3}>
            {title}
          </Text>
          <View style={styles.contentMetaInfo}>
            <TouchableOpacity
              onPress={handleOpenLink}
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
              onPress={handleOpenLink}>
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
          <Text style={styles.contentInfoText}>{infoText}</Text>
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: '#333' }]}>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={styles.reactionIcons}>
          <TouchableOpacity style={styles.iconContainer} onPress={handleLike}>
            <Icon name="arrow-up" size={20} color="#808080" />
            <Text style={styles.iconText}>{upvotes} upvotes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={handleDislike}>
            <Icon name="arrow-down" size={20} color="#808080" />
            <Text style={styles.iconText}>{downvotes} downvotes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={handleComment}>
            <Icon name="share-social-outline" size={20} color="#808080" />
            <Text style={styles.iconText}>{comments} shares</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
