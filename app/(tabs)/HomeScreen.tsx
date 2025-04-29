import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const backgroundImage = require('../auths/.homepage.jpg'); // Adjust path if needed

export default function HomeScreen() {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push('/ProfileScreen');
  };

  const handleFacilitiesPress = () => {
    router.push('/FacilitiesScreen');
  };

  const handleMapsPress = () => {
    router.push('/map');
  };

  const navtoChat = () => {
    router.push('/chat');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <StatusBar barStyle="light-content" />

      <View style={styles.overlay}>
        {/* Top Left Profile Icon */}
        <TouchableOpacity onPress={handleProfilePress} style={styles.profileIcon}>
          <Ionicons name="person-circle-outline" size={40} color="#333" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Welcome Home!</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleFacilitiesPress}>
            <Text style={styles.buttonText}>Facilities</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleMapsPress}>
            <Text style={styles.buttonText}>Maps</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Chat Icon */}
      <TouchableOpacity style={styles.chatIcon} onPress={navtoChat}>
        <Ionicons name="chatbubble-ellipses-outline" size={32} color="#000" />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    margin: 20,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  profileIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
    gap: 20,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  chatIcon: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
});
