import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
} from 'react-native';
import { SurveyQuestion } from '../types/survey';
import streetsData from '../data/streets.json';

interface StreetQuestionProps {
  question: SurveyQuestion;
  onAnswer: (answer: string) => void;
  initialValue?: string;
}

const StreetQuestion: React.FC<StreetQuestionProps> = ({
  question,
  onAnswer,
  initialValue = ''
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStreet, setSelectedStreet] = useState<string | null>(
    initialValue || null
  );

  // Cast the imported JSON to string array
  const allStreets = streetsData as string[];

  // Filter streets based on input
  const filteredStreets = useMemo(() => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    const searchTerm = inputValue.toLowerCase();
    return allStreets
      .filter(street => {
        return street && street.toLowerCase().includes(searchTerm);
      })
      .slice(0, 10); // Limit results to 10 for better performance
  }, [inputValue, allStreets]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setShowDropdown(text.length >= 2);
    // Clear selection if user modifies the input
    if (text !== selectedStreet) {
      setSelectedStreet(null);
    }
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 2) {
      setShowDropdown(true);
    }
  };

  const selectStreet = (street: string) => {
    setInputValue(street);
    setSelectedStreet(street);
    setShowDropdown(false);
    onAnswer(street);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAnswer(inputValue.trim());
    }
  };

  const renderStreetItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.streetOption}
      onPress={() => selectStreet(item)}
    >
      <Text style={styles.streetOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.questionText}>{question.text}</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputValue}
            onChangeText={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Saisir ou rechercher une rue"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
          />

          {/* Dropdown with filtered results */}
          {showDropdown && filteredStreets.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredStreets}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={renderStreetItem}
                style={styles.dropdownList}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !inputValue.trim() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!inputValue.trim()}
        >
          <Text style={[
            styles.submitButtonText,
            !inputValue.trim() && styles.submitButtonTextDisabled
          ]}>
            Continuer
          </Text>
        </TouchableOpacity>

        {/* Helper text */}
        <Text style={styles.helperText}>
          {filteredStreets.length > 0 && showDropdown
            ? `${filteredStreets.length} rue${filteredStreets.length > 1 ? 's' : ''} trouvée${filteredStreets.length > 1 ? 's' : ''}`
            : inputValue.length > 0 && inputValue.length < 2
            ? 'Tapez au moins 2 caractères pour rechercher'
            : inputValue.length >= 2 && filteredStreets.length === 0
            ? 'Aucune rue trouvée'
            : 'Commencez à taper le nom d\'une rue'
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    lineHeight: 26,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#3d4f73',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#5a6b8a',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownList: {
    maxHeight: 200,
  },
  streetOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  streetOptionText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#5a6b8a',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonTextDisabled: {
    color: '#aaa',
  },
  helperText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default StreetQuestion;