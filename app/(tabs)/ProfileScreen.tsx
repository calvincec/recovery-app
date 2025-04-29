import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    streak: number;
    profileImage: string;
  } | null>(null);

  useEffect(() => {
    // Load user data once
    (async () => {
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
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    })();
  }, []);

  

  const handleLogout = async () => {
	//logout someone without using the alert
	await AsyncStorage.removeItem('currentUser'); // remove current user data
	router.replace('/UserAuthScreen'); // navigate to UserAuthScreen


  };


  const handleViewStreak = () => {
    if (!user) return;
    router.push({
      pathname: '/StreakScreen',
      params: { streak: user.streak.toString() },
    });
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Loading Profile…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.profileImage }} style={styles.avatar} />
      </View>

      <Text style={styles.info}>Name: {user.name}</Text>
      <Text style={styles.info}>Email: {user.email}</Text>
      <Text style={[styles.info, { marginBottom: 24 }]}>
        Streak: {user.streak} days
      </Text>

      <TouchableOpacity
        onPress={handleViewStreak}
        style={[styles.button, { backgroundColor: '#0066cc' }]}>
        <Text style={styles.buttonText}>View Streak</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.button, { backgroundColor: '#cc0000' }]}>
        <Text style={styles.buttonText}>Logout</Text>
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
