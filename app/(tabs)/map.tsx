import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BackButton from '@/navigation/BackButton';

export default function MapScreen() {
  const { address } = useLocalSearchParams();

  const location = typeof address === 'string' ? address : 'Nairobi'; // default fallback
  const searchQuery = location.trim().replace(/\s+/g, '+');

  const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${searchQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;

  return (
    <View style={styles.container}>
      <ThemedView
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <BackButton />
        <ThemedView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ThemedText type="title">Map View</ThemedText>
        </ThemedView>
      </ThemedView>

      <View style={styles.outerdiv}>
        <View style={styles.innerdiv}>
          <iframe
            style={styles.iframe}
            src={mapUrl}
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
});
