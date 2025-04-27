// app/screens/StreakScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TOTAL_DAYS = 7; // Example 7 days

const StreakScreen = () => {
  const { streak } = useLocalSearchParams<{ streak: string }>();

  const streakNumber = parseInt(streak || '0');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Streak Progress</Text>

      <View style={styles.circlesContainer}>
        {[...Array(TOTAL_DAYS)].map((_, index) => (
          <View key={index} style={styles.circleWrapper}>
            {index < streakNumber ? (
              <Ionicons name="checkmark-circle" size={50} color="green" />
            ) : (
              <Ionicons name="ellipse-outline" size={50} color="gray" />
            )}
          </View>
        ))}
      </View>

      <Text style={styles.streakText}>
        {streakNumber >= TOTAL_DAYS
          ? 'Amazing! Full Streak Achieved 🎉'
          : `You are on a ${streakNumber} day streak! Keep it going! 🔥`}
      </Text>
    </View>
  );
};

export default StreakScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
    marginVertical: 30,
  },
  circleWrapper: {
    margin: 8,
  },
  streakText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
