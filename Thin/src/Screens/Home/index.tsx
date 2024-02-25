import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You might need to install this package: `expo install @expo/vector-icons`
import { Linking } from 'react-native';
import { PanResponderGestureState } from 'react-native';

const SWIPE_THRESHOLD = 0.2; // Adjust as needed
const CENTERING_THRESHOLD = 0.1; // Adjust as needed

interface NewsItemProps {
  title: string; // Title of the news item (max 60 characters)
  infoText: string; // Short description of the news item (max 100 words)
  imageUrl: string; // URL of the image for the news item
  attributeKeyword: string; // Keyword associated with the news item
  subtitle: string; // Subtitle of the news item (max 2 lines)
  link?: string; // Optional URL to redirect to when clicking on the news item
}

const NewsItem: React.FC<NewsItemProps> = ({
  title,
  infoText,
  imageUrl,
  attributeKeyword,
  subtitle,
  link,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [slideAnimation] = useState(new Animated.Value(0));
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // Allow swipes
      onPanResponderMove: (event, gestureState) => {
        handleSwipe(gestureState);
      },
    }),
  ).current;

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

  const handleSwipe = (gestureState: PanResponderGestureState) => {
    const { dx } = gestureState;

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      // Slide to the right (like) or left (dislike)
      Animated.timing(slideAnimation, {
        toValue: dx > 0 ? 1 : -1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (Math.abs(dx) > CENTERING_THRESHOLD) {
      // Snap back to center if outside centering zone
      const direction = dx > 0 ? 1 : -1;
      Animated.sequence([
        Animated.timing(slideAnimation, {
          toValue: direction * CENTERING_THRESHOLD,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Center if within centering zone
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const animatedStyle = {
    transform: [
      {
        translateX: slideAnimation.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-200, 0, 200], // Adjust these values for your desired swipe distance
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.item, animatedStyle]}
        {...panResponder.panHandlers}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity onPress={handleOpenLink}>
          <View style={styles.imgAuthor}>
            <Icon name="person-outline" color={'#808080'} />
            <Text style={styles.attributeText}>Arjun</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenLink}>
          <View style={styles.attribute}>
            <Text style={styles.attributeText}>{attributeKeyword}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenLink}>
          <View style={styles.attribute}>
            <Text style={styles.attributeText}>{attributeKeyword}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.infoText}>{infoText}</Text>
        </View>
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={styles.reactionIcons}>
          <TouchableOpacity onPress={handleLike}>
            <Icon
              name={isLiked ? 'arrow-up' : 'arrow-up-outlined'}
              size={20}
              color={isLiked ? 'blue' : '#808080'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDislike}>
            <Icon
              name={isDisliked ? 'arrow-down' : 'arrow-down-outlined'}
              size={20}
              color={isDisliked ? 'red' : '#808080'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleComment}>
            <Icon name="chatbubble-outline" size={20} color="#808080" />
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
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 10,
    width: '100%',
  },
  imgAuthor: {
    bottom: undefined,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    top: 10,
    left: 10,
  },
  attribute: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  attributeText: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#808080',
  },
  reactionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%', // Adjust width as needed
  },
});

export default NewsItem;
