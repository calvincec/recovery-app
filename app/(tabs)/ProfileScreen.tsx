import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
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
        const raw = await AsyncStorage.getItem('userData');
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser({
            name: parsed.name,
            email: parsed.email,
            streak: parsed.streak ?? 0,
            profileImage: 'https://via.placeholder.com/150',
          });
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    })();
  }, []);

  // Extracted logout logic into a named async function
  const performLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      router.replace('/UserAuthScreen'); // route must match renamed file
    } catch (err) {
      console.error('Logout Error:', err);
      Alert.alert('Error', 'Could not log out. Please try again.');
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ],
      { cancelable: true }
    );
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  info: { fontSize: 18, marginBottom: 8 },
  button: { padding: 16, borderRadius: 12, marginBottom: 16 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18 },
});
