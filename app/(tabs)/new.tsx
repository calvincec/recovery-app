import { StyleSheet, Image, Platform, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function NewScreen() {
	const router = useRouter();
	  return (


	<ThemedView style={styles.titleContainer}>
			<ThemedText type="title">Welcome!</ThemedText>
			<HelloWave />
			<ThemedText type='defaultSemiBold'>some text id here</ThemedText>
			<Button title="Click me" onPress={() => router.push('/(tabs)/explore')} />
	</ThemedView>
  );
}

const styles = StyleSheet.create({
	titleContainer: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  gap: 8,
	//   backgroundColor: 'red',
	},
	stepContainer: {
	  gap: 8,
	  marginBottom: 8,
	},
	reactLogo: {
	  height: 178,
	  width: 290,
	  bottom: 0,
	  left: 0,
	  position: 'absolute',
	},
  });
  