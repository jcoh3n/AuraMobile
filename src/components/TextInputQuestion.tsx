import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SurveyQuestion } from '../types/survey';

interface TextInputQuestionProps {
  question: SurveyQuestion;
  onAnswer: (value: string | number) => void;
  initialValue?: string;
}

const TextInputQuestion: React.FC<TextInputQuestionProps> = ({
  question,
  onAnswer,
  initialValue = ''
}) => {
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState<string>('');

  const validateInput = (value: string): { isValid: boolean; error: string; processedValue: string | number } => {
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      return { isValid: false, error: 'Ce champ est requis', processedValue: trimmedValue };
    }

    // Validation numérique
    if (question.validation === 'numeric' || question.type === 'number') {
      const numericValue = parseFloat(trimmedValue);
      if (isNaN(numericValue)) {
        return { isValid: false, error: 'Veuillez entrer un nombre valide', processedValue: trimmedValue };
      }
      return { isValid: true, error: '', processedValue: numericValue };
    }

    // Validation email
    if (question.validation === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedValue)) {
        return { isValid: false, error: 'Veuillez entrer une adresse email valide', processedValue: trimmedValue };
      }
      return { isValid: true, error: '', processedValue: trimmedValue };
    }

    return { isValid: true, error: '', processedValue: trimmedValue };
  };

  const handleSubmit = () => {
    const validation = validateInput(text);
    
    if (validation.isValid) {
      setError('');
      onAnswer(validation.processedValue);
    } else {
      setError(validation.error);
      Alert.alert('Erreur de validation', validation.error);
    }
  };

  const handleTextChange = (value: string) => {
    setText(value);
    if (error) {
      setError(''); // Effacer l'erreur lors de la modification
    }
  };

  const getPlaceholder = () => {
    // Utiliser le placeholder personnalisé s'il existe
    if (question.freeTextPlaceholder) {
      return question.freeTextPlaceholder;
    }

    // Fallback sur les placeholders par défaut
    switch (question.type) {
      case 'commune':
        return 'Nom de la commune';
      case 'street':
        return 'Nom de la rue';
      case 'gare':
        return 'Gare de destination';
      case 'number':
        return 'Entrez un nombre';
      case 'freeText':
        return 'Votre réponse...';
      default:
        return 'Votre réponse';
    }
  };

  const getKeyboardType = () => {
    if (question.type === 'number' || question.validation === 'numeric') {
      return 'numeric';
    }
    if (question.validation === 'email') {
      return 'email-address';
    }
    return 'default';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, error && styles.errorInput]}
          value={text}
          onChangeText={handleTextChange}
          placeholder={getPlaceholder()}
          placeholderTextColor="#8a9bb8"
          multiline={question.type === 'text' || question.type === 'freeText'}
          numberOfLines={question.type === 'text' || question.type === 'freeText' ? 4 : 1}
          autoCapitalize={question.validation === 'email' ? 'none' : 'sentences'}
          keyboardType={getKeyboardType()}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        
        {error !== '' && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
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
  errorInput: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default TextInputQuestion; 