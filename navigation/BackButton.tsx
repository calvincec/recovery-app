import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useTheme } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const iconColor = colors.background === 'rgb(1, 1, 1)' ? '#fff' : '#000';

  
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon name="arrow-back" size={30} color={iconColor} />
	  
    </TouchableOpacity>
  );
};

export default BackButton;


