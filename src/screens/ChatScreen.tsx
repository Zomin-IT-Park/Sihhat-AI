import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';

type Message = { id: string; text: string; isBot: boolean };

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'Salom! Men Sihhat-AI yordamchingizman. Sizga qanday yordam bera olaman?', isBot: true },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  function sendMessage() {
    if (!inputText.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: inputText.trim(), isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI dan maslahat</Text>
      </View>

      <FlatList<Message>
        style={styles.messagesList}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.isBot ? styles.botMessage : styles.userMessage]}>
            <Text style={[styles.messageText, item.isBot ? styles.botText : styles.userText]}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Xabar yozing..."
          placeholderTextColor="#8E8E93"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} activeOpacity={0.8}>
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', textAlign: 'center' },
  messagesList: { flex: 1, padding: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
  botMessage: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  userMessage: { backgroundColor: '#007AFF', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  messageText: { fontSize: 16, lineHeight: 22 },
  botText: { color: '#1C1C1E' },
  userText: { color: '#FFFFFF' },
  inputContainer: {
    flexDirection: 'row', padding: 12,
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5EA',
    alignItems: 'center', gap: 8,
  },
  input: {
    flex: 1, height: 44, backgroundColor: '#F2F2F7',
    borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#1C1C1E',
  },
  sendButton: {
    width: 44, height: 44, backgroundColor: '#007AFF',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
});
