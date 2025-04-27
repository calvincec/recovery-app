import { StyleSheet, Image, Platform, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NewScreen() {
	  return (
	// <div>
	// 	<p style={{ fontSize: 20, textAlign: 'center', marginTop: 20, color: 'white' }}>
	// 		The new page is here
	// 	</p>
	// </div>

	<ThemedView style={styles.titleContainer}>
			<ThemedText type="title">Welcome!</ThemedText>
			<HelloWave />
			<ThemedText type='defaultSemiBold'>some text id here</ThemedText>
			<Button title="Click me" onPress={() => alert('Button pressed!')} />
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
  