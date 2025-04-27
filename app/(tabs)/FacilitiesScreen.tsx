// FacilitiesScreen.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FacilitiesScreen() {
  const router = useRouter();

  // Example facilities (static for now)
  const facilities = [
    {
      id: 1,
      name: 'ABC Rehabilitation Center',
      address: '123 Main St, City',
      phoneNumber: '+123456789',
      description: 'A leading rehab center.',
      image: 'https://via.placeholder.com/150', // Example image
    },
    {
      id: 2,
      name: 'Cure4you Rehab Facility',
      address: '456 Elm St, City',
      phoneNumber: '+987654321',
      description: 'Helping you heal.',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Recommended Facilities Nearby</Text>

      {/* Facilities List */}
      {facilities.map((facility) => (
        <TouchableOpacity
          key={facility.id}
          style={styles.facilityButton}
          onPress={() => router.push({
            pathname: '/facilityDetail',
            params: { 
              name: facility.name,
              address: facility.address,
              phoneNumber: facility.phoneNumber,
              description: facility.description,
              image: facility.image,
            }
          })}
        >
          <Text style={styles.facilityText}>{facility.name}</Text>
          <Ionicons name="arrow-forward" size={20} color="black" />
        </TouchableOpacity>
      ))}

      {/* You can add search or image down here if you want */}
    </ScrollView>
  );
}

// --- Now the missing styles 👇 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // white background
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  facilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f0f0f0', // light gray card
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  facilityText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
