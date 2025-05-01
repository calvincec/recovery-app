import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';

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

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setMessage('Permission required to access gallery.');
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
      setMessage('Incomplete details. Please fill all fields and upload an image.');
      setMessageType('error');
      return;
    }

    const newFacility = {
      facilityName,
      address,
      phoneNumber,
      description,
      imageUri: selectedImage,
      accessCount: 0,
    };

    try {
      setLoading(true);

      const currentFacility = await AsyncStorage.getItem('currentFacility');
      if (currentFacility) {
        const parsedFacility = JSON.parse(currentFacility);
        parsedFacility.facilityDetails = newFacility;
        await AsyncStorage.setItem('currentFacility', JSON.stringify(parsedFacility));

        const existingData = await AsyncStorage.getItem('facilityData');
        let updatedData = [];

        if (existingData) {
          updatedData = JSON.parse(existingData);
          if (!Array.isArray(updatedData)) updatedData = [updatedData];

          for (let i = 0; i < updatedData.length; i++) {
            if (
              updatedData[i].facilityName === parsedFacility.facilityName &&
              updatedData[i].email === parsedFacility.email
            ) {
              updatedData[i] = parsedFacility;
              await AsyncStorage.setItem('facilityData', JSON.stringify(updatedData));
              resetFields();
              setMessage('Successfully entered the details');
              setMessageType('success');
              router.replace('../(tabs)/FacilityDetail');
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
    <View style={styles.container}>
      <ThemedText style={styles.title}>Enter Facility Details</ThemedText>

      <TextInput
        placeholder="Facility Name"
        placeholderTextColor="#888"
        value={facilityName}
        onChangeText={setFacilityName}
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        placeholderTextColor="#888"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#888"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Short Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
      />

      <TouchableOpacity onPress={handlePickImage}>
        <View style={styles.imagePicker}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <Text style={{ color: '#666' }}>Upload Facility Image</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={[styles.submitButton, loading && { backgroundColor: '#aaa' }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save and proceed</Text>
        )}
      </TouchableOpacity>

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
  container: {
    flex: 1,
    backgroundColor: '#344d3f',
    padding: 20,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#344d3f',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: 'white',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 24,
    backgroundColor: '#344d3f',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 16,
  },
  submitButton: {
    backgroundColor: '#344d3f',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#d32f2f',
  },
  successText: {
    color: '#388e3c',
  },
});
