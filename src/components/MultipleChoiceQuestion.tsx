import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SurveyQuestion } from '../types/survey';

interface MultipleChoiceQuestionProps {
  question: SurveyQuestion;
  onAnswer: (value: number[], selectedOptions?: any[]) => void;
  selectedValues?: number[];
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswer,
  selectedValues = []
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>(selectedValues);

  const handleToggleOption = (optionId: number) => {
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    
    setSelectedOptions(newSelection);
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0) {
      // Récupérer les options sélectionnées pour next_if_selected
      const selectedOptionsData = question.options?.filter(opt => 
        selectedOptions.includes(opt.id)
      );
      
      onAnswer(selectedOptions, selectedOptionsData);
    }
  };

  const isSelected = (optionId: number) => selectedOptions.includes(optionId);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.questionText}>{question.text}</Text>
      
      <View style={styles.optionsContainer}>
        {question.options?.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              isSelected(option.id) && styles.selectedOption
            ]}
            onPress={() => handleToggleOption(option.id)}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.checkbox,
                isSelected(option.id) && styles.checkedBox
              ]}>
                {isSelected(option.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={[
                styles.optionText,
                isSelected(option.id) && styles.selectedOptionText
              ]}>
                {option.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedOptions.length === 0 && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={selectedOptions.length === 0}
      >
        <Text style={[
          styles.submitButtonText,
          selectedOptions.length === 0 && styles.disabledButtonText
        ]}>
          Valider ({selectedOptions.length} sélectionné{selectedOptions.length > 1 ? 's' : ''})
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkedBox: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#7f8c8d',
  },
});

export default MultipleChoiceQuestion;