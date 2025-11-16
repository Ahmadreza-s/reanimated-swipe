import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '../../components/Slider';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const handleImageClick = (image: string, measurement: any) => {
    if (measurement) {
      const params = new URLSearchParams({
        url: image,
        x: measurement.x.toString(),
        y: measurement.y.toString(),
        width: measurement.width.toString(),
        height: measurement.height.toString(),
      });
      router.push(`/card?${params.toString()}`);
    } else {
      router.push(`/card?url=${image}`);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2a3b94', '#3a1a5a', '#804078']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}>
        <Slider onImageClicked={handleImageClick} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
  },
});
