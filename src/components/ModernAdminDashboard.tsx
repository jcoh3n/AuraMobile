import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StatusBar, Image, Platform } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { getSurveyStats, getAllResponses, SurveyStats, FIREBASE_COLLECTION, signOut } from '../config/firebaseConfig';
import { surveyQuestions } from '../data/surveyQuestions';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

interface ModernAdminDashboardProps {
  onClose?: () => void;
}

const ModernAdminDashboard: React.FC<ModernAdminDashboardProps> = ({ onClose }) => {
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  
  // Calculer les espaces sécurisés pour tablette Android
  const statusBarHeight = StatusBar.currentHeight || 24;
  const safeAreaTop = statusBarHeight + 10; // StatusBar + marge réduite
  const safeAreaBottom = 15; // Marge réduite pour navigation bar

  // Fonction pour vérifier si le logo est disponible et le rendre
  const renderLogo = () => {
    try {
      const logoSource = require('../assets/logo.png');
      return (
        <Image 
          source={logoSource} 
          style={styles.companyLogo}
          resizeMode="contain"
        />
      );
    } catch (error) {
      console.log('Logo non disponible, utilisation de l\'icône par défaut');
      return (
        <View style={styles.iconPlaceholder}>
          <Icon name="admin-panel-settings" size={56} color="#4a90e2" />
        </View>
      );
    }
  };

  // Fonction de déconnexion
  const handleSignOut = async () => {
    try {
      await signOut();
      if (onClose) {
        onClose(); // Retourner à l'écran principal après déconnexion
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la déconnexion');
    }
  };

  // Charger les statistiques optimisées
  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getSurveyStats();
      setStats(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Téléchargement Excel complet (garde la logique existante)
  const downloadExcelData = async () => {
    setDownloadingExcel(true);
    try {
      // Récupérer toutes les réponses pour l'export Excel
      const responses = await getAllResponses();
      
      const rawData = responses.map((response: any) => {
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

      // Utiliser la même logique de formatage que l'ancien AdminDashboard
      const coreHeaders = [
        "ID_questionnaire",
        "ENQUETEUR",
        "DATE",
        "JOUR",
        "HEURE_DEBUT",
        "HEURE_FIN",
      ];

      const excludedKeys = ["firestore_id", "firebase_timestamp", "S1", "POSTE_TRAVAIL"];
      const surveyQuestionOrder = surveyQuestions.map(q => q.id);
      const posteTravailActualId = "POSTE";

      let allKeys = new Set<string>();
      rawData.forEach(docData => {
        Object.keys(docData).forEach(key => {
          if (!excludedKeys.includes(key)) {
            allKeys.add(key);
          }
        });
      });

      let orderedHeaders = [...coreHeaders];
      
      if (allKeys.has(posteTravailActualId) && !orderedHeaders.includes(posteTravailActualId)) {
        orderedHeaders.push(posteTravailActualId);
      }

      surveyQuestionOrder.forEach(questionId => {
        if (allKeys.has(questionId) && !orderedHeaders.includes(questionId) && !excludedKeys.includes(questionId)) {
          orderedHeaders.push(questionId);
          
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

      const remainingKeys = Array.from(allKeys).filter(
        key => !orderedHeaders.includes(key) && !excludedKeys.includes(key)
      ).sort();
      orderedHeaders = [...orderedHeaders, ...remainingKeys];
      
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

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data, { header: finalHeaderOrder });

      const colWidths = finalHeaderOrder.map(() => ({ wch: 20 }));
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Data");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${FIREBASE_COLLECTION}_Survey_Data_${timestamp}.xlsx`;
      
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const file = RNFS.DownloadDirectoryPath + '/' + filename;
      
      await RNFS.writeFile(file, wbout, 'base64');
      
      const fileExists = await RNFS.exists(file);
      if (!fileExists) {
        throw new Error('Le fichier n\'a pas pu être créé');
      }
      
      try {
        const shareOptions = {
          title: 'Export des données du sondage',
          message: `Fichier Excel généré: ${filename}`,
          url: `file://${file}`,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
        
        const result = await Share.open(shareOptions);
        
        if (result && result.success === false && result.message && result.message.includes('User did not share')) {
          Alert.alert(
            'Fichier sauvegardé', 
            `Le fichier Excel a été sauvegardé dans le dossier Téléchargements:\n\n${filename}`,
            [{ text: 'OK' }]
          );
          return;
        }
        
      } catch (shareError: any) {
        if (shareError && (
          shareError.message?.includes('User did not share') || 
          shareError.message?.includes('cancelled') ||
          shareError.message?.includes('dismissed')
        )) {
          Alert.alert(
            'Fichier sauvegardé', 
            `Le fichier Excel a été sauvegardé dans le dossier Téléchargements:\n\n${filename}`,
            [{ text: 'OK' }]
          );
          return;
        }
        
        Alert.alert(
          'Fichier sauvegardé', 
          `Le partage a échoué, mais le fichier Excel a été sauvegardé dans le dossier Téléchargements:\n\n${filename}`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      Alert.alert('Succès', 'Le fichier Excel a été généré et partagé avec succès');
    } catch (error) {
      console.error("Error downloading data:", error);
      Alert.alert('Erreur', 'Erreur lors de la génération du fichier Excel');
    } finally {
      setDownloadingExcel(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.loadingContainer, { paddingTop: safeAreaTop, paddingBottom: safeAreaBottom }]}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Chargement des statistiques...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barre de statut de connexion améliorée */}
      {onClose && (
        <View style={styles.statusBar}>
          <View style={styles.statusBarContent}>
            {/* Section gauche - Statut de connexion */}
            <View style={styles.connectionStatus}>
              <View style={styles.connectionDot} />
              <Text style={styles.connectionLabel}>Connecté</Text>
            </View>
            
            {/* Section droite - Actions */}
            <View style={styles.statusBarActions}>
              <TouchableOpacity 
                style={styles.homeButton} 
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Icon name="home" size={20} color="#4a90e2" />
                <Text style={styles.homeButtonText}>Accueil</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.signOutButton} 
                onPress={handleSignOut}
                activeOpacity={0.7}
              >
                <Icon name="logout" size={18} color="#dc3545" />
                <Text style={styles.signOutButtonText}>Déconnexion</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Header avec logo centré pour tablette */}
      <View style={[styles.header, styles.headerWithReducedPadding]}>
        <View style={styles.logoContainer}>
          {renderLogo()}
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Statistique principale redesignée */}
        <View style={styles.statsSection}>
          <View style={styles.mainStatsContainer}>
            <View style={styles.statsIconContainer}>
              <Icon name="assessment" size={32} color="#4a90e2" />
            </View>
            <View style={styles.statsContent}>
              <Text style={styles.statsLabel}>Total des enquêtes</Text>
              <Text style={styles.statsValue}>{stats?.totalSurveys || 0}</Text>
            </View>
          </View>
        </View>

        {/* Liste compacte des enquêteurs */}
        <View style={styles.enqueteursSection}>
          <View style={styles.enqueteursCard}>
            <View style={styles.enqueteursHeader}>
              <View style={styles.enqueteursIcon}>
                <Icon name="people" size={20} color="#4a90e2" />
              </View>
              <Text style={styles.enqueteursTitle}>Enquêteurs</Text>
            </View>
            <ScrollView 
              style={styles.enqueteursList}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {stats && stats.surveysByEnqueteur && Object.keys(stats.surveysByEnqueteur).length > 0 ? (
                <>
                  {Object.entries(stats.surveysByEnqueteur)
                    .sort(([,a], [,b]) => a - b)
                    .map(([name, count]) => (
                      <View key={name} style={styles.enqueteurItem}>
                        <Text style={styles.enqueteurName}>{name}</Text>
                        <View style={styles.enqueteurBadge}>
                          <Text style={styles.enqueteurCount}>{count}</Text>
                        </View>
                      </View>
                    ))}
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Icon name="person-outline" size={24} color="#8a9bb8" />
                  <Text style={styles.emptyStateText}>Aucun enquêteur pour le moment</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        {/* Action export */}
        <View style={styles.exportSection}>
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={downloadExcelData}
            disabled={downloadingExcel}
          >
            {downloadingExcel ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Icon name="get-app" size={20} color="white" />
            )}
            <Text style={styles.exportButtonText}>
              {downloadingExcel ? 'Génération...' : 'Exporter Excel'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a3b63',
  },
  scrollView: {
    flex: 1,
  },
  statusBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44,
  },
  statusBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectionDot: {
    width: 10,
    height: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  connectionLabel: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  statusBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  homeButtonText: {
    fontSize: 13,
    color: '#4a90e2',
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  signOutButtonText: {
    fontSize: 13,
    color: '#dc3545',
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerWithReducedPadding: {
    paddingTop: 20,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    borderRadius: 65,
    marginBottom: 15,
  },
  companyLogo: {
    width: 130,
    height: 130,
    marginBottom: 15,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 30,
  },
  mainStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  statsContent: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 16,
    color: '#a8b8d8',
    fontWeight: '500',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 42,
    fontWeight: '700',
    color: 'white',
    lineHeight: 50,
  },

  enqueteursSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  enqueteursCard: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  enqueteursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  enqueteursIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enqueteursTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#a8b8d8',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  enqueteursList: {
    maxHeight: 130,
  },
  enqueteurItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  enqueteurName: {
    fontSize: 15,
    color: 'white',
    flex: 1,
    fontWeight: '500',
  },
  enqueteurBadge: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    minWidth: 28,
    alignItems: 'center',
    shadowColor: '#4a90e2',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  enqueteurCount: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  exportSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 10,
    minWidth: 180,
    justifyContent: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8a9bb8',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#8a9bb8',
    marginTop: 12,
    fontSize: 16,
  },
});

export default ModernAdminDashboard;