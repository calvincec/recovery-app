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

interface Facility {
  facilityName: string;
  address: string;
  phoneNumber: string;
  description: string;
  imageUri: string;
  accessCount: number;
}

export default function FacilitiesScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const storedData = await AsyncStorage.getItem('allFacilities'); // expects array
      if (storedData) {
        const facilityList: Facility[] = JSON.parse(storedData);

        // Sort by accessCount (descending) first, then alphabetically
        const sortedFacilities = facilityList.sort((a, b) => {
          if (b.accessCount !== a.accessCount) {
            return b.accessCount - a.accessCount;
          }
          return a.facilityName.localeCompare(b.facilityName);
        });

        setFacilities(sortedFacilities);
        setFilteredFacilities(sortedFacilities);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    const filtered = facilities.filter((facility) =>
      facility.facilityName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFacilities(filtered);

    // Redirect if exactly one match found
    if (filtered.length === 1) {
      const matchedFacility = filtered[0];

      try {
        const updatedFacilities = facilities.map((f) =>
          f.facilityName === matchedFacility.facilityName
            ? { ...f, accessCount: f.accessCount + 1 }
            : f
        );

        await AsyncStorage.setItem('allFacilities', JSON.stringify(updatedFacilities));

        router.push({
          pathname: '/FacilityDetail',
          params: { ...matchedFacility },
        });
      } catch (error) {
        console.error('Error updating access count:', error);
      }
    }
  };

  const handleFacilityPress = async (facility: Facility) => {
    try {
      // Increment accessCount
      const updatedFacilities = facilities.map((f) =>
        f.facilityName === facility.facilityName
          ? { ...f, accessCount: f.accessCount + 1 }
          : f
      );

      await AsyncStorage.setItem('allFacilities', JSON.stringify(updatedFacilities));

      // Navigate to FacilityDetail screen with details
      router.push({
        pathname: '/FacilityDetail',
        params: { ...facility },
      });
    } catch (error) {
      console.error('Error updating access count:', error);
    }
  };

  const recommendedFacilities = facilities.slice(0, 3); // top 3 by access count

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
          <View>
            <Text style={styles.facilityText}>{facility.facilityName}</Text>
            <Text style={styles.addressText}>{facility.address}</Text>
          </View>
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
          key={`all-${index}`}
          style={styles.facilityButton}
          onPress={() => handleFacilityPress(facility)}
        >
          <View>
            <Text style={styles.facilityText}>{facility.facilityName}</Text>
            <Text style={styles.addressText}>{facility.address}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="black" />
        </TouchableOpacity>
      ))}
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
  addressText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
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
});
