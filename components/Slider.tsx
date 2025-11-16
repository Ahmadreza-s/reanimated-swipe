import { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useAnimatedReaction, useSharedValue, runOnJS } from 'react-native-reanimated';
import SliderItem from './SliderItem';

const cardAspectRatio = 2.5 / 3.5;
const imageWidth = Math.min(280, Dimensions.get('window').width - 64);
const imageHeight = imageWidth / cardAspectRatio;

const urls = [
  'https://deckofcardsapi.com/static/img/AH.png',
  'https://deckofcardsapi.com/static/img/KH.png',
  'https://deckofcardsapi.com/static/img/QH.png',
  'https://deckofcardsapi.com/static/img/JH.png',
  'https://deckofcardsapi.com/static/img/0H.png',
  'https://deckofcardsapi.com/static/img/9H.png',
  'https://deckofcardsapi.com/static/img/8H.png',
  'https://deckofcardsapi.com/static/img/7H.png',
  'https://deckofcardsapi.com/static/img/6H.png',
  'https://deckofcardsapi.com/static/img/5H.png',
  'https://deckofcardsapi.com/static/img/4H.png',
  'https://deckofcardsapi.com/static/img/3H.png',
  'https://deckofcardsapi.com/static/img/2H.png',
];

interface SliderProps {
  onImageClicked?: (image: string, measurement: any) => void;
}

const Slider = ({ onImageClicked }: SliderProps) => {
  const [images, setImages] = useState<string[]>(urls);
  const activeIndex = useSharedValue(0);
  const [index, setIndex] = useState(0);

  useAnimatedReaction(
    () => activeIndex.value,
    (value) => {
      if (Math.floor(value) !== index) runOnJS(setIndex)(Math.floor(value));
    }
  );

  useEffect(() => {
    if (images && images.length > 0) {
      const image = images[index];
      setImages((prevImages) => [...prevImages, image]);
    }
  }, [index]);

  if (!images || images.length === 0) return null;

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
        marginTop: 30,
        height: imageHeight + 64,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {images.map((image, idx) => (
        <SliderItem
          key={idx}
          numOfCards={images.length}
          index={idx}
          activeIndex={activeIndex}
          onPress={(url, measurement) => onImageClicked?.(url, measurement)}
          imageUrl={image}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
      ))}
    </View>
  );
};

export default Slider;
