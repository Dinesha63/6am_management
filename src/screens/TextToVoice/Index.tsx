import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Tts from 'react-native-tts';

const TTSScreen: React.FC = () => {
  const [text, setText] = useState<string>('Hello, this is a TTS test.');

  useEffect(() => {
    Tts.setDefaultLanguage('en-US'); // Set default language
    Tts.setDefaultRate(0.5); // Set default speech rate
  }, []);

const speakText = () => {
  if (Tts) {
    Tts.stop();
    Tts.speak(text);
  } else {
    console.error('Tts is not initialized');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter text to speak:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type something..."
      />
      <Button title="Speak" onPress={speakText} />
    </View>
  );
};

export default TTSScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
});