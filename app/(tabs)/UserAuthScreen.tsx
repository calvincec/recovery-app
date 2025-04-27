import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function UserAuthScreen() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(true);

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
          <TextInput placeholder="Name" style={styles.input} />
          <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry />
          <Button title="Create Account" onPress={() => alert('Account created!')} />
        </View>
      ) : (
        <View style={styles.formContainer}>
          <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry />
          <Button title="Login" onPress={() => alert('Logged in!')} />
        </View>
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
});
