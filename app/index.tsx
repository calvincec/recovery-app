import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function LaunchScreen() {
  const router = useRouter();

  return (
	<View style={styles.container}>
	  {/* Logo or App Name */}
	  <Image
		source={require('@/assets/images/launcimg.png')}
		style={styles.logo}
		resizeMode="contain"
	  />

	  <Text style={styles.title}>Welcome to MyApp!</Text>

	  {/* Get Started Button */}
	  <Button
		title="Get Started"
		onPress={() => router.replace('/auths/LoginScreen')} // 👈 replace so LaunchScreen won't stay in stack
	  />
	</View>
  );
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: '#ffffff',
	alignItems: 'center',
	justifyContent: 'center',
	paddingHorizontal: 20,
  },
  logo: {
	width: 200,
	height: 200,
	marginBottom: 20,
  },
  title: {
	fontSize: 28,
	fontWeight: 'bold',
	marginBottom: 20,
  },
});
