import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function ClientNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { barId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem(`notifications_${barId}`);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar las notificaciones.',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    await saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    Alert.alert(
      "Borrar todas las notificaciones",
      "¿Estás seguro de que quieres borrar todas las notificaciones?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Borrar", 
          onPress: async () => {
            try {
              setNotifications([]);
              await AsyncStorage.removeItem(`notifications_${barId}`);
              Toast.show({
                type: 'success',
                text1: 'Notificaciones borradas',
                text2: 'Todas las notificaciones han sido eliminadas.',
              });
            } catch (error) {
              console.error('Error al borrar notificaciones:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudieron borrar las notificaciones. Inténtalo de nuevo.',
              });
            }
          }
        }
      ]
    );
  };

  const saveNotifications = async (notificationsToSave: Notification[]) => {
    try {
      await AsyncStorage.setItem(`notifications_${barId}`, JSON.stringify(notificationsToSave));
    } catch (error) {
      console.error('Error saving notifications:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron guardar los cambios en las notificaciones.',
      });
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read && styles.readNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificaciones</Text>
        <TouchableOpacity onPress={clearAllNotifications} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Borrar todo</Text>
        </TouchableOpacity>
      </View>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tienes notificaciones</Text>
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  notificationList: {
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  readNotification: {
    opacity: 0.6,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
  },
});

