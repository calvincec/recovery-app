import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ✅ [1] Import Ionicons

const backgroundImage = require('../auths/login.png'); // Adjust path if needed

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
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>

        {/* ✅ [2] Back Icon */}
        <View style={styles.backIconContainer}>
          <TouchableOpacity onPress={() => router.replace('/LoginScreen')}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
        </View>

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
              placeholderTextColor="#999"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          )}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title={isCreatingAccount ? 'Create Account' : 'Login'}
            onPress={isCreatingAccount ? handleCreateAccount : handleLogin}
            color="#344d3f"
          />
        </View>

        {message !== '' && (
          <Text style={[styles.message, messageType === 'error' ? styles.errorText : styles.successText]}>
            {message}
          </Text>
        )}
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
  },
  backIconContainer: { // ✅ [3] Style for back icon positioning
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#35328a',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: 'black',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 12,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4d4d',
  },
  successText: {
    color: '#00cc88',
  },
});
