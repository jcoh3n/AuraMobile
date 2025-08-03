import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SurveyQuestion } from '../types/survey';
import garesData from '../data/gare.json';

interface StationQuestionProps {
  question: SurveyQuestion;
  onAnswer: (value: string) => void;
  initialValue?: string;
}

interface Station {
  id: string;
  name: string;
  codeUIC?: number;
}

// Conversion des données de gare.json vers notre format
const STATIONS_DATA: Station[] = garesData.map((gare, index) => ({
  id: index.toString(),
  name: gare["Nom Gare"],
  codeUIC: gare["Code UIC"]
}));

const StationQuestion: React.FC<StationQuestionProps> = ({
  question,
  onAnswer,
  initialValue = ''
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedStation, setSelectedStation] = useState(initialValue);
  const [filteredStations, setFilteredStations] = useState<Station[]>(STATIONS_DATA);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredStations(STATIONS_DATA);
    } else {
      const filtered = STATIONS_DATA.filter(station =>
        station.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredStations(filtered);
    }
  }, [searchText]);

  const handleSelectStation = (station: Station) => {
    setSelectedStation(station.name);
    onAnswer(station.name);
  };

  const handleCustomInput = () => {
    if (searchText.trim() && !STATIONS_DATA.find(s => s.name.toLowerCase() === searchText.toLowerCase())) {
      setSelectedStation(searchText.trim());
      onAnswer(searchText.trim());
    }
  };

  const renderStationItem = ({ item }: { item: Station }) => (
    <TouchableOpacity
      style={[
        styles.stationItem,
        selectedStation === item.name && styles.selectedStation
      ]}
      onPress={() => handleSelectStation(item)}
    >
      <View style={styles.stationContent}>
        <Text style={styles.stationIcon}>🚉</Text>
        <View style={styles.stationInfo}>
          <Text style={[
            styles.stationName,
            selectedStation === item.name && styles.selectedStationText
          ]}>
            {item.name}
          </Text>
          {item.codeUIC && (
            <Text style={styles.stationLine}>Code UIC: {item.codeUIC}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Rechercher une station ou tapez le nom..."
          placeholderTextColor="#8a9bb8"
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleCustomInput}
        />
      </View>

      {selectedStation !== '' && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedLabel}>Station sélectionnée :</Text>
          <Text style={styles.selectedValue}>{selectedStation}</Text>
        </View>
      )}

      <FlatList
        data={filteredStations}
        renderItem={renderStationItem}
        keyExtractor={(item) => item.id}
        style={styles.stationList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune station trouvée</Text>
            {searchText.trim() !== '' && (
              <TouchableOpacity
                style={styles.customButton}
                onPress={handleCustomInput}
              >
                <Text style={styles.customButtonText}>
                  Utiliser "{searchText.trim()}"
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedLabel: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  selectedValue: {
    fontSize: 16,
    color: '#1565c0',
    fontWeight: '600',
    marginTop: 4,
  },
  stationList: {
    flex: 1,
  },
  stationItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedStation: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  stationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  selectedStationText: {
    color: '#1976d2',
  },
  stationLine: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  customButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StationQuestion;