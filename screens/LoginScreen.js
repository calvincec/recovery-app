import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
	<View style={styles.container}>
	  <Text style={styles.title}>Substance Looooogin Recovery</Text>
	  <Button title="Get Started" onPress={() => navigation.navigate('Login')} />
	</View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
