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
import communeData from '../data/output.json';

interface CommuneQuestionProps {
  question: SurveyQuestion;
  onAnswer: (answer: string) => void;
  initialValue?: string;
}

interface Commune {
  COMMUNE: string;
  "CODE POSTAL": number;
  DEPARTEMENT: string;
  "CODE INSEE": string;
  Latitud: number;
  Longitud: number;
  "CODE INSEE.1": number;
}

const CommuneQuestion: React.FC<CommuneQuestionProps> = ({
  question,
  onAnswer,
  initialValue = ''
}) => {
  const [postalCodeInput, setPostalCodeInput] = useState('');
  const [communeInput, setCommuneInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCommune, setSelectedCommune] = useState<string | null>(
    initialValue || null
  );

  // Cast the imported JSON to the correct type
  const allCommunes = communeData as Commune[];

  // Initialize inputs from initialValue if provided
  useEffect(() => {
    if (initialValue && typeof initialValue === 'string') {
      const parts = initialValue.split(' - ');
      setCommuneInput(parts[0] || '');
      if (parts.length > 1) {
        const matchedCommune = allCommunes.find(c => c['CODE INSEE'] === parts[1]);
        if (matchedCommune && matchedCommune['CODE POSTAL']) {
          setPostalCodeInput(matchedCommune['CODE POSTAL'].toString());
        }
      }
    }
  }, [initialValue, allCommunes]);

  // Filter communes based on both inputs
  const filteredCommunes = useMemo(() => {
    if ((postalCodeInput.length < 2 && communeInput.length < 2) || !allCommunes.length) {
      return [];
    }

    return allCommunes
      .filter(item => {
        if (!item) return false;

        const commune = item.COMMUNE ? item.COMMUNE.toLowerCase() : '';
        const postalCode = item['CODE POSTAL'] ? item['CODE POSTAL'].toString() : '';

        const postalCodeMatch = postalCode.startsWith(postalCodeInput);
        const communeMatch = commune.includes(communeInput.toLowerCase());

        return postalCodeMatch && communeMatch;
      })
      .slice(0, 100); // Limit results to 100
  }, [postalCodeInput, communeInput, allCommunes]);

  // Update dropdown visibility based on filtered results
  useEffect(() => {
    setShowDropdown(filteredCommunes.length > 0);
  }, [filteredCommunes]);

  const handlePostalCodeChange = (text: string) => {
    setPostalCodeInput(text);
    // Clear selection if user modifies the input
    if (selectedCommune) {
      setSelectedCommune(null);
    }
  };

  const handleCommuneChange = (text: string) => {
    setCommuneInput(text);
    // Clear selection if user modifies the input
    if (selectedCommune) {
      setSelectedCommune(null);
    }
  };

  const selectCommune = (item: Commune) => {
    if (item && item.COMMUNE && item['CODE INSEE']) {
      setCommuneInput(item.COMMUNE);
      setPostalCodeInput(item['CODE POSTAL'] ? item['CODE POSTAL'].toString() : '');
      
      const selectedValue = `${item.COMMUNE} - ${item['CODE INSEE']}`;
      setSelectedCommune(selectedValue);
      setShowDropdown(false);
      onAnswer(selectedValue);
    }
  };

  const handleSubmit = () => {
    if (selectedCommune) {
      onAnswer(selectedCommune);
    } else if (communeInput.trim()) {
      // If no selection but user typed something, use the commune input
      onAnswer(communeInput.trim());
    }
  };

  const renderCommuneItem = ({ item }: { item: Commune }) => (
    <TouchableOpacity
      style={styles.communeOption}
      onPress={() => selectCommune(item)}
    >
      <Text style={styles.communeOptionText}>
        {item.COMMUNE} ({item['CODE POSTAL']})
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.questionText}>{question.text}</Text>
        
        <View style={styles.inputContainer}>
          {/* Postal Code Input */}
          <TextInput
            style={styles.textInput}
            value={postalCodeInput}
            onChangeText={handlePostalCodeChange}
            placeholder="Code postal (ex: 92, 54)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Commune Name Input */}
          <TextInput
            style={styles.textInput}
            value={communeInput}
            onChangeText={handleCommuneChange}
            placeholder="Nom de la commune"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
          />

          {/* Dropdown with filtered results */}
          {showDropdown && filteredCommunes.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredCommunes}
                keyExtractor={(item, index) => `${item['CODE INSEE']}-${index}`}
                renderItem={renderCommuneItem}
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
            (!selectedCommune && !communeInput.trim()) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedCommune && !communeInput.trim()}
        >
          <Text style={[
            styles.submitButtonText,
            (!selectedCommune && !communeInput.trim()) && styles.submitButtonTextDisabled
          ]}>
            Continuer
          </Text>
        </TouchableOpacity>

        {/* Helper text */}
        <Text style={styles.helperText}>
          {filteredCommunes.length > 0 && showDropdown
            ? `${filteredCommunes.length} commune${filteredCommunes.length > 1 ? 's' : ''} trouvée${filteredCommunes.length > 1 ? 's' : ''}`
            : (postalCodeInput.length > 0 || communeInput.length > 0) && 
              (postalCodeInput.length < 2 && communeInput.length < 2)
            ? 'Tapez au moins 2 caractères dans un des champs pour rechercher'
            : (postalCodeInput.length >= 2 || communeInput.length >= 2) && filteredCommunes.length === 0
            ? 'Aucune commune trouvée'
            : 'Saisissez le code postal et/ou le nom de la commune'
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
    marginBottom: 10,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#333',
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: 'white',
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
  communeOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  communeOptionText: {
    fontSize: 16,
    color: 'white',
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

export default CommuneQuestion;