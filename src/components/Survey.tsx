import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { surveyQuestions, surveyConfig } from '../data/surveyQuestions';
import { saveSurveyResponse } from '../config/firebaseConfig';
import { SurveyQuestion, SurveyAnswers, SurveyNavigation } from '../types/survey';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import TextInputQuestion from './TextInputQuestion';
import GareQuestion from './GareQuestion';
import CommuneQuestion from './CommuneQuestion';
import StreetQuestion from './StreetQuestion';

interface SurveyProps {
  onComplete?: () => void;
}

// Clé pour AsyncStorage
const ENQUETEUR_STORAGE_KEY = '@surveyor_name';

const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  // État du sondage équivalent au Vue.js
  const [currentStep, setCurrentStep] = useState<'enqueteur' | 'welcome' | 'survey'>('enqueteur');
  const [enqueteurInput, setEnqueteurInput] = useState('');
  const [savedEnqueteur, setSavedEnqueteur] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);

  const [navigation, setNavigation] = useState<SurveyNavigation>({
    currentQuestionId: surveyConfig.startQuestionId,
    history: [],
    answers: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingName, setIsLoadingName] = useState(true);

  // Trouver la question actuelle
  const currentQuestion = useMemo(() => {
    return surveyQuestions.find(q => q.id === navigation.currentQuestionId);
  }, [navigation.currentQuestionId]);

  // Fonctions AsyncStorage pour la persistance du nom d'enquêteur
  const loadSavedEnqueteur = async () => {
    try {
      const savedName = await AsyncStorage.getItem(ENQUETEUR_STORAGE_KEY);
      if (savedName) {
        setSavedEnqueteur(savedName);
        setEnqueteurInput(savedName);
        setCurrentStep('welcome'); // Aller directement à l'écran de bienvenue
      }
    } catch (error) {
      console.error('Erreur lors du chargement du nom d\'enquêteur:', error);
    } finally {
      setIsLoadingName(false);
    }
  };

  const saveEnqueteurToStorage = async (name: string) => {
    try {
      await AsyncStorage.setItem(ENQUETEUR_STORAGE_KEY, name);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du nom d\'enquêteur:', error);
    }
  };

  // Charger le nom sauvegardé au démarrage
  useEffect(() => {
    loadSavedEnqueteur();
  }, []);

  // Gérer la réponse à une question
  const handleAnswer = async (answer: any) => {
    const newAnswers = {
      ...navigation.answers,
      [navigation.currentQuestionId]: answer
    };

    // Déterminer la prochaine question
    let nextQuestionId: string | undefined;

    if (currentQuestion?.type === 'singleChoice') {
      const selectedOption = currentQuestion.options?.find(opt => opt.id === answer);
      nextQuestionId = selectedOption?.next;
    } else {
      nextQuestionId = currentQuestion?.next;
    }

    // Si c'est la fin du sondage
    if (nextQuestionId === 'end' || !nextQuestionId) {
      await handleSurveyComplete(newAnswers);
      return;
    }

    // Navigation vers la question suivante
    setNavigation({
      currentQuestionId: nextQuestionId,
      history: [...navigation.history, navigation.currentQuestionId],
      answers: newAnswers
    });
  };

  // Fonction pour définir l'enquêteur (équivalent Vue.js)
  const setEnqueteur = async () => {
    if (enqueteurInput.trim() !== "") {
      const trimmedName = enqueteurInput.trim();
      setSavedEnqueteur(trimmedName);
      await saveEnqueteurToStorage(trimmedName); // Sauvegarder dans AsyncStorage
      setCurrentStep('welcome');
      setStartTime(new Date()); // Capture du temps de début
    } else {
      Alert.alert("Erreur", "Veuillez entrer le prénom de l'enquêteur.");
    }
  };

  // Fonction pour changer/éditer le nom d'enquêteur
  const changeEnqueteur = () => {
    setCurrentStep('enqueteur');
    setEnqueteurInput(savedEnqueteur); // Pré-remplir avec le nom actuel
  };

  // Fonction pour effacer complètement le nom sauvegardé (utile pour debug/admin)
  const clearSavedEnqueteur = async () => {
    try {
      await AsyncStorage.removeItem(ENQUETEUR_STORAGE_KEY);
      setSavedEnqueteur('');
      setEnqueteurInput('');
      setCurrentStep('enqueteur');
    } catch (error) {
      console.error('Erreur lors de la suppression du nom d\'enquêteur:', error);
    }
  };

  // Finaliser le sondage
  const handleSurveyComplete = async (finalAnswers: SurveyAnswers) => {
    setIsSubmitting(true);
    try {
      // Capture de l'enquêteur pour éviter la perte lors des opérations async
      const capturedEnqueteur = savedEnqueteur;
      await saveSurveyResponse(finalAnswers, capturedEnqueteur, startTime || undefined);
      Alert.alert(
        'Merci !',
        'Votre participation au sondage a été enregistrée avec succès.',
        [
          {
            text: 'OK',
            onPress: () => onComplete?.()
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.',
        [
          {
            text: 'Réessayer',
            onPress: () => handleSurveyComplete(finalAnswers)
          },
          {
            text: 'Annuler',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Revenir à la question précédente
  const handleGoBack = () => {
    if (navigation.history.length > 0) {
      const previousQuestionId = navigation.history[navigation.history.length - 1];
      const newHistory = navigation.history.slice(0, -1);
      
      setNavigation({
        ...navigation,
        currentQuestionId: previousQuestionId,
        history: newHistory
      });
    }
  };

  // Fonction pour gérer le bouton retour (accueil ou question précédente)
  const handleBackButton = () => {
    if (navigation.history.length === 0) {
      // Si on est sur la première question, retourner à l'écran de bienvenue
      setCurrentStep('welcome');
    } else {
      // Sinon, revenir à la question précédente
      handleGoBack();
    }
  };

  // Commencer le sondage (depuis l'écran de bienvenue)
  const startSurvey = () => {
    setCurrentStep('survey');
  };

  // Écran de chargement au démarrage
  if (isLoadingName) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  // Écran de saisie de l'enquêteur (équivalent Vue.js)
  if (currentStep === 'enqueteur') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.welcomeContainer}>
          <Text style={styles.title}>Sondage Mobilité Gare d'Auray</Text>
          <Text style={styles.enqueteurLabel}>
            {savedEnqueteur ? 'Modifier le prénom enquêteur :' : 'Prénom enquêteur :'}
          </Text>
          <TextInput
            style={styles.enqueteurInput}
            value={enqueteurInput}
            onChangeText={setEnqueteurInput}
            placeholder="Entrez votre prénom"
            placeholderTextColor="#8a9bb8"
            autoCapitalize="words"
          />
          {enqueteurInput.trim() && (
            <TouchableOpacity style={styles.nextButton} onPress={setEnqueteur}>
              <Text style={styles.nextButtonText}>
                {savedEnqueteur ? 'Mettre à jour' : 'Suivant'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  // Écran de bienvenue
  if (currentStep === 'welcome') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.welcomeContainer}>
          <Text style={styles.title}>{surveyConfig.title}</Text>
          
          {/* Affichage du nom d'enquêteur avec possibilité de changement */}
          <View style={styles.enqueteurDisplay}>
            <Text style={styles.enqueteurDisplayLabel}>Enquêteur :</Text>
            <Text style={styles.enqueteurDisplayName}>{savedEnqueteur}</Text>
            <TouchableOpacity 
              style={styles.changeNameButton} 
              onPress={changeEnqueteur}
              onLongPress={() => {
                Alert.alert(
                  "Effacer le nom sauvegardé",
                  "Voulez-vous complètement effacer le nom d'enquêteur sauvegardé ?",
                  [
                    { text: "Annuler", style: "cancel" },
                    { text: "Effacer", style: "destructive", onPress: clearSavedEnqueteur }
                  ]
                );
              }}
            >
              <Text style={styles.changeNameButtonText}>Changer</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeText}>{surveyConfig.welcomeMessage}</Text>
          <TouchableOpacity style={styles.startButton} onPress={startSurvey}>
            <Text style={styles.startButtonText}>Commencer le sondage</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Écran de chargement
  if (isSubmitting) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Enregistrement en cours...</Text>
        </View>
      </View>
    );
  }

  // Erreur : question non trouvée
  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur : Question non trouvée</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
          <Text style={styles.backButtonText}>
            {navigation.history.length === 0 ? '← Accueil' : '← Retour'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          Question {navigation.history.length + 1}
        </Text>
      </View>

      {/* Contenu de la question */}
      <View style={styles.questionContainer}>
        {currentQuestion.type === 'singleChoice' ? (
          <SingleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedValue={navigation.answers[currentQuestion.id]}
          />
        ) : currentQuestion.type === 'gare' ? (
          <GareQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            initialValue={navigation.answers[currentQuestion.id] || ''}
          />
        ) : currentQuestion.type === 'commune' ? (
          <CommuneQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            initialValue={navigation.answers[currentQuestion.id] || ''}
          />
        ) : currentQuestion.type === 'street' ? (
          <StreetQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            initialValue={navigation.answers[currentQuestion.id] || ''}
          />
        ) : (
          <TextInputQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            initialValue={navigation.answers[currentQuestion.id] || ''}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a3b63',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  enqueteurLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  enqueteurInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    color: '#2a3b63',
  },
  nextButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  enqueteurDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3d4f73',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  enqueteurDisplayLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  enqueteurDisplayName: {
    color: '#4a90e2',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  changeNameButton: {
    backgroundColor: '#666',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  changeNameButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    backgroundColor: '#3d4f73',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Survey; 