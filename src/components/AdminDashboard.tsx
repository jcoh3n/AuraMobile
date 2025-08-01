import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { getAllResponses, SurveyResponse, FIREBASE_COLLECTION } from '../config/firebaseConfig';
import { surveyQuestions } from '../data/surveyQuestions';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

interface AdminDashboardProps {
  onClose?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [surveysByEnqueteur, setSurveysByEnqueteur] = useState<{[key: string]: number}>({});

  // Charger les réponses
  const loadResponses = async () => {
    setLoading(true);
    try {
      const data = await getAllResponses();
      setResponses(data);
      
      // Grouper les sondages par enquêteur (équivalent Vue.js)
      const surveysByEnqueteurMap = data.reduce((acc: {[key: string]: number}, survey) => {
        const enqueteurName = survey.ENQUETEUR || 'Inconnu';
        acc[enqueteurName] = (acc[enqueteurName] || 0) + 1;
        return acc;
      }, {});
      setSurveysByEnqueteur(surveysByEnqueteurMap);
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

  // Download Excel data function - exact replica from Vue.js admin.vue
  const downloadData = async () => {
    try {
      const rawData = responses.map((response: SurveyResponse) => {
        const flattenedData: any = {
          ...response.responses,
          firestore_id: response.id,
          ID_questionnaire: response.ID_questionnaire,
          firebase_timestamp: response.firebase_timestamp,
          HEURE_DEBUT: response.HEURE_DEBUT,
          DATE: response.DATE,
          JOUR: response.JOUR,
          HEURE_FIN: response.HEURE_FIN,
          ENQUETEUR: response.ENQUETEUR
        };
        return flattenedData;
      });

      console.log("Raw survey data from Firestore:", rawData);

      // Define core headers that should appear first and in this order
      const coreHeaders = [
        "ID_questionnaire",
        "ENQUETEUR",
        "DATE",
        "JOUR",
        "HEURE_DEBUT",
        "HEURE_FIN",
      ];

      // Add "POSTE_TRAVAIL" to excludedKeys to prevent it from appearing as a separate column
      const excludedKeys = ["firestore_id", "firebase_timestamp", "S1", "POSTE_TRAVAIL"];
      const surveyQuestionOrder = surveyQuestions.map(q => q.id);
      const posteTravailActualId = "POSTE"; // As specified by user

      let allKeys = new Set<string>();
      rawData.forEach(docData => {
        Object.keys(docData).forEach(key => {
          if (!excludedKeys.includes(key)) {
            allKeys.add(key);
          }
        });
      });

      // Build the header order
      let orderedHeaders = [...coreHeaders];
      
      // Add the "POSTE" question (if it exists in data and is the designated one)
      if (allKeys.has(posteTravailActualId) && !orderedHeaders.includes(posteTravailActualId)) {
        orderedHeaders.push(posteTravailActualId);
      }

      // Add remaining survey questions in their defined order, excluding already added "POSTE"
      surveyQuestionOrder.forEach(questionId => {
        if (allKeys.has(questionId) && !orderedHeaders.includes(questionId) && !excludedKeys.includes(questionId)) {
          orderedHeaders.push(questionId);
          
          // Add related commune fields immediately after
          const codeInseeField = `${questionId}_CODE_INSEE`;
          const communeLibreField = `${questionId}_COMMUNE_LIBRE`;
          if (allKeys.has(codeInseeField) && !orderedHeaders.includes(codeInseeField)) {
            orderedHeaders.push(codeInseeField);
          }
          if (allKeys.has(communeLibreField) && !orderedHeaders.includes(communeLibreField)) {
            orderedHeaders.push(communeLibreField);
          }
        }
      });

      // Add any other keys that might exist but weren't in core or surveyQuestionOrder
      const remainingKeys = Array.from(allKeys).filter(
        key => !orderedHeaders.includes(key) && !excludedKeys.includes(key)
      ).sort();
      orderedHeaders = [...orderedHeaders, ...remainingKeys];
      
      // Final header list for the sheet
      const finalHeaderOrder = orderedHeaders;

      const data = rawData.map((docData) => {
        const processedData: any = {};
        finalHeaderOrder.forEach(header => {
          if (!excludedKeys.includes(header)) {
            let value = docData[header] !== undefined ? docData[header] : "";
            if (Array.isArray(value)) {
              value = value.join(", ");
            }
            processedData[header] = value;
          }
        });
        return processedData;
      });

      console.log("Processed data for Excel:", data);
      console.log("Final Header Order for Excel:", finalHeaderOrder);

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data, { header: finalHeaderOrder });

      const colWidths = finalHeaderOrder.map(() => ({ wch: 20 }));
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Data");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${FIREBASE_COLLECTION}_Survey_Data_${timestamp}.xlsx`;
      
      // Write the file using React Native File System
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const file = RNFS.DocumentDirectoryPath + '/' + filename;
      
      // Write file as base64
      await RNFS.writeFile(file, wbout, 'base64');
      console.log('File written to:', file);
      
      // Verify file exists and get info
      const fileExists = await RNFS.exists(file);
      if (!fileExists) {
        throw new Error('Le fichier n\'a pas pu être créé');
      }
      
      const fileInfo = await RNFS.stat(file);
      console.log('File info:', fileInfo);
      
      // Try multiple sharing approaches for better compatibility
      try {
        // First attempt: use url property
        await Share.open({
          title: 'Export des données du sondage',
          message: 'Fichier Excel généré avec les données du sondage',
          url: file,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          filename: filename,
        });
      } catch (shareError) {
        console.log('First share method failed, trying alternative:', shareError);
        
        // Second attempt: use urls array
        try {
          await Share.open({
            title: 'Export des données du sondage',
            message: 'Fichier Excel généré avec les données du sondage',
            urls: [file],
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            filename: filename,
          });
        } catch (secondShareError) {
          console.log('Second share method failed, trying third:', secondShareError);
          
          // Third attempt: simple file share
          await Share.open({
            url: file,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
        }
      }
      
      Alert.alert('Succès', 'Le fichier Excel a été généré et partagé avec succès');
      console.log("File generated and shared successfully");
    } catch (error) {
      console.error("Error downloading data:", error);
      Alert.alert('Erreur', 'Erreur lors de la génération du fichier Excel');
    }
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
        
        {selectedResponse.ENQUETEUR && (
          <Text style={styles.responseDate}>
            Enquêteur: {selectedResponse.ENQUETEUR}
          </Text>
        )}

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
        
        {/* Statistiques par enquêteur */}
        {Object.keys(surveysByEnqueteur).length > 0 && (
          <View style={styles.enqueteurStats}>
            <Text style={styles.enqueteurStatsTitle}>Sondages par enquêteur :</Text>
            {Object.entries(surveysByEnqueteur).map(([name, count]) => (
              <Text key={name} style={styles.enqueteurStatItem}>
                {name}: {count} sondage{count > 1 ? 's' : ''}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.refreshButton} onPress={loadResponses}>
          <Text style={styles.refreshButtonText}>Actualiser</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.downloadButton} onPress={downloadData}>
          <Text style={styles.downloadButtonText}>Télécharger Excel</Text>
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
  enqueteurStats: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#3d4f73',
    borderRadius: 8,
  },
  enqueteurStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  enqueteurStatItem: {
    fontSize: 14,
    color: '#8a9bb8',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  refreshButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeMainButton: {
    backgroundColor: '#666',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  closeMainButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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