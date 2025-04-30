// app/screens/LoginScreen.tsx
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  

  const handleSelectAccount = async (accountType: 'User' | 'Facility') => {
    try {
      await AsyncStorage.setItem('accountType', accountType);
      if (accountType === 'User') {
        router.push('/UserAuthScreen');
      } else {
        router.push('/FacilityAuthScreen');
      }
    } catch (error) {
      console.error('Error saving account type:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Account Type</Text>

      <View style={styles.buttonContainer}>
        <Button title="User" onPress={() => handleSelectAccount('User')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Facility" onPress={() => handleSelectAccount('Facility')} />
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
