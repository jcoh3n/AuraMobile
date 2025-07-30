import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SurveyQuestion } from '../types/survey';

interface TextInputQuestionProps {
  question: SurveyQuestion;
  onAnswer: (value: string) => void;
  initialValue?: string;
}

const TextInputQuestion: React.FC<TextInputQuestionProps> = ({
  question,
  onAnswer,
  initialValue = ''
}) => {
  const [text, setText] = useState(initialValue);

  const handleSubmit = () => {
    if (text.trim()) {
      onAnswer(text.trim());
    }
  };

  const getPlaceholder = () => {
    switch (question.type) {
      case 'commune':
        return 'Nom de la commune';
      case 'street':
        return 'Nom de la rue';
      case 'gare':
        return 'Gare de destination';
      default:
        return 'Votre réponse';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder={getPlaceholder()}
          placeholderTextColor="#8a9bb8"
          multiline={question.type === 'text'}
          numberOfLines={question.type === 'text' ? 4 : 1}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            !text.trim() && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={!text.trim()}
        >
          <Text style={[
            styles.submitButtonText,
            !text.trim() && styles.disabledButtonText
          ]}>
            Valider
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2a3b63',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    marginTop: 20,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default TextInputQuestion; 