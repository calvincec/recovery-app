// app/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; streak: number; profileImage: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
		// fetch data from currentUser in AsyncStorage
		const currentUser = await AsyncStorage.getItem('currentUser');
		if (currentUser) {
			const parsedUser = JSON.parse(currentUser);
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

  

  const handleLogout = async () => {
	//logout someone without using the alert
	await AsyncStorage.removeItem('currentUser'); // remove current user data
	router.replace('/UserAuthScreen'); // navigate to UserAuthScreen


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

const styles = StyleSheet.create({
	message: {
		textAlign: 'center',
		marginTop: 10,
		fontSize: 16,
	  },
	  errorText: {
		color: 'red',
	  },
	  successText: {
		color: 'green',
	  },
});
