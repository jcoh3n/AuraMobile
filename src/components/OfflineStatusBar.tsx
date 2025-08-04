import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
  const rotateAnim = useRef(new Animated.Value(0)).current;

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

  // Animation de rotation pour le sync
  useEffect(() => {
    if (isSyncing) {
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      rotateAnimation.start();
      return () => rotateAnimation.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isSyncing, rotateAnim]);

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



  const getWifiIcon = () => {
    if (isSyncing) return 'reload-outline';
    return 'wifi'; // Always use wifi icon
  };

  const getIconColor = () => {
    if (isSyncing) return '#FF9800'; // Orange for syncing
    return syncStatus.isOnline ? '#4CAF50' : '#F44336'; // Green/Red
  };



  return (
    <View style={[styles.wifiIconContainer, style]}>
      <TouchableOpacity 
        onPress={showOfflineDetails}
        disabled={isSyncing}
        activeOpacity={0.7}
      >
        <Animated.View
          style={isSyncing ? {
            transform: [{
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            }],
          } : {}}
        >
          <Icon 
            name={getWifiIcon()} 
            size={24} 
            color={getIconColor()}
          />
        </Animated.View>
        {syncStatus.pendingSurveysCount > 0 && !isSyncing && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{syncStatus.pendingSurveysCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wifiIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 999,
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF5722',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OfflineStatusBar; 