import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TOTAL_DAYS = 7;

const StreakScreen = () => {
  const router = useRouter();
  const { streak } = useLocalSearchParams<{ streak: string }>();
  const streakNumber = parseInt(streak || '0');

  return (
    <View style={styles.container}>
      {/* 🔙 Back Icon */}
      <TouchableOpacity style={styles.backIcon} onPress={() => router.replace('/ProfileScreen')}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>🔥 Your Streak Progress 🔥</Text>

      <Image
        source={require('../auths/streak.png')}
        style={styles.streakImage}
        resizeMode="contain"
      />

      <View style={styles.circlesContainer}>
        {[...Array(TOTAL_DAYS)].map((_, index) => (
          <View key={index} style={styles.circleWrapper}>
            {index < streakNumber ? (
              <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            ) : (
              <Ionicons name="ellipse-outline" size={50} color="#BDBDBD" />
            )}
          </View>
        ))}
      </View>

      <Text style={styles.streakText}>
        {streakNumber >= TOTAL_DAYS
          ? '🎉 Amazing! Full Streak Achieved!'
          : `🔥 You're on a ${streakNumber}-day streak! Keep it going!`}
      </Text>
    </View>
  );
};

export default StreakScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backIcon: { // ✅ New style for back icon
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6f00',
    textAlign: 'center',
    marginBottom: 20,
  },
  streakImage: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  circleWrapper: {
    margin: 8,
  },
  streakText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
});
