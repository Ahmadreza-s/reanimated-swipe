import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, Pressable, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  SharedValue,
} from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

interface SliderItemProps {
  imageUrl: string;
  imageHeight: number;
  imageWidth: number;
  onPress?: (url: string, measurement: any) => void;
  numOfCards: number;
  index: number;
  activeIndex: SharedValue<number>;
}

const SliderItem = ({
  imageUrl,
  imageHeight,
  imageWidth,
  onPress,
  numOfCards,
  index,
  activeIndex,
}: SliderItemProps) => {
  const styles = makeStyles({ width: imageWidth, height: imageHeight });
  const translationX = useSharedValue(0);
  const imageContainerRef = React.useRef<View>(null);

  const randomOffsetX = React.useRef((Math.random() - 0.5) * 200);
  const randomRotation = React.useRef((Math.random() - 0.5) * 30);
  const randomDelay = React.useRef(Math.random() * 80);

  const entryTranslateY = useSharedValue(-screenWidth);
  const entryTranslateX = useSharedValue(randomOffsetX.current);
  const entryRotation = useSharedValue(randomRotation.current);
  const entryOpacity = useSharedValue(0);
  const entryScale = useSharedValue(0.5);

  useEffect(() => {
    const delay = index * 200 + randomDelay.current;
    const springConfig = {
      damping: 18,
      stiffness: 40,
      mass: 1.5,
    };

    entryTranslateY.value = withDelay(delay, withSpring(0, springConfig));
    entryTranslateX.value = withDelay(delay, withSpring(0, springConfig));
    entryRotation.value = withDelay(delay, withSpring(0, springConfig));
    entryOpacity.value = withDelay(delay, withSpring(1, springConfig));
    entryScale.value = withDelay(delay, withSpring(1, springConfig));
  }, [index]);

  const handlePress = () => {
    if (imageContainerRef.current && onPress) {
      imageContainerRef.current.measureInWindow((x, y, width, height) => {
        onPress(imageUrl, { x, y, width, height });
      });
    } else if (onPress) {
      onPress(imageUrl, null);
    }
  };

  const animatedCard = useAnimatedStyle(() => {
    const baseScale = interpolate(activeIndex.value, [index - 1, index, index + 1], [0.95, 1, 1.1]);
    const baseTranslateY = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [-20, 0, 20]
    );
    const swipeRotation = interpolate(
      translationX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-10, 0, 10]
    );

    return {
      opacity:
        entryOpacity.value *
        interpolate(activeIndex.value, [index - 1, index, index + 1], [1 - 1 / 5, 1, 1]),
      transform: [
        {
          scale: entryScale.value * baseScale,
        },
        {
          translateY: entryTranslateY.value + baseTranslateY,
        },
        {
          translateX: entryTranslateX.value + translationX.value,
        },
        {
          rotateZ: `${entryRotation.value + swipeRotation}deg`,
        },
      ],
    };
  });

  const gesture = Gesture.Pan()
    .onChange((event) => {
      translationX.value = event.translationX;
      activeIndex.value = interpolate(Math.abs(translationX.value), [0, 500], [index, index + 0.8]);
    })
    .onEnd((event) => {
      if (Math.abs(event.velocityX) > 400) {
        translationX.value = withSpring(Math.sign(event.velocityX) * 500, {
          velocity: event.velocityX,
        });
        activeIndex.value = withSpring(index + 1);
      } else {
        translationX.value = withSpring(0);
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.card,
          animatedCard,
          {
            zIndex: numOfCards - index,
          },
        ]}>
        <Pressable onPress={handlePress}>
          <View ref={imageContainerRef} collapsable={false}>
            <Animated.Image style={styles.image} source={{ uri: imageUrl }} />
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

interface MakeStylesProps {
  width: number;
  height: number;
}

const makeStyles = ({ width, height }: MakeStylesProps) =>
  StyleSheet.create({
    card: {
      position: 'absolute',
    },
    image: {
      resizeMode: 'cover',
      width,
      height,
    },
  });

export default SliderItem;
