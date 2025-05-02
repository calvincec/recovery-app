import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const backgroundImage = require('../auths/login.png'); // Replace with your local asset

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; streak: number; profileImage: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          setUser({
            name: parsedUser.name,
            email: parsedUser.email,
            streak: parsedUser.streak || 0,
            profileImage: parsedUser.profileImage || 'https://via.placeholder.com/150',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    router.replace('/UserAuthScreen');
  };

  const handleViewStreak = () => {
    if (user) {
      router.push({
        pathname: '/StreakScreen',
        params: { streak: user.streak.toString() },
      });
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <StatusBar barStyle="light-content" />

      {/* ✅ Close (X) Icon to go back to HomeScreen */}
      <TouchableOpacity style={styles.closeIcon} onPress={() => router.replace('/HomeScreen')}>
        <Ionicons name="close" size={32} color="red" />
      </TouchableOpacity>

      <View style={styles.overlay}>
        <Text style={styles.title}>Profile</Text>

        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />

        <Text style={styles.detailText}>Name: {user.name}</Text>
        <Text style={styles.detailText}>Email: {user.email}</Text>
        <Text style={styles.detailText}>Streak: {user.streak} days</Text>

        <TouchableOpacity style={[styles.button, styles.streakButton]} onPress={handleViewStreak}>
          <Text style={styles.buttonText}>View Streak</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ProfileScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: { // ✅ New style for X icon
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 10,
  },
  overlay: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#6f2da8',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 8,
    color: '#444',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  streakButton: {
    backgroundColor: '#6f2da8',
  },
  logoutButton: {
    backgroundColor: '#344d3f',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#440961',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
});
