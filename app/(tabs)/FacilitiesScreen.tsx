import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FacilityDetails {
  facilityName: string;
  address: string;
  phoneNumber: string;
  description: string;
  imageUri: string;
}

interface FacilityData {
  facilityName: string;
  email: string;
  password: string;
  facilityDetails: FacilityDetails;
}

interface FacilityWithAccess extends FacilityDetails {
  accessCount: number;
}

export default function FacilitiesScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [facilities, setFacilities] = useState<FacilityWithAccess[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<FacilityWithAccess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const storedData = await AsyncStorage.getItem('facilityData');
      if (storedData) {
        const rawData: FacilityData[] = JSON.parse(storedData);


		const facilitiesList: FacilityWithAccess[] = rawData
		.map((facility) => facility?.facilityDetails)
		.filter((details): details is FacilityDetails => !!details?.facilityName) // ensures type safety
		.map((details) => ({
			...details,
			accessCount: 0,
		}));


		// Safe sort
		const sortedFacilities = facilitiesList.sort((a, b) =>
		(a.facilityName || '').localeCompare(b.facilityName || '')
		);
		
        setFacilities(sortedFacilities);
        setFilteredFacilities(sortedFacilities);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = facilities.filter((facility) =>
      facility.facilityName.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredFacilities(filtered);
  };

  const recommendedFacilities = [...facilities]
    .sort((a, b) => b.accessCount - a.accessCount)
    .slice(0, 3);

  const handleFacilityPress = async (facility: FacilityWithAccess) => {
    try {
      await AsyncStorage.setItem(
        'currentFacility',
        JSON.stringify({ facilityDetails: facility })
      );

      router.push('/FacilityDetail');
    } catch (error) {
      console.error('Error storing facility:', error);
    }
  };

  const clearCurrentFacilityAndGoHome = async () => {
    try {
      await AsyncStorage.removeItem('currentFacility');
      router.replace('/HomeScreen');
    } catch (error) {
      console.error('Error clearing currentFacility:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Recommended Facilities</Text>

      {recommendedFacilities.map((facility, index) => (
        <TouchableOpacity
          key={`recommended-${index}`}
          style={styles.facilityButton}
          onPress={() => handleFacilityPress(facility)}
        >
          <Text style={styles.facilityText}>{facility.facilityName}</Text>
          <Ionicons name="star" size={20} color="gold" />
        </TouchableOpacity>
      ))}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search facilities..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.heading}>All Facilities</Text>

      {filteredFacilities.map((facility, index) => (
        <TouchableOpacity
          key={index}
          style={styles.facilityButton}
          onPress={() => handleFacilityPress(facility)}
        >
          <Text style={styles.facilityText}>{facility.facilityName}</Text>
          <Ionicons name="arrow-forward" size={20} color="black" />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.clearButton} onPress={clearCurrentFacilityAndGoHome}>
        <Text style={styles.clearButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  facilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f0f0f0',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#ff4d4f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
