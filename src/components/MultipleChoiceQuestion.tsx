import React, { useState, useEffect } from 'react';
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

  // Reset state when question changes or selectedValues prop changes
  useEffect(() => {
    setSelectedOptions(selectedValues);
  }, [selectedValues, question.id]);

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
    <View style={styles.wrapper}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#2a3b63',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#3d4f73',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#3d4f73',
  },
  selectedOption: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
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
    borderColor: '#8a9bb8',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a3b63',
  },
  checkedBox: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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

export default MultipleChoiceQuestion;