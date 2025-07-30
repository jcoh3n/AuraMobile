import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { surveyQuestions, surveyConfig } from '../data/surveyQuestions';
import { saveSurveyResponse } from '../config/firebaseConfig';
import { SurveyQuestion, SurveyAnswers, SurveyNavigation } from '../types/survey';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import TextInputQuestion from './TextInputQuestion';
import GareQuestion from './GareQuestion';
import CommuneQuestion from './CommuneQuestion';

interface SurveyProps {
  onComplete?: () => void;
}

const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  const [navigation, setNavigation] = useState<SurveyNavigation>({
    currentQuestionId: surveyConfig.startQuestionId,
    history: [],
    answers: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Trouver la question actuelle
  const currentQuestion = useMemo(() => {
    return surveyQuestions.find(q => q.id === navigation.currentQuestionId);
  }, [navigation.currentQuestionId]);

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

  // Finaliser le sondage
  const handleSurveyComplete = async (finalAnswers: SurveyAnswers) => {
    setIsSubmitting(true);
    try {
      await saveSurveyResponse(finalAnswers);
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

  // Commencer le sondage
  const startSurvey = () => {
    setShowWelcome(false);
  };

  // Écran de bienvenue
  if (showWelcome) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.welcomeContainer}>
          <Text style={styles.title}>{surveyConfig.title}</Text>
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
        {navigation.history.length > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
        )}
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