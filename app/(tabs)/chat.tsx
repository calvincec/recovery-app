import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import apikey from '@/env';
import { Ionicons } from '@expo/vector-icons';

const sendMessageToBot = async (input: string) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: input }],
      },
      {
        headers: {
          'Authorization': `Bearer ${apikey()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.choices[0].message.content;
    return botReply;

  } catch (error) {
    console.error('Chatbot error:', error);
    return "Sorry, I'm having trouble answering that right now. Please try again later.";
  }
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' | 'typing' }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Immediately add user message and typing indicator
    setMessages(prev => [
      ...prev,
      { text: input, sender: 'user' },
      { text: 'Typing...', sender: 'typing' }
    ]);
    setInput('');

    // Get bot reply
    const botReply = await sendMessageToBot(input);

    // Replace typing indicator with actual bot reply
    setMessages(prev => {
      const updatedMessages = [...prev];
      updatedMessages.pop(); // Remove 'Typing...' message
      return [...updatedMessages, { text: botReply, sender: 'bot' }];
    });
  };

  const renderItem = ({ item }: { item: { text: string; sender: 'user' | 'bot' | 'typing' } }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : item.sender === 'bot' ? styles.botBubble : styles.typingBubble]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const router = useRouter();

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header with Back Button */}
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
            <Ionicons name="arrow-back" size={30} color="red" />
          </TouchableOpacity>

          <ThemedView style={styles.headerTitle}>
            <ThemedText type="title">ChatBot</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.messagesContainer}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#344d3f',
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#E2E2E2',
    alignSelf: 'flex-start',
  },
  typingBubble: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    opacity: 0.6,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 45,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
});
