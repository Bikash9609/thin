import * as React from 'react';
import { Dimensions, View } from 'react-native';
import {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel, {
  CarouselRenderItem,
  TCarouselProps,
} from 'react-native-reanimated-carousel';

import { PostResponse } from '@/Screens/Home';

const { height, width } = Dimensions.get('window');

export enum ArrowDirection {
  IS_VERTICAL = 0,
  IS_HORIZONTAL = 1,
}

function calculatePercentage(value: number, percentage: number) {
  'worklet';
  return (value * percentage) / 100;
}

type Props = Partial<
  Pick<TCarouselProps, 'onProgressChange' | 'onSnapToItem' | 'ref'>
> & {
  data: PostResponse[];
  renderItem: CarouselRenderItem<PostResponse>;
};

const StackCardCarousel = React.forwardRef(
  ({ data, renderItem, ...rest }: Props, ref: any) => {
    const PAGE_WIDTH = width;
    const PAGE_HEIGHT = height;
    const directionAnim = useSharedValue<ArrowDirection>(
      ArrowDirection.IS_HORIZONTAL,
    );
    const [, setIsVertical] = React.useState(true);

    const animationStyle = React.useCallback(
      (value: number) => {
        'worklet';

        const translateX = interpolate(
          value,
          [-1, 0, 1],
          [-PAGE_WIDTH, 0, PAGE_WIDTH + calculatePercentage(PAGE_WIDTH, 50)],
          Extrapolation.CLAMP,
        );

        const zIndex = interpolate(
          value,
          [-1, 0, 1],
          [-300, 0, 300],
          Extrapolation.CLAMP,
        );

        const scale = interpolate(
          value,
          [-1, 0, 1],
          [1, 1, 1.2],
          Extrapolation.CLAMP,
        );

        // Shadow properties
        const shadowOpacity = interpolate(
          value,
          [-1, 0, 1],
          [0.5, 0, 0.5],
          Extrapolation.CLAMP,
        );
        return {
          transform: [{ translateX }, { scale }],
          zIndex,
          shadowColor: 'black',
          shadowOpacity,
          shadowRadius: 10, // Adjust shadow radius as needed
          borderRadius: 10, // Adjust border radius as needed
        };
      },
      [PAGE_HEIGHT, PAGE_WIDTH],
    );

    useAnimatedReaction(
      () => directionAnim.value,
      direction => {
        switch (direction) {
          case ArrowDirection.IS_VERTICAL:
            runOnJS(setIsVertical)(true);
            break;
          case ArrowDirection.IS_HORIZONTAL:
            runOnJS(setIsVertical)(false);
            break;
        }
      },
      [],
    );

    return (
      <View style={{ flex: 1 }}>
        <Carousel
          style={{
            backgroundColor: '#fff',
          }}
          vertical={false}
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          data={data}
          loop={false}
          snapEnabled
          renderItem={renderItem}
          customAnimation={animationStyle}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10], // Enable horizontal panning
            failOffsetY: [-5, 5], // Limit vertical movement to fail the gesture
          }}
          windowSize={10}
          {...rest}
          ref={ref}
        />
      </View>
    );
  },
);

export default StackCardCarousel;
