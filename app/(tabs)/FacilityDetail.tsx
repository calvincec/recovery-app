// FacilityDetail.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function FacilityDetail() {
  const { name, address, phoneNumber, description, image } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      {/* Facility Image */}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Facility Card */}
      <View style={styles.card}>
        <Text style={styles.title}>{name}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.text}>{address}</Text>

        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.text}>{phoneNumber}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.text}>{description}</Text>
      </View>
    </ScrollView>
  );
}

// --- Properly defined styles with shadow/card effect ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // light gray background
    padding: 20,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Android shadow
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
});
