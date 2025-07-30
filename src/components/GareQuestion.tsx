import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { SurveyQuestion } from '../types/survey';
import gareData from '../data/gare.json';

interface GareQuestionProps {
  question: SurveyQuestion;
  onAnswer: (answer: string) => void;
  initialValue?: string;
}

interface Gare {
  "Code UIC": number;
  "Nom Gare": string;
}

const GareQuestion: React.FC<GareQuestionProps> = ({
  question,
  onAnswer,
  initialValue = ''
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGare, setSelectedGare] = useState<string | null>(
    initialValue || null
  );

  // Cast the imported JSON to the correct type
  const allGares = gareData as Gare[];

  // Filter gares based on input
  const filteredGares = useMemo(() => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    const searchTerm = inputValue.toLowerCase();
    return allGares
      .filter(gare => {
        const name = gare["Nom Gare"];
        return name && name.toLowerCase().includes(searchTerm);
      })
      .slice(0, 100); // Limit results to 100
  }, [inputValue, allGares]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setShowDropdown(text.length >= 2);
    // Clear selection if user modifies the input
    if (text !== selectedGare) {
      setSelectedGare(null);
    }
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 2) {
      setShowDropdown(true);
    }
  };

  const selectGare = (gare: Gare) => {
    const gareName = gare["Nom Gare"];
    setInputValue(gareName);
    setSelectedGare(gareName);
    setShowDropdown(false);
    onAnswer(gareName);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAnswer(inputValue.trim());
    }
  };

  const renderGareItem = ({ item }: { item: Gare }) => (
    <TouchableOpacity
      style={styles.gareOption}
      onPress={() => selectGare(item)}
    >
      <Text style={styles.gareOptionText}>{item["Nom Gare"]}</Text>
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
            placeholder="Saisir ou rechercher une gare (train)"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
          />

          {/* Dropdown with filtered results */}
          {showDropdown && filteredGares.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredGares}
                keyExtractor={(item, index) => `${item["Code UIC"]}-${index}`}
                renderItem={renderGareItem}
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
          {filteredGares.length > 0 && showDropdown
            ? `${filteredGares.length} gare${filteredGares.length > 1 ? 's' : ''} trouvée${filteredGares.length > 1 ? 's' : ''}`
            : inputValue.length > 0 && inputValue.length < 2
            ? 'Tapez au moins 2 caractères pour rechercher'
            : inputValue.length >= 2 && filteredGares.length === 0
            ? 'Aucune gare trouvée'
            : 'Commencez à taper le nom d\'une gare'
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
  gareOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  gareOptionText: {
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

export default GareQuestion;