import React from 'react';
import NewsItem from './Screens/Home';

function Navigator() {
  return (
    <NewsItem
      subtitleLink="https://www.frulow.com"
      subtitle="Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial"
      imageUrl="https://static.inshorts.com/inshorts/images/v1/variants/webp/xs/2024/02_feb/10_sat/img_1707557430398_80.webp"
      title="Eiffel Tower made of 706,900 matchsticks sets world record after earlier denial"
      attributeKeyword="Is something else going on here?"
      infoText={`An Eiffel Tower replica, made with 706,900 matches and 23 kilos of glue, set a Guinness World Record for its height. Earlier, the 7.2-metre (23.6 ft) high structure, made by Richard Plaud, was denied the record over the use of wrong matchsticks. "We were a little bit too harsh on the type of matches," Guinness World Records said. `}
    />
  );
}

export default Navigator;
