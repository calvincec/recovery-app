// FacilityDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FacilityDetail() {
  const [facilityData, setFacilityData] = useState<{
    facilityName: string;
    address: string;
    phoneNumber: string;
    description: string;
    imageUri: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilityData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('facilityData');
        if (storedData) {
          setFacilityData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error fetching facility data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!facilityData) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18 }}>No Facility Data Found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Facility Image */}
      {facilityData.imageUri && (
        <Image
          source={{ uri: facilityData.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Facility Card */}
      <View style={styles.card}>
        <Text style={styles.title}>{facilityData.facilityName}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.text}>{facilityData.address}</Text>

        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.text}>{facilityData.phoneNumber}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.text}>{facilityData.description}</Text>
      </View>
    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  image: {
    width: '100%',
    height: 300,
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
    elevation: 5,
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
