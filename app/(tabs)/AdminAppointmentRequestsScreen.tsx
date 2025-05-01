import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminAppointmentRequestsScreen() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const stored = await AsyncStorage.getItem('appointmentRequests');
        if (stored) {
          setRequests(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to fetch appointment requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const markAsCompleted = async (id: number) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: 'Completed' } : req
    );
    setRequests(updated);
    await AsyncStorage.setItem('appointmentRequests', JSON.stringify(updated));
  };

  const deleteRequest = async (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this request?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const filtered = requests.filter((req) => req.id !== id);
          setRequests(filtered);
          await AsyncStorage.setItem('appointmentRequests', JSON.stringify(filtered));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.facility}>{item.facility}</Text>
      <Text style={styles.info}>Requested at: {new Date(item.timestamp).toLocaleString()}</Text>
      <Text style={styles.status}>
        Status: <Text style={{ color: item.status === 'Pending' ? '#e67e22' : '#27ae60' }}>{item.status}</Text>
      </Text>

      <View style={styles.buttonRow}>
        {item.status === 'Pending' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2ecc71' }]}
            onPress={() => markAsCompleted(item.id)}
          >
            <Text style={styles.buttonText}>Mark as Completed</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#e74c3c' }]}
          onPress={() => deleteRequest(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Requests</Text>
      {requests.length === 0 ? (
        <Text style={styles.noData}>No appointment requests found.</Text>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
      padding: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#344d3f',
      textAlign: 'center',
      marginBottom: 20,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    facility: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 6,
      color: '#333',
    },
    info: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    status: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 10,
    },
    noData: {
      textAlign: 'center',
      marginTop: 100,
      fontSize: 16,
      color: '#999',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    button: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 6,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  