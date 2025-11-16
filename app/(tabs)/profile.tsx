import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Details() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe', '#43e97b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}>
        <View style={styles.content}>
          <Text style={styles.title}>Profile Page</Text>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.95)',
  },
});
