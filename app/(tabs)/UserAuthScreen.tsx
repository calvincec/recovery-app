import { useState } from 'react'; 
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function UserAuthScreen() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
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
      throw error;
    }
  };

  const handleCreateAccount = async () => {
    if (!name || !email || !password) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    const newUser = { name, email, password };

    const storedData = await AsyncStorage.getItem('userData');
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

    try {
      await saveUserData(newUser);
      setMessage('Account created successfully!');
      setMessageType('success');
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      router.replace('/HomeScreen');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during account creation');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) {
        setMessage('No account found. Please create an account first.');
        setMessageType('error');
        return;
      }

      const arrvalues = JSON.parse(storedData);
      for (let i = 0; i < arrvalues.length; i++) {
        if (arrvalues[i].email === email && arrvalues[i].password === password) {
          setMessage('Logged in successfully!');
          setMessageType('success');
          await AsyncStorage.setItem('currentUser', JSON.stringify(arrvalues[i]));
          router.replace('/HomeScreen');
          return;
        }
        if (i === arrvalues.length - 1) {
          setMessage('Incorrect email or password. Please try again.');
          setMessageType('error');
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
        <TouchableOpacity
          onPress={() => setIsCreatingAccount(true)}
          style={[styles.toggleButton, isCreatingAccount && styles.activeButton]}>
          <Text style={isCreatingAccount ? styles.activeText : styles.inactiveText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsCreatingAccount(false)}
          style={[styles.toggleButton, !isCreatingAccount && styles.activeButton]}>
          <Text style={!isCreatingAccount ? styles.activeText : styles.inactiveText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        {isCreatingAccount && (
          <TextInput
            placeholder="Name"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          placeholder="Email"
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
        <Button
          title={isCreatingAccount ? 'Create Account' : 'Login'}
          onPress={isCreatingAccount ? handleCreateAccount : handleLogin}
          color="#ffffff"
        />
      </View>

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
    backgroundColor: '#440961',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
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
    backgroundColor: '#6f2da8',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#bbb',
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
    color: 'white',
    backgroundColor: '#5a2d91',
    marginBottom: 10,
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
    color: '#00ff99',
  },
});
