import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router'


const router = useRouter();
const { colors } = useTheme();
const iconColor = colors.background === 'rgb(1, 1, 1)' ? '#fff' : '#000';

export default function BackBtn(url: string) {

	return (
	  <TouchableOpacity onPress={() => router.push(url)}>
		<Icon name="arrow-back" size={30} color={iconColor} />
		
	  </TouchableOpacity>
	);


}




