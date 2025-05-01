import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function FacilityDetail() {
  const [facilityData, setFacilityData] = useState<{
    facilityName: string;
    address: string;
    phoneNumber: string;
    description: string;
    imageUri: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFacilityData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('currentFacility');
        if (storedData) {
          setFacilityData(JSON.parse(storedData).facilityDetails);
        }
      } catch (error) {
        console.log('Error fetching facility data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityData();
  }, []);

  const goToMap = () => {
    router.push('/(tabs)/map');
  };

  const handleExit = async () => {
    try {
      await AsyncStorage.removeItem('currentFacility');
      router.replace('/LoginScreen');
    } catch (error) {
      console.log('Failed to remove currentFacility:', error);
    }
  };

  const handleRequestAppointment = async () => {
    try {
      const appointment = {
        id: Date.now(),
        facility: facilityData?.facilityName,
        timestamp: new Date().toISOString(),
        status: 'Pending',
      };

      const existing = await AsyncStorage.getItem('appointmentRequests');
      let updatedRequests = existing ? JSON.parse(existing) : [];
      updatedRequests.push(appointment);

      await AsyncStorage.setItem('appointmentRequests', JSON.stringify(updatedRequests));
      router.push('/AppointmentConfirmationScreen');
    } catch (error) {
      Alert.alert('Error', 'Could not submit your appointment request.');
      console.log(error);
    }
  };

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
        <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18 }}>
          No Facility Data Found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {facilityData.imageUri && (
        <Image source={{ uri: facilityData.imageUri }} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.card}>
        <Text style={styles.title}>{facilityData.facilityName}</Text>

        <Text style={styles.label}>Address:</Text>
        <TouchableOpacity onPress={goToMap}>
          <Text style={[styles.text, { color: '#007bff', textDecorationLine: 'underline' }]}>
            {facilityData.address}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.text}>{facilityData.phoneNumber}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.text}>{facilityData.description}</Text>
      </View>

      <TouchableOpacity onPress={handleRequestAppointment} style={styles.appointmentButton}>
        <Text style={styles.buttonText}>Request Appointment</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
        <Text style={styles.exitText}>Exit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#344d3f',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
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
  appointmentButton: {
    backgroundColor: '#6f2da8',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  exitButton: {
    marginTop: 16,
    backgroundColor: '#6f2da8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
