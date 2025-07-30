import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SurveyQuestion, SurveyOption } from '../types/survey';

interface SingleChoiceQuestionProps {
  question: SurveyQuestion;
  onAnswer: (optionId: number) => void;
  selectedValue?: number;
}

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  question,
  onAnswer,
  selectedValue
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      <View style={styles.optionsContainer}>
        {question.options?.map((option: SurveyOption) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedValue === option.id && styles.selectedOption
            ]}
            onPress={() => onAnswer(option.id)}
          >
            <Text style={[
              styles.optionText,
              selectedValue === option.id && styles.selectedOptionText
            ]}>
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2a3b63',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#3d4f73',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3d4f73',
  },
  selectedOption: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
});

export default SingleChoiceQuestion; 