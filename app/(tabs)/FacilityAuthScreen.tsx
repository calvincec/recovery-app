import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FacilityAuthScreen() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(true);
  const [facilityName, setFacilityName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');  // <-- New state for feedback message
  const [messageType, setMessageType] = useState(''); // success or error
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
	  throw error; // rethrow so handleCreateAccount can catch it
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

	let facilityDetails = '';

    const facilityData = { facilityName, email, password, facilityDetails};

    try {
      await saveFacilityData(facilityData);
      setMessage('Facility account created successfully!');
      setMessageType('success');

	  await AsyncStorage.setItem('currentFacility', JSON.stringify(facilityData)); // Save facility data to AsyncStorage
      router.replace('/EnterFacilityDetails');
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

	  const strvalues = storedData;
	  const arrvalues = JSON.parse(strvalues);

	  for (let i = 0; i < arrvalues.length; i++) {
		if (arrvalues[i].email === email) {
			if (arrvalues[i].password === password) {
				setMessage('Logged in successfully!');
				setMessageType('success');
				//save the current user on local storage
				await AsyncStorage.setItem('currentFacility', JSON.stringify(arrvalues[i]));
				router.replace('/FacilityDetail');
				return;
			}
		}
		if (i === arrvalues.length - 1) {
			setMessage('Email or password is wrong. Please try again.');
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
      <Text style={styles.title}>{isCreatingAccount ? 'Create Facility Account' : 'Facility Login'}</Text>

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
            style={styles.input}
            value={facilityName}
            onChangeText={setFacilityName}
          />
          <TextInput
            placeholder="Facility Email"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
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
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      )}

      {/* Display feedback message */}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
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
    backgroundColor: '#007bff',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#007bff',
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
  },
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
