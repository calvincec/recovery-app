import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const backgroundImage = require('../auths/login.png'); // Replace with your image path


export default function HomeScreen() {
  const router = useRouter();

  const handleProfilePress = () => router.push('/ProfileScreen');
  const handleFacilitiesPress = () => router.push('/FacilitiesScreen');
  const handleMapsPress = () => router.push('/map');
  const navtoChat = () => router.push('/chat');

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <StatusBar barStyle="light-content" />

      {/* Top Profile Icon */}
      <TouchableOpacity onPress={handleProfilePress} style={styles.profileIcon}>
        <Ionicons name="person-circle-outline" size={44} color="#fff" />
      </TouchableOpacity>

      {/* Main Card Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Home!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleFacilitiesPress}>
            <Text style={styles.buttonText}>Facilities</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleMapsPress}>
            <Text style={styles.buttonText}>Maps</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Chat Icon */}
      <TouchableOpacity style={styles.chatIcon} onPress={navtoChat}>
        <Ionicons name="chatbubble-ellipses-outline" size={30} color="#333" />
      </TouchableOpacity>
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
  profileIcon: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 10,
  },
  overlay: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingVertical: 50,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: '#6f2da8',
  },
  secondaryButton: {
    backgroundColor: '#344d3f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  chatIcon: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 14,
    borderRadius: 30,
    elevation: 6,
  },
});
