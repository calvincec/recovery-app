import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FacilityAuthScreen() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(true);
  const [facilityName, setFacilityName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const router = useRouter();

  const saveFacilityData = async (newFacility) => {
    try {
      const existingData = await AsyncStorage.getItem('facilityData');
      let updatedData = [];

      if (existingData !== null) {
        updatedData = JSON.parse(existingData);
        if (!Array.isArray(updatedData)) {
          updatedData = [updatedData];
        }
      }

      updatedData.push(newFacility);
      await AsyncStorage.setItem('facilityData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving facility data:', error);
      throw error;
    }
  };

  const handleCreateAccount = async () => {
    if (!facilityName || !email || !password) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    const storedData = await AsyncStorage.getItem('facilityData');
    if (storedData) {
      const arrvalues = JSON.parse(storedData);
      for (let i = 0; i < arrvalues.length; i++) {
        if (arrvalues[i].email === email) {
          setMessage('Email already exists. Please use a different email.');
          setMessageType('error');
          return;
        }
      }
    }

    const facilityData = {
      facilityName,
      email,
      password,
      role: 'admin', // ✅ include admin role
      facilityDetails: '',
    };

    try {
      await saveFacilityData(facilityData);
      setMessage('Facility account created successfully!');
      setMessageType('success');
      await AsyncStorage.setItem('currentFacility', JSON.stringify(facilityData));
      router.replace('/EnterFacilityDetails'); // ✅ still goes here
    } catch (error) {
      console.log(error);
      setMessage('Something went wrong while creating the account.');
      setMessageType('error');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem('facilityData');
      if (!storedData) {
        setMessage('No facility account found. Please create one first.');
        setMessageType('error');
        return;
      }

      const arrvalues = JSON.parse(storedData);

      for (let i = 0; i < arrvalues.length; i++) {
        if (arrvalues[i].email === email) {
          if (arrvalues[i].password === password) {
            setMessage('Logged in successfully!');
            setMessageType('success');

            await AsyncStorage.setItem('currentFacility', JSON.stringify(arrvalues[i]));
				await AsyncStorage.setItem('prevroute', 'EnterFacilityDetails');

            // ✅ Redirect facility admin to the appointment viewer
            router.replace('/AdminAppointmentRequestsScreen');
            return;
          }
        }
        if (i === arrvalues.length - 1) {
          setMessage('Email or password is incorrect.');
          setMessageType('error');
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong during login.');
      setMessageType('error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isCreatingAccount ? 'Create Facility Account' : 'Facility Login'}
      </Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => {
            setIsCreatingAccount(true);
            setMessage('');
          }}
          style={[styles.toggleButton, isCreatingAccount && styles.activeButton]}
        >
          <Text style={isCreatingAccount ? styles.activeText : styles.inactiveText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsCreatingAccount(false);
            setMessage('');
          }}
          style={[styles.toggleButton, !isCreatingAccount && styles.activeButton]}
        >
          <Text style={!isCreatingAccount ? styles.activeText : styles.inactiveText}>Login</Text>
        </TouchableOpacity>
      </View>

      {isCreatingAccount ? (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Facility Name"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={facilityName}
            onChangeText={setFacilityName}
          />
          <TextInput
            placeholder="Facility Email"
            placeholderTextColor="#ccc"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Create Account" onPress={handleCreateAccount} />
        </View>
      ) : (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Facility Email"
            placeholderTextColor="#ccc"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      )}

      {message !== '' && (
        <Text style={[styles.message, messageType === 'error' ? styles.errorText : styles.successText]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 100,
    backgroundColor: '#33ab93',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
    color: 'white',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#245b4f',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#ccc',
  },
  formContainer: {
    gap: 12,
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#5c7872',
    color: '#fff',
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#ff4d4d',
  },
  successText: {
    color: '#00cc88',
  },
});
