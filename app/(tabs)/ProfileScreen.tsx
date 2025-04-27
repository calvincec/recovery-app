// app/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();

  const user = {
    name: 'John Doe',
    streak: 5,
    profileImage: 'https://via.placeholder.com/150',
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => router.replace('/login') },
    ]);
  };

  const handleViewStreak = () => {
    router.push({
      pathname: '/StreakScreen',
      params: { streak: user.streak },
    });
  };

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
