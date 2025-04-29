import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function UserAuthScreen() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');  // <-- New state for feedback message
  const [messageType, setMessageType] = useState(''); 

  const router = useRouter();

  const saveUserData = async (newUser) => {
	try {
	  const existingData = await AsyncStorage.getItem('userData');
	  let updatedData = [];
  
	  if (existingData !== null) {
		updatedData = JSON.parse(existingData);
		if (!Array.isArray(updatedData)) {
		  updatedData = [updatedData];
		}
	  }
  
	  updatedData.push(newUser);
	  await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
	} catch (error) {
	  console.error('Error saving user data:', error);
	  throw error; // rethrow so handleCreateAccount can catch it
	}
  };
  
  // Function to handle account creation
  const handleCreateAccount = async () => {
	if (!name || !email || !password) {
		setMessage('Please fill in all fields.');
    	setMessageType('error');
	  	// Alert.alert('Error', 'Please fill all fields');
	  	return;
	}
  
	const newUser = { name, email, password };
  
	try {
	  await saveUserData(newUser);
	  setMessage('Account created successfully!');
	  setMessageType('success');
	//   Alert.alert('Success', 'Account created successfully!');
	  router.replace('/HomeScreen');
	} catch (error) {
	  Alert.alert('Error', 'Something went wrong during account creation');
	}
  };


  const handleLogin = async () => {
    if (!email || !password) {
		setMessage('Please fill in all fields.');
    	setMessageType('error');
    //   Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) {
		setMessage('No account found. Please create an account first.');
    	setMessageType('error');
        // Alert.alert('Error', 'No account found. Please create an account first.');
        return;
      }
  
	  const strvalues = storedData;
	  const arrvalues = JSON.parse(strvalues);
      const { email: storedEmail, password: storedPassword } = arrvalues;

	  
	  for (let i = 0; i < arrvalues.length; i++) {
		if (arrvalues[i].email === email && arrvalues[i].password === password) {
			setMessage('Logged in successfully!');
			setMessageType('success');

			// Alert.alert('Success', 'Logged in successfully!');
			router.replace('/HomeScreen');
			return;
		}
		if(i === arrvalues.length - 1) {
			setMessage('Incorrect email or password. Please try again.');
			setMessageType('error');
			
			
			// Alert.alert('Incorrect Login', 'Incorrect email or password. Please try again.');
		}
	  }
	  
  

    } catch (error) {
      console.log("Error:", error);
      Alert.alert('Error', 'Something went wrong during login');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isCreatingAccount ? 'Create Account' : 'Login'}</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setIsCreatingAccount(true)} style={[styles.toggleButton, isCreatingAccount && styles.activeButton]}>
          <Text style={isCreatingAccount ? styles.activeText : styles.inactiveText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsCreatingAccount(false)} style={[styles.toggleButton, !isCreatingAccount && styles.activeButton]}>
          <Text style={!isCreatingAccount ? styles.activeText : styles.inactiveText}>Login</Text>
        </TouchableOpacity>
      </View>

      {isCreatingAccount ? (
        <View style={styles.formContainer}>
          <TextInput 
            placeholder="Name" 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
          />
          <TextInput 
            placeholder="Email" 
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
            placeholder="Email" 
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
