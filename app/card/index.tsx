import { Pressable, StyleSheet, Dimensions, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getCardName = (url: string): string => {
  const filename = url.split('/').pop()?.replace('.png', '') || '';
  const rankCharacter = filename[0];

  const rankNames: { [key: string]: string } = {
    A: 'تک',
    K: 'شاه',
    Q: 'بی بی',
    J: 'سرباز',
    '0': 'ده',
    '2': 'دو',
    '3': 'سه',
    '4': 'چهار',
    '5': 'پنج',
    '6': 'شش',
    '7': 'هفت',
    '8': 'هشت',
    '9': 'نه',
  };

  return `${rankNames[rankCharacter] || rankCharacter} دل`;
};

export default function Details() {
  const params = useLocalSearchParams<{
    url: string;
    x?: string;
    y?: string;
    width?: string;
    height?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cardName = useMemo(() => getCardName(params.url || ''), [params.url]);

  const startX = params.x ? parseFloat(params.x) : screenWidth / 2;
  const startY = params.y ? parseFloat(params.y) : screenHeight / 2;
  const startWidth = params.width ? parseFloat(params.width) : 280;
  const startHeight = params.height ? parseFloat(params.height) : startWidth / (2.5 / 3.5);

  const targetWidth = screenWidth * 0.4;
  const targetHeight = targetWidth / (2.5 / 3.5);
  const padding = 20;
  const targetX = insets.left + padding + targetWidth / 2;
  const targetY = insets.top + padding + targetHeight / 2;

  const startCenterX = startX + startWidth / 2;
  const startCenterY = startY + startHeight / 2;

  const translateX = useSharedValue(startCenterX - targetX);
  const translateY = useSharedValue(startCenterY - targetY);
  const scaleX = useSharedValue(startWidth / targetWidth);
  const scaleY = useSharedValue(startHeight / targetHeight);
  const rotation = useSharedValue(5);
  const opacity = useSharedValue(0);

  const textTranslateY = useSharedValue(30);
  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.8);

  const springConfig = { damping: 15, stiffness: 100, mass: 0.8 };
  const textSpringConfig = { damping: 12, stiffness: 100, mass: 0.6 };

  useEffect(() => {
    translateX.value = withSpring(0, springConfig);
    translateY.value = withSpring(0, springConfig);
    scaleX.value = withSpring(1, springConfig);
    scaleY.value = withSpring(1, springConfig);
    rotation.value = withSpring(0, springConfig);
    opacity.value = withTiming(1, { duration: 300 });

    const delay = 200;
    textTranslateY.value = withDelay(delay, withSpring(0, textSpringConfig));
    textOpacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    textScale.value = withDelay(delay, withSpring(1, textSpringConfig));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
      { rotateZ: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }, { scale: textScale.value }],
    opacity: textOpacity.value,
  }));

  const handleBack = () => {
    const startCenterX = startX + startWidth / 2;
    const startCenterY = startY + startHeight / 2;

    textOpacity.value = withTiming(0, { duration: 200 });
    textTranslateY.value = withTiming(30, { duration: 200 });
    textScale.value = withTiming(0.8, { duration: 200 });

    translateX.value = withTiming(startCenterX - targetX, { duration: 350 });
    translateY.value = withTiming(startCenterY - targetY, { duration: 350 });
    scaleX.value = withTiming(startWidth / targetWidth, { duration: 350 });
    scaleY.value = withTiming(startHeight / targetHeight, { duration: 350 });
    rotation.value = withTiming(-5, { duration: 350 });
    opacity.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(router.back)();
    });
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={handleBack}>
      <BlurView intensity={80} style={styles.blurContainer}>
        <View style={styles.darkOverlay} />
        <Animated.Image
          source={{ uri: params.url as string }}
          style={[
            styles.image,
            {
              position: 'absolute',
              left: insets.left + 20,
              top: insets.top + 20,
            },
            animatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.textContainer,
            {
              position: 'absolute',
              bottom: insets.bottom + 40,
              left: insets.left + 20,
              right: insets.right + 20,
            },
            textAnimatedStyle,
          ]}>
          <Animated.Text style={styles.cardName}>{cardName}</Animated.Text>
        </Animated.View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  image: {
    width: screenWidth * 0.4,
    height: (screenWidth * 0.4) / (2.5 / 3.5),
    resizeMode: 'contain',
  },
  textContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
