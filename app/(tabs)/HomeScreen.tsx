import React from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push('/ProfileScreen');
  };

  const handleFacilitiesPress = () => {
    router.push('/FacilitiesScreen');
  };

  const handleMapsPress = () => {
    router.push('/maps');
  };

  return (
    <View style={styles.container}>
      
      {/* Top Left Profile Icon */}
      <TouchableOpacity onPress={handleProfilePress} style={styles.profileIcon}>
        <Ionicons name="person-circle-outline" size={40} color="black" />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    position: 'relative',
  },
  profileIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 80,
  },
  buttonContainer: {
    marginTop: 30,
    gap: 20,
  },
  button: {
    backgroundColor: '#4F46E5', // A nice blue
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
