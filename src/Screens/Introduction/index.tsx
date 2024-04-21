import { makeStyles } from '@rneui/themed';
import React, { useRef, useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { s } from 'react-native-size-matters';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Feature {
  id: number;
  image: string;
  text: string;
}

const { width } = Dimensions.get('window');

const features: Feature[] = [
  {
    id: 1,
    image: 'https://via.placeholder.com/500',
    text: 'Read short blogs, news, and updates in a fraction of time, saving your day and time.',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/300',
    text: 'Add your own content and share it with others to read and get liked.',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/300',
    text: "Like or dislike content you enjoy or don't like.",
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/300',
    text: 'Stay updated with more features coming soon.',
  },
];

const IntroductionScreen: React.FC = () => {
  const styles = useStyles();
  const carouselRef = useRef<Carousel<Feature>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNextSlide = () => {
    if (carouselRef.current) {
      const nextIndex = (activeIndex + 1) % features.length;
      setActiveIndex(nextIndex);
      carouselRef.current.snapToNext();
    }
  };

  const renderItem = ({ item }: { item: Feature }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.text}>{item.text}</Text>

      <View style={styles.swipeRightContainer}>
        <Text style={styles.swipeRightText}>Swipe right to continue</Text>
        <Ionicons
          name="chevron-forward-circle-outline"
          size={s(34)}
          onPress={handleNextSlide}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={features}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={s(300)}
        onSnapToItem={index => setActiveIndex(index)}
      />
      <Pagination
        dotsLength={features.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={styles.dotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    width: s(300),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(20),
    paddingVertical: s(20),
  },
  image: {
    width: '100%',
    height: s(300),
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: s(theme.fontSizes.base),
    ...theme.fontWeights.medium,
  },
  paginationContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    marginHorizontal: 8,
  },

  swipeRightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeRightText: {
    color: theme.text.dark.dimGray,
    marginBottom: s(5),
    marginTop: s(10),
    fontSize: s(theme.fontSizes.sm - 1),
    ...theme.fontWeights.normal,
  },
}));

export default IntroductionScreen;
