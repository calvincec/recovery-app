import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const EnterFacilityDetails = () => {
  const [facilityName, setFacilityName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const navigation = useNavigation();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!facilityName || !address || !phoneNumber || !description) {
      alert('Please fill all fields!');
      return;
    }

    navigation.navigate('Home'); // after success go to home or facility dashboard
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

      <TouchableOpacity onPress={handleSubmit} className="bg-blue-600 p-4 rounded-xl items-center">
        <Text className="text-white font-bold">Save and Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EnterFacilityDetails;
