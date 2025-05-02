import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MapScreen() {
  const router = useRouter();
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [quote, setQuote] = useState('');

  const quotes = [
    "Wherever you are, care should follow.",
    "Maps lead the way, health leads the future.",
    "Compassion has no borders.",
    "The road to wellness begins here.",
    "Finding care just got easier.",
  ];

  useEffect(() => {
    const setfacilities = async () => {
      let facilities = ['facilitycenter', 'facilitycenter'];

      const storedCurrent = await AsyncStorage.getItem('currentFacility');

      if (storedCurrent) {
        const details = JSON.parse(storedCurrent).facilityDetails;

        if (details?.address && details?.facilityName) {
          facilities = [details.address, details.facilityName];
        }

        const searchQuery = facilities
          .map(name => name.trim().replace(/\s+/g, '+'))
          .join('+');

        const url = `https://www.google.com/maps/embed/v1/place?q=${searchQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
        setMapUrl(url);
      } else {
        const storedFallback = await AsyncStorage.getItem('facilityData');

        if (storedFallback) {
          const details = JSON.parse(storedFallback)[0]?.facilityDetails;

          if (details?.address && details?.facilityName) {
            facilities = [details.address, details.facilityName];
          }

          const searchQuery = facilities
            .map(name => name.trim().replace(/\s+/g, '+'))
            .join('+');

          const url = `https://www.google.com/maps/embed/v1/place?q=${searchQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
          setMapUrl(url);
        } else {
          const url = `https://www.google.com/maps/embed/v1/place?q=health+center&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
          setMapUrl(url);
        }
      }

      // Set random quote
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    };

    setfacilities();
  }, []);

  const handleBack = async () => {
    try {
      const prevRoute = await AsyncStorage.getItem('mapRoute');

      if (!prevRoute) {
        router.back();
      } else if (prevRoute === 'FacilityDetail') {
        await AsyncStorage.removeItem('mapRoute');
        router.replace('/FacilityDetail');
      } else if (prevRoute === 'mapRoute') {
        router.replace('/HomeScreen');
      } else {
        router.back();
      }
    } catch (error) {
      console.error('Back navigation error:', error);
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backIcon} onPress={handleBack}>
        <Ionicons name="arrow-back" size={40} color="#946" />
      </TouchableOpacity>

      <ThemedView
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 20,
          paddingBottom: 10,
        }}
      >
        <ThemedText type="title">Map View</ThemedText>
        {quote !== '' && (
          <ThemedText type="default" style={styles.quote}>
            “{quote}”
          </ThemedText>
        )}
      </ThemedView>

      <View style={styles.outerdiv}>
        <View style={styles.innerdiv}>
          <iframe
            style={styles.iframe}
            src={mapUrl || ''}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  iframe: {
    width: '100%',
    height: '100%',
  },
  innerdiv: {
    width: '100%',
    height: '100%',
  },
  outerdiv: {
    width: '100%',
    height: '100%',
  },
  quote: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
});
