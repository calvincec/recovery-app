import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const EnterFacilityDetails = () => {
  const [facilityName, setFacilityName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  const handleSubmit = async () => {
    if (!facilityName.trim() || !address.trim() || !phoneNumber.trim() || !description.trim() || !selectedImage) {
      Alert.alert('Incomplete Details', 'Please complete all fields and upload an image.');
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
      await AsyncStorage.setItem('facilityData', JSON.stringify(facilityData));

      Alert.alert('Success', 'Facility details saved successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/FacilityDetailScreen'),
        },
      ]);
    } catch (error) {
      console.error('Saving Error:', error);
      Alert.alert('Error', 'Unable to save facility details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6 text-center">Enter Facility Details</Text>

      <TextInput
        placeholder="Facility Name"
        value={facilityName}
        onChangeText={setFacilityName}
        className="border p-3 rounded-xl mb-4"
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        className="border p-3 rounded-xl mb-4"
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        className="border p-3 rounded-xl mb-4"
      />
      <TextInput
        placeholder="Short Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        className="border p-3 rounded-xl mb-4"
      />

      <TouchableOpacity onPress={handlePickImage}>
        <View className="flex items-center justify-center p-6 rounded-2xl border-dashed border-2 border-gray-400 mb-6">
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} className="w-40 h-40 rounded-xl" />
          ) : (
            <Text className="text-gray-500">Upload Facility Image</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className={`p-4 rounded-xl items-center ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Save and Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EnterFacilityDetails;

