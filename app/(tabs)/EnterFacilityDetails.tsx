import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@react-navigation/native';


const EnterFacilityDetails = () => {
  const [facilityName, setFacilityName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(''); 
  const [messageType, setMessageType] = useState('');

  const router = useRouter();
  const { colors } = useTheme();
  const textColor = colors.text;
  const backgroundColor = colors.background;

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
		setMessage('Permission Required, Gallery access is needed to upload an image.');
      	setMessageType('error');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Image Picker Error:', error);
      Alert.alert('Error', 'Something went wrong while selecting an image.');
    }
  };

  const resetFields = () => {
    setFacilityName('');
    setAddress('');
    setPhoneNumber('');
    setDescription('');
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    if (!facilityName || !address || !phoneNumber || !description || !selectedImage) {
		// console.log("Incomplete details", facilityName, address, phoneNumber, description, selectedImage);
		setMessage('Incomplete Details Please complete all fields and upload an image.');
      	setMessageType('error');
      return;
    }

    const facilityData = {
      facilityName,
      address,
      phoneNumber,
      description,
      imageUri: selectedImage,
    };

    try {
      setLoading(true);
	//   set facilityDetails in currentfacility
	  const currentFacility = await AsyncStorage.getItem('currentFacility');
	  if (currentFacility) {
		const parsedFacility = JSON.parse(currentFacility);
		parsedFacility.facilityDetails = facilityData;
		await AsyncStorage.setItem('currentFacility', JSON.stringify(parsedFacility));


		const existingData = await AsyncStorage.getItem('facilityData');
		let updatedData = [];

		if (existingData !== null) {
		  updatedData = JSON.parse(existingData);
		  if (!Array.isArray(updatedData)) {
			updatedData = [updatedData];
		  }

		for (let i = 0; i < updatedData.length; i++) {
			if (updatedData[i].facilityName === parsedFacility.facilityName && updatedData[i].email === parsedFacility.email) {
				updatedData[i] = parsedFacility; // Update the existing entry
				await AsyncStorage.setItem('facilityData', JSON.stringify(updatedData));
				resetFields();
				setMessage('Successfully entered the details');
      			setMessageType('success');
				router.replace('/(tabs)/FacilityDetail')

				
				return;
			}
		}

	  	}
		}


    } catch (error) {
      console.log('Saving Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor, padding: 16 }}>
      <ThemedText style={{ color: textColor, fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
        Enter Facility Details
      </ThemedText>

      <TextInput
        placeholder="Facility Name"
        value={facilityName}
        onChangeText={setFacilityName}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          color: textColor,
        }}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          color: textColor,
        }}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          color: textColor,
        }}
      />
      <TextInput
        placeholder="Short Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          color: textColor,
        }}
      />

      <TouchableOpacity onPress={handlePickImage}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: colors.border,
            marginBottom: 24,
          }}
        >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={{ width: 160, height: 160, borderRadius: 16 }} />
          ) : (
            <Text style={{ color: colors.text }}>Upload Facility Image</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          padding: 16,
          borderRadius: 16,
          alignItems: 'center',
          backgroundColor: loading ? colors.disabled : colors.primary,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save and proceed</Text>
        )}
      </TouchableOpacity>

	  {/* Display feedback message */}
			{message !== '' && (
			  <Text style={[styles.message, messageType === 'error' ? styles.errorText : styles.successText]}>
				{message}
			  </Text>
			)}
    </View>
  );
};

export default EnterFacilityDetails;


const styles = StyleSheet.create({
	message: {
		textAlign: 'center',
		marginTop: 10,
		fontSize: 16,
	  },
	  errorText: {
		color: 'red',
	  },
	  successText: {
		color: 'green',
	  },
});