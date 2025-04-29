import React, { useState } from 'react'; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@react-navigation/native';

const EnterFacilityDetails = () => {
  const [facilityName, setFacilityName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();
  const textColor = colors.text;

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery access is needed to upload an image.');
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
      console.error('Image Picker Error:', error);
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
    if (
      !facilityName.trim() ||
      !address.trim() ||
      !phoneNumber.trim() ||
      !description.trim() ||
      !selectedImage
    ) {
      Alert.alert('Incomplete Details', 'Please complete all fields and upload an image.');
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

      const existingData = await AsyncStorage.getItem('allFacilities');
      const facilityList = existingData ? JSON.parse(existingData) : [];

      const updatedList = [...facilityList, newFacility];
      await AsyncStorage.setItem('allFacilities', JSON.stringify(updatedList));

      Alert.alert('Success', 'Facility details saved successfully!');
      resetFields(); // Clear the form after saving
    } catch (error) {
      console.error('Saving Error:', error);
      Alert.alert('Error', 'Unable to save facility details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#6e3b37', padding: 16 }}>
      <ThemedText
        style={{
          color: textColor,
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        Enter Facility Details
      </ThemedText>

      <TextInput
        placeholder="Facility Name"
        placeholderTextColor="#ccc"
        value={facilityName}
        onChangeText={setFacilityName}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          color: textColor,
          backgroundColor: '#fff',
        }}
      />
      <TextInput
        placeholder="Address"
        placeholderTextColor="#ccc"
        value={address}
        onChangeText={setAddress}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          color: textColor,
          backgroundColor: '#fff',
        }}
      />
      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#ccc"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          color: textColor,
          backgroundColor: '#fff',
        }}
      />
      <TextInput
        placeholder="Short Description"
        placeholderTextColor="#ccc"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          color: textColor,
          backgroundColor: '#fff',
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
            borderColor: '#ccc',
            marginBottom: 24,
            backgroundColor: '#fff',
          }}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 160, height: 160, borderRadius: 16 }}
            />
          ) : (
            <Text style={{ color: '#666' }}>Upload Facility Image</Text>
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
          backgroundColor: loading ? '#aaa' : '#2196f3',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save and Refresh</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EnterFacilityDetails;
