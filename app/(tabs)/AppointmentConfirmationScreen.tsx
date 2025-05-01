import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AppointmentConfirmationScreen() {
  const router = useRouter();

  const goBack = () => {
    router.replace('/HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Request Submitted</Text>
      <Text style={styles.text}>Your appointment request has been seccussfully sent .</Text>

      <TouchableOpacity onPress={goBack} style={styles.button}>
        <Text style={styles.buttonText}>Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#344d3f',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6f2da8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
