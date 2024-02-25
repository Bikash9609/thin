import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import NewsItem, { NewsItemProps } from './Screens/Home';

const SCREEN_HEIGHT = Dimensions.get('window').height - 23;

const newsItems = [
  {
    id: 1,
    author: 'ABP news',
    datePublished: new Date().toISOString(),
    website: 'https://frulow.com',
    link: 'https://www.frulow.com',
    subtitle:
      'Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    imageUrl:
      'https://static.inshorts.com/inshorts/images/v1/variants/webp/xs/2024/02_feb/10_sat/img_1707557430398_80.webp',
    title:
      'Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    attributeKeyword: 'Is something else going on here?',
    infoText: `An Eiffel Tower replica, made with 706,900 matches and 23 kilos of glue, set a Guinness World Record for its height. Earlier, the 7.2-metre (23.6 ft) high structure, made by Richard Plaud, was denied the record over the use of wrong matchsticks. "We were a little bit too harsh on the type of matches," Guinness World Records said. `,
  },
  {
    id: 2,
    author: 'ABP news',
    datePublished: new Date().toISOString(),
    website: 'https://frulow.com',
    link: 'https://www.frulow.com',
    subtitle:
      '2 Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    imageUrl:
      'https://static.inshorts.com/inshorts/images/v1/variants/webp/xs/2024/02_feb/10_sat/img_1707557430398_80.webp',
    title:
      'Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    attributeKeyword: 'Is something else going on here?',
    infoText: `An Eiffel Tower replica, made with 706,900 matches and 23 kilos of glue, set a Guinness World Record for its height. Earlier, the 7.2-metre (23.6 ft) high structure, made by Richard Plaud, was denied the record over the use of wrong matchsticks. "We were a little bit too harsh on the type of matches," Guinness World Records said. `,
  },
  {
    id: 3,
    author: 'ABP news',
    datePublished: new Date().toISOString(),
    website: 'https://frulow.com',
    link: 'https://www.frulow.com',
    subtitle:
      '3 Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    imageUrl:
      'https://static.inshorts.com/inshorts/images/v1/variants/webp/xs/2024/02_feb/10_sat/img_1707557430398_80.webp',
    title:
      'Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    attributeKeyword: 'Is something else going on here?',
    infoText: `An Eiffel Tower replica, made with 706,900 matches and 23 kilos of glue, set a Guinness World Record for its height. Earlier, the 7.2-metre (23.6 ft) high structure, made by Richard Plaud, was denied the record over the use of wrong matchsticks. "We were a little bit too harsh on the type of matches," Guinness World Records said. `,
  },
  {
    id: 4,
    author: 'ABP news',
    datePublished: new Date().toISOString(),
    website: 'https://frulow.com',
    link: 'https://www.frulow.com',
    subtitle:
      '4 Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    imageUrl:
      'https://static.inshorts.com/inshorts/images/v1/variants/webp/xs/2024/02_feb/10_sat/img_1707557430398_80.webp',
    title:
      'Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    attributeKeyword: 'Is something else going on here?',
    infoText: `An Eiffel Tower replica, made with 706,900 matches and 23 kilos of glue, set a Guinness World Record for its height. Earlier, the 7.2-metre (23.6 ft) high structure, made by Richard Plaud, was denied the record over the use of wrong matchsticks. "We were a little bit too harsh on the type of matches," Guinness World Records said. `,
  },
  {
    id: 5,
    author: 'ABP news',
    datePublished: new Date().toISOString(),
    website: 'https://frulow.com',
    link: 'https://www.frulow.com',
    subtitle:
      '2 Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    imageUrl:
      'https://static.inshorts.com/inshorts/images/v1/variants/webp/xs/2024/02_feb/10_sat/img_1707557430398_80.webp',
    title:
      'Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    attributeKeyword: 'Is something else going on here?',
    infoText: `An Eiffel Tower replica, made with 706,900 matches and 23 kilos of glue, set a Guinness World Record for its height. Earlier, the 7.2-metre (23.6 ft) high structure, made by Richard Plaud, was denied the record over the use of wrong matchsticks. "We were a little bit too harsh on the type of matches," Guinness World Records said. `,
  },
  {
    id: 6,
    author: 'ABP news',
    datePublished: new Date().toISOString(),
    website: 'https://frulow.com',
    link: 'https://www.frulow.com',
    subtitle:
      '6 Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    imageUrl:
      'https://static.inshorts.com/inshorts/images/v1/variants/webp/xs/2024/02_feb/10_sat/img_1707557430398_80.webp',
    title:
      'Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    attributeKeyword: 'Is something else going on here?',
    infoText: `An Eiffel Tower replica, made with 706,900 matches and 23 kilos of glue, set a Guinness World Record for its height. Earlier, the 7.2-metre (23.6 ft) high structure, made by Richard Plaud, was denied the record over the use of wrong matchsticks. "We were a little bit too harsh on the type of matches," Guinness World Records said. `,
  },
  {
    id: 7,
    author: 'ABP news',
    datePublished: new Date().toISOString(),
    website: 'https://frulow.com',
    link: 'https://www.frulow.com',
    subtitle:
      '7 Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    imageUrl:
      'https://static.inshorts.com/inshorts/images/v1/variants/webp/xs/2024/02_feb/10_sat/img_1707557430398_80.webp',
    title:
      'Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial',
    attributeKeyword: 'Is something else going on here?',
    infoText: `An Eiffel Tower replica, made with 706,900 matches and 23 kilos of glue, set a Guinness World Record for its height. Earlier, the 7.2-metre (23.6 ft) high structure, made by Richard Plaud, was denied the record over the use of wrong matchsticks. "We were a little bit too harsh on the type of matches," Guinness World Records said. `,
  },
  // Add more news items as needed
];

const Navigator = () => {
  const renderNewsItem = ({ item }: { item: NewsItemProps }) => (
    <NewsItem
      id={item.id}
      author={item.author}
      datePublished={item.datePublished}
      website={item.website}
      link={item.link}
      subtitle={item.subtitle}
      imageUrl={item.imageUrl}
      title={item.title}
      attributeKeyword={item.attributeKeyword}
      infoText={item.infoText}
    />
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={newsItems}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id.toString()}
        sliderHeight={SCREEN_HEIGHT}
        itemHeight={SCREEN_HEIGHT}
        vertical={true}
        swipeThreshold={70}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Navigator;
