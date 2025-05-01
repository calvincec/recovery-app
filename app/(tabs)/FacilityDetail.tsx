// FacilityDetail.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
const backgroundImage = require('../auths/login.png');

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
      router.push({
        pathname: '/(tabs)/map',
      });
    
  };

  const handleExit = async () => {
	try {
	  await AsyncStorage.removeItem('currentFacility'); // Clear the stored facility
	  //if prevoous rooter is FacilitiesScreen then router.replace('/LoginScreen') else router.back()
	  const prevRoute = await AsyncStorage.getItem('prevroute');
	  if (prevRoute === 'EnterFacilityDetails') {
		//clear the prevroute
		await AsyncStorage.removeItem('prevroute');
		router.replace('/LoginScreen');
	  }
	  else {
		router.back();
	  }
	  
	//   router.replace('/LoginScreen');
	} catch (error) {
	  console.log('Failed to remove currentFacility:', error);
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
        <Image
          source={{ uri: facilityData.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
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
	// place it at the middle


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
  exitButton: {
	marginTop: 30,
	backgroundColor: '#e53935',
	paddingVertical: 12,
	borderRadius: 8,
	alignItems: 'center',
  },
  exitText: {
	color: 'white',
	fontSize: 16,
	fontWeight: 'bold',
  },
});
