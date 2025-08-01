import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import OfflineManager, { SyncStatus } from '../services/OfflineManager';

interface OfflineStatusBarProps {
  style?: any;
}

const OfflineStatusBar: React.FC<OfflineStatusBarProps> = ({ style }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    pendingSurveysCount: 0
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const offlineManager = OfflineManager.getInstance();

    // Fonction de gestion des changements de statut
    const handleStatusChange = (status: SyncStatus) => {
      setSyncStatus(status);
    };

    // S'abonner aux changements
    offlineManager.addStatusListener(handleStatusChange);

    // Nettoyage
    return () => {
      offlineManager.removeStatusListener(handleStatusChange);
    };
  }, []);

  // Synchronisation manuelle
  const handleManualSync = async () => {
    if (!syncStatus.isOnline) {
      Alert.alert(
        'Mode offline',
        'Impossible de synchroniser en mode offline. La synchronisation se fera automatiquement dès que la connexion sera rétablie.'
      );
      return;
    }

    if (syncStatus.pendingSurveysCount === 0) {
      Alert.alert('Synchronisation', 'Aucun sondage en attente de synchronisation.');
      return;
    }

    setIsSyncing(true);
    try {
      const offlineManager = OfflineManager.getInstance();
      const result = await offlineManager.forcSync();
      
      if (result) {
        Alert.alert('Succès', 'Synchronisation terminée avec succès !');
      } else {
        Alert.alert('Erreur', 'Échec de la synchronisation. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation manuelle:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la synchronisation.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Afficher les détails offline
  const showOfflineDetails = async () => {
    try {
      const offlineManager = OfflineManager.getInstance();
      const stats = await offlineManager.getOfflineStats();
      
      const lastSync = stats.lastSyncAttempt 
        ? new Date(stats.lastSyncAttempt).toLocaleString('fr-FR')
        : 'Jamais';

      Alert.alert(
        'Statistiques offline',
        `📊 Sondages en attente: ${stats.totalPendingSurveys}\n` +
        `✅ Sondages synchronisés: ${stats.syncedSurveys}\n` +
        `🕒 Dernière sync: ${lastSync}`,
        [
          { text: 'OK', style: 'default' },
          {
            text: 'Synchroniser',
            onPress: handleManualSync,
            style: 'default'
          }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de l\'affichage des détails:', error);
    }
  };

  // Style conditionnel selon le statut
  const getStatusStyle = () => {
    if (!syncStatus.isOnline) {
      return [styles.statusBar, styles.offline];
    } else if (syncStatus.pendingSurveysCount > 0) {
      return [styles.statusBar, styles.pending];
    } else {
      return [styles.statusBar, styles.online];
    }
  };

  // Texte du statut
  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return `📵 Mode offline • ${syncStatus.pendingSurveysCount} en attente`;
    } else if (syncStatus.pendingSurveysCount > 0) {
      return `🔄 ${syncStatus.pendingSurveysCount} sondage${syncStatus.pendingSurveysCount > 1 ? 's' : ''} en attente`;
    } else {
      return '✅ Tout synchronisé';
    }
  };

  return (
    <TouchableOpacity 
      style={[getStatusStyle(), style]} 
      onPress={showOfflineDetails}
      disabled={isSyncing}
    >
      <Text style={styles.statusText}>
        {isSyncing ? '⏳ Synchronisation...' : getStatusText()}
      </Text>
      {syncStatus.pendingSurveysCount > 0 && (
        <Text style={styles.tapHint}>Appuyez pour plus d'infos</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  online: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  offline: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  pending: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
});

export default OfflineStatusBar; 