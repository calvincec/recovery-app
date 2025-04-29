// MapScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BackButton from '@/navigation/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function MapScreen() {

	const [mapUrl, setMapUrl] = useState<string | null>(null);

	// get the params and remember to import a missing module
	//get the
	useEffect(()=>{

		const setfacilities = async () => {
			const storedData = await AsyncStorage.getItem('currentFacility');
			if (storedData) {
				const details = JSON.parse(storedData).facilityDetails;
				const facilities = [
					details.address,
					details.facilityName,
				]
	
				const searchQuery = facilities
				.map(name => name.trim().replace(/\s+/g, '+'))
				.join('+');
	
				const url = `https://www.google.com/maps/embed/v1/place?q=${searchQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
	
				setMapUrl(url);
			  }
			else{
				const storedData = await AsyncStorage.getItem('facilityData');
				if(storedData){
					
				const details = JSON.parse(storedData)[0].facilityDetails;
				const facilities = [
					details.address,
					details.facilityName,
				]
	
				const searchQuery = facilities
				.map(name => name.trim().replace(/\s+/g, '+'))
				.join('+');
	
				const url = `https://www.google.com/maps/embed/v1/place?q=${searchQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;

				
				
				setMapUrl(url);

				}
				else{
					const url = `https://www.google.com/maps/embed/v1/place?q=$health+center&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
				}

			}
	
		};

		setfacilities();
		console.log(mapUrl);
		
	}, []);
	// const setfacilities = async () => {
	// 	const storedData = await AsyncStorage.getItem('currentFacility');
	// 	if (storedData) {
	// 		const details = JSON.parse(storedData).facilityDetails;
	// 		const facilities = [
	// 			details.address,
	// 			details.facilityName,
	// 		]

	// 		const searchQuery = facilities
	// 		.map(name => name.trim().replace(/\s+/g, '+'))
	// 		.join('+');

	// 		const url = `https://www.google.com/maps/embed/v1/place?q=${searchQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;

	// 		setMapUrl(url);
	// 	  }

	// };


	
  	// const facilities = [
    // 'Betty Ford Center California',
    // 'Hazelden Betty Ford Minnesota',
    // 'Promises Treatment Center Malibu',
    // 'The Ranch Tennessee',
    // 'Passages Malibu California',
// 	details.address,
// 	'university of nairobi',
//   ];

  // Replace spaces with + inside each facility, then join all with +
//   const searchQuery = facilities
//     .map(name => name.trim().replace(/\s+/g, '+'))
//     .join('+');

//   console.log(searchQuery);
  

//   const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${searchQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;

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
