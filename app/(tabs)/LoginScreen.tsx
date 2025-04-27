import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Account Type</Text>

      <View style={styles.buttonContainer}>
        <Button title="User" onPress={() => router.push('/UserAuthScreen')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Facility" onPress={() => router.push('/FacilityAuthScreen')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});
