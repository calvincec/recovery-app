import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Button } from 'react-native';
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

  const router = useRouter();
  const { colors } = useTheme();
  const textColor = colors.text;
  const backgroundColor = colors.background;

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
          onPress: () => {
            resetFields(); // Clear inputs after saving
            router.replace('/FacilityDetail');
          },
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
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save and refresh</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EnterFacilityDetails;