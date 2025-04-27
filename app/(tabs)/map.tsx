import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { HelloWave } from '@/components/HelloWave';
import BackButton from "@/navigation/BackButton";

export default function MapScreen() {
  const facilities = [
    'Betty Ford Center California',
    'Hazelden Betty Ford Minnesota',
    'Promises Treatment Center Malibu',
    'The Ranch Tennessee',
    'Passages Malibu California'
  ];

  // Replace spaces with + inside each facility, then join all with +
  const searchQuery = facilities
    .map(name => name.trim().replace(/\s+/g, '+'))
    .join('+');



  const mapUrl = `https://www.google.com/maps/embed/v1/search?q=${searchQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
  const router = useRouter();
  return (
	
    <View style={styles.container}>

			<ThemedView style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '20', paddingTop: 20, paddingBottom: 20}}>
				<BackButton  />	
				<ThemedView style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, width: '100%'}}>
					<ThemedText type="title">Maps</ThemedText>
				</ThemedView>
				
			</ThemedView>

		

		<div style={styles.outerdiv}>
			<div style={styles.innerdiv}>
				<iframe style={styles.iframe} src={mapUrl} frameborder="0"></iframe>
			</div>
		</div>

	
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
