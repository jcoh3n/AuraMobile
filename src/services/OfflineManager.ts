import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { saveSurveyResponse } from '../config/firebaseConfig';

// Clés pour AsyncStorage
const OFFLINE_SURVEYS_KEY = '@offline_surveys';
const SYNC_STATUS_KEY = '@sync_status';

export interface OfflineSurveyData {
  id: string;
  responses: { [questionId: string]: any };
  enqueteur: string;
  startTime?: Date;
  createdAt: string;
  synced: boolean;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncAttempt?: string;
  pendingSurveysCount: number;
}

class OfflineManager {
  private static instance: OfflineManager;
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private listeners: Array<(status: SyncStatus) => void> = [];

  private constructor() {
    this.initNetworkListener();
  }

  public static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  // Initialise l'écoute du réseau
  private initNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      console.log(`[OfflineManager] État réseau: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
      
      // Si on vient de retrouver la connexion, tenter la synchronisation
      if (wasOffline && this.isOnline) {
        console.log('[OfflineManager] Connexion retrouvée, synchronisation automatique...');
        this.syncPendingSurveys();
      }
      
      this.notifyListeners();
    });
  }

  // Ajouter un listener pour les changements de statut
  public addStatusListener(listener: (status: SyncStatus) => void) {
    this.listeners.push(listener);
    // Notifier immédiatement avec le statut actuel
    this.notifyListeners();
  }

  // Supprimer un listener
  public removeStatusListener(listener: (status: SyncStatus) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notifier tous les listeners
  private async notifyListeners() {
    const status = await this.getSyncStatus();
    this.listeners.forEach(listener => listener(status));
  }

  // Obtenir le statut de synchronisation
  public async getSyncStatus(): Promise<SyncStatus> {
    try {
      const storedStatus = await AsyncStorage.getItem(SYNC_STATUS_KEY);
      const pendingSurveys = await this.getPendingSurveys();
      
      const defaultStatus: SyncStatus = {
        isOnline: this.isOnline,
        pendingSurveysCount: pendingSurveys.length,
        lastSyncAttempt: storedStatus ? JSON.parse(storedStatus).lastSyncAttempt : undefined
      };

      return defaultStatus;
    } catch (error) {
      console.error('[OfflineManager] Erreur lors de la récupération du statut:', error);
      return {
        isOnline: this.isOnline,
        pendingSurveysCount: 0
      };
    }
  }

  // Sauvegarder une réponse de sondage (online ou offline)
  public async saveSurvey(
    responses: { [questionId: string]: any },
    enqueteur: string,
    startTime?: Date
  ): Promise<{ success: boolean; savedOffline: boolean; message: string }> {
    const surveyData: OfflineSurveyData = {
      id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      responses,
      enqueteur,
      startTime,
      createdAt: new Date().toISOString(),
      synced: false
    };

    try {
      // Toujours sauvegarder en local d'abord
      await this.saveToLocal(surveyData);

      // Si online, tenter la synchronisation immédiate
      if (this.isOnline) {
        try {
          await saveSurveyResponse(responses, enqueteur, startTime);
          // Marquer comme synchronisé
          surveyData.synced = true;
          await this.updateLocalSurvey(surveyData);
          
          console.log('[OfflineManager] Sondage sauvegardé et synchronisé immédiatement');
          return {
            success: true,
            savedOffline: false,
            message: 'Sondage sauvegardé et synchronisé avec succès'
          };
        } catch (syncError) {
          console.error('[OfflineManager] Erreur de synchronisation immédiate:', syncError);
          // Même si la sync échoue, on a sauvegardé en local
          return {
            success: true,
            savedOffline: true,
            message: 'Sondage sauvegardé localement. Synchronisation en attente...'
          };
        }
      } else {
        console.log('[OfflineManager] Mode offline - sondage sauvegardé localement');
        return {
          success: true,
          savedOffline: true,
          message: 'Mode offline: sondage sauvegardé localement'
        };
      }
    } catch (error) {
      console.error('[OfflineManager] Erreur lors de la sauvegarde:', error);
      return {
        success: false,
        savedOffline: false,
        message: 'Erreur lors de la sauvegarde du sondage'
      };
    } finally {
      this.notifyListeners();
    }
  }

  // Sauvegarder en local
  private async saveToLocal(surveyData: OfflineSurveyData) {
    try {
      const existingSurveys = await this.getPendingSurveys();
      existingSurveys.push(surveyData);
      await AsyncStorage.setItem(OFFLINE_SURVEYS_KEY, JSON.stringify(existingSurveys));
      console.log(`[OfflineManager] Sondage sauvegardé localement (ID: ${surveyData.id})`);
    } catch (error) {
      console.error('[OfflineManager] Erreur sauvegarde locale:', error);
      throw error;
    }
  }

  // Mettre à jour un sondage local
  private async updateLocalSurvey(updatedSurvey: OfflineSurveyData) {
    try {
      const surveys = await this.getPendingSurveys();
      const index = surveys.findIndex(s => s.id === updatedSurvey.id);
      if (index !== -1) {
        surveys[index] = updatedSurvey;
        await AsyncStorage.setItem(OFFLINE_SURVEYS_KEY, JSON.stringify(surveys));
      }
    } catch (error) {
      console.error('[OfflineManager] Erreur mise à jour locale:', error);
    }
  }

  // Récupérer les sondages en attente
  private async getPendingSurveys(): Promise<OfflineSurveyData[]> {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_SURVEYS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('[OfflineManager] Erreur récupération sondages en attente:', error);
      return [];
    }
  }

  // Synchroniser tous les sondages en attente
  public async syncPendingSurveys(): Promise<{ syncedCount: number; failedCount: number }> {
    if (this.syncInProgress) {
      console.log('[OfflineManager] Synchronisation déjà en cours...');
      return { syncedCount: 0, failedCount: 0 };
    }

    this.syncInProgress = true;
    let syncedCount = 0;
    let failedCount = 0;

    try {
      const pendingSurveys = await this.getPendingSurveys();
      const unsyncedSurveys = pendingSurveys.filter(s => !s.synced);

      console.log(`[OfflineManager] Tentative de synchronisation de ${unsyncedSurveys.length} sondages...`);

      for (const survey of unsyncedSurveys) {
        try {
          await saveSurveyResponse(
            survey.responses,
            survey.enqueteur,
            survey.startTime ? new Date(survey.startTime) : undefined
          );
          
          // Marquer comme synchronisé
          survey.synced = true;
          await this.updateLocalSurvey(survey);
          syncedCount++;
          
          console.log(`[OfflineManager] Sondage ${survey.id} synchronisé avec succès`);
        } catch (error) {
          console.error(`[OfflineManager] Erreur sync sondage ${survey.id}:`, error);
          failedCount++;
        }
      }

      // Nettoyer les sondages synchronisés (garder seulement les non-synchronisés)
      await this.cleanupSyncedSurveys();

      // Mettre à jour le statut de synchronisation
      await this.updateSyncStatus();

      console.log(`[OfflineManager] Synchronisation terminée: ${syncedCount} réussies, ${failedCount} échecs`);
      
    } catch (error) {
      console.error('[OfflineManager] Erreur générale de synchronisation:', error);
    } finally {
      this.syncInProgress = false;
      this.notifyListeners();
    }

    return { syncedCount, failedCount };
  }

  // Nettoyer les sondages synchronisés
  private async cleanupSyncedSurveys() {
    try {
      const allSurveys = await this.getPendingSurveys();
      const pendingSurveys = allSurveys.filter(s => !s.synced);
      await AsyncStorage.setItem(OFFLINE_SURVEYS_KEY, JSON.stringify(pendingSurveys));
      
      console.log(`[OfflineManager] Nettoyage: ${allSurveys.length - pendingSurveys.length} sondages synchronisés supprimés`);
    } catch (error) {
      console.error('[OfflineManager] Erreur lors du nettoyage:', error);
    }
  }

  // Mettre à jour le statut de synchronisation
  private async updateSyncStatus() {
    try {
      const status = {
        lastSyncAttempt: new Date().toISOString()
      };
      await AsyncStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(status));
    } catch (error) {
      console.error('[OfflineManager] Erreur mise à jour statut sync:', error);
    }
  }

  // Forcer une tentative de synchronisation manuelle
  public async forcSync(): Promise<boolean> {
    if (!this.isOnline) {
      console.log('[OfflineManager] Impossible de synchroniser: mode offline');
      return false;
    }

    const result = await this.syncPendingSurveys();
    return result.syncedCount > 0 || result.failedCount === 0;
  }

  // Obtenir les statistiques offline
  public async getOfflineStats(): Promise<{
    totalPendingSurveys: number;
    syncedSurveys: number;
    lastSyncAttempt?: string;
  }> {
    try {
      const pendingSurveys = await this.getPendingSurveys();
      const syncedSurveys = pendingSurveys.filter(s => s.synced).length;
      const status = await AsyncStorage.getItem(SYNC_STATUS_KEY);
      const lastSyncAttempt = status ? JSON.parse(status).lastSyncAttempt : undefined;

      return {
        totalPendingSurveys: pendingSurveys.length,
        syncedSurveys,
        lastSyncAttempt
      };
    } catch (error) {
      console.error('[OfflineManager] Erreur récupération stats:', error);
      return {
        totalPendingSurveys: 0,
        syncedSurveys: 0
      };
    }
  }

  // Réinitialiser toutes les données offline (pour debug/admin)
  public async clearAllOfflineData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([OFFLINE_SURVEYS_KEY, SYNC_STATUS_KEY]);
      console.log('[OfflineManager] Toutes les données offline ont été supprimées');
      this.notifyListeners();
    } catch (error) {
      console.error('[OfflineManager] Erreur lors de la suppression des données offline:', error);
    }
  }
}

export default OfflineManager; 