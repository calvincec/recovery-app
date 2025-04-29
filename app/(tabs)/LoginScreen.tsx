import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require('../auths/login.png'); // Ensure this file is placed in assets folder

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
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.overlay}>
        <Text style={styles.title}>Choose Your Account Type</Text>

        <TouchableOpacity
          style={[styles.button, styles.userButton]}
          onPress={() => handleSelectAccount('User')}
        >
          <Text style={styles.buttonText}>User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.facilityButton]}
          onPress={() => handleSelectAccount('Facility')}
        >
          <Text style={styles.buttonText}>Facility</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  userButton: {
    backgroundColor: '#344d3f',
  },
  facilityButton: {
    backgroundColor: '#35328a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
