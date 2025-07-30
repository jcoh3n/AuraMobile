import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { getAllResponses, SurveyResponse } from '../config/firebaseConfig';
import { surveyQuestions } from '../data/surveyQuestions';

interface AdminDashboardProps {
  onClose?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  // Charger les réponses
  const loadResponses = async () => {
    setLoading(true);
    try {
      const data = await getAllResponses();
      setResponses(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les réponses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResponses();
  }, []);

  // Trouver le texte d'une question par son ID
  const getQuestionText = (questionId: string): string => {
    const question = surveyQuestions.find(q => q.id === questionId);
    return question?.text || questionId;
  };

  // Trouver le texte d'une option pour une question à choix multiple
  const getOptionText = (questionId: string, optionId: number): string => {
    const question = surveyQuestions.find(q => q.id === questionId);
    if (question?.options) {
      const option = question.options.find(opt => opt.id === optionId);
      return option?.text || `Option ${optionId}`;
    }
    return `${optionId}`;
  };

  // Formater une réponse pour l'affichage
  const formatAnswer = (questionId: string, answer: any): string => {
    const question = surveyQuestions.find(q => q.id === questionId);
    
    if (question?.type === 'singleChoice' && typeof answer === 'number') {
      return getOptionText(questionId, answer);
    }
    
    return String(answer);
  };

  // Afficher les détails d'une réponse
  const renderResponseDetails = () => {
    if (!selectedResponse) return null;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Détails de la réponse</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedResponse(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.responseDate}>
          Date: {selectedResponse.timestamp?.toDate?.()?.toLocaleString() || 'Date inconnue'}
        </Text>

        <FlatList
          data={Object.entries(selectedResponse.responses)}
          keyExtractor={([questionId]) => questionId}
          renderItem={({ item: [questionId, answer] }) => (
            <View style={styles.responseItem}>
              <Text style={styles.questionTitle}>
                {getQuestionText(questionId)}
              </Text>
              <Text style={styles.answerText}>
                {formatAnswer(questionId, answer)}
              </Text>
            </View>
          )}
        />
      </View>
    );
  };

  // Afficher la liste des réponses
  const renderResponsesList = () => (
    <View style={styles.listContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Réponses du sondage</Text>
        <Text style={styles.subtitle}>({responses.length} réponses)</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.refreshButton} onPress={loadResponses}>
          <Text style={styles.refreshButtonText}>Actualiser</Text>
        </TouchableOpacity>
        
        {onClose && (
          <TouchableOpacity style={styles.closeMainButton} onPress={onClose}>
            <Text style={styles.closeMainButtonText}>Fermer</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={responses}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.responseCard}
              onPress={() => setSelectedResponse(item)}
            >
              <Text style={styles.responseCardTitle}>
                Réponse #{index + 1}
              </Text>
              <Text style={styles.responseCardDate}>
                {item.timestamp?.toDate?.()?.toLocaleDateString() || 'Date inconnue'}
              </Text>
              <Text style={styles.responseCardPreview}>
                {Object.keys(item.responses).length} questions répondues
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucune réponse disponible</Text>
          }
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedResponse ? renderResponseDetails() : renderResponsesList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a3b63',
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8a9bb8',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeMainButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeMainButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  responseCard: {
    backgroundColor: '#3d4f73',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  responseCardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  responseCardDate: {
    color: '#8a9bb8',
    fontSize: 14,
    marginBottom: 4,
  },
  responseCardPreview: {
    color: '#8a9bb8',
    fontSize: 14,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    backgroundColor: '#666',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  responseDate: {
    color: '#8a9bb8',
    fontSize: 14,
    marginBottom: 20,
  },
  responseItem: {
    backgroundColor: '#3d4f73',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  questionTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answerText: {
    color: '#8a9bb8',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AdminDashboard; 