// app/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; streak: number; profileImage: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser({
            name: parsedUser.name,
            email: parsedUser.email,
            streak: parsedUser.streak || 0, // Default 0 if not stored
            profileImage: 'https://via.placeholder.com/150', // Placeholder image
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchUserData();
  }, []);

  

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('userData'); // clear user data
  
            // Navigate immediately
            router.replace('/UserAuthScreen'); 
  
            // (Optional) If you still want a small "toast" or "flash" message,
            // we can add a Toast later separately (like Expo Toast or react-native-toast-message)
  
          } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Error', 'Something went wrong while logging out.');
          }
        }
      },
    ]);
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
        Profile
      </Text>

      {/* Profile Image */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Image
          source={{ uri: user.profileImage }}
          style={{ width: 120, height: 120, borderRadius: 60 }}
        />
      </View>

      {/* User Details */}
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Name: {user.name}</Text>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Email: {user.email}</Text>
      <Text style={{ fontSize: 18, marginBottom: 24 }}>Streak: {user.streak} days</Text>

      {/* View Streak Button */}
      <TouchableOpacity
        onPress={handleViewStreak}
        style={{ backgroundColor: 'blue', padding: 16, borderRadius: 12, marginBottom: 16 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>View Streak</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{ backgroundColor: 'green', padding: 16, borderRadius: 12 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
