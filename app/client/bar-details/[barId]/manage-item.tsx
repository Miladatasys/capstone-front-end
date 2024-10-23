import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

interface Notification {
  id: string;
  message: string;
  type: 'product-unavailable' | 'order-adjusted';
}

const ManageItemScreen: React.FC = () => {
  const { barId } = useLocalSearchParams();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de notificaciones (en la vida real esto se conectaría con el backend)
    setTimeout(() => {
      const simulatedNotifications: Notification[] = [
        {
          id: '1',
          message: 'El producto "Cerveza Artesanal" ya no está disponible.',
          type: 'product-unavailable',
        },
        {
          id: '2',
          message: 'El pedido ha sido ajustado por el bar debido a cambios en la disponibilidad.',
          type: 'order-adjusted',
        },
      ];
      setNotifications(simulatedNotifications);
      setLoading(false);
    }, 2000);

    // Aquí se podría hacer una llamada al backend para obtener las notificaciones reales
    /*
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`URL_BACKEND/notifications/${barId}`);
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudieron cargar las notificaciones.',
        });
      }
    };

    fetchNotifications();
    */
  }, [barId]);

  const handleViewOrder = () => {
    router.push(`/client/bar-details/${barId}/OrderSummaryScreen`);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationText}>{item.message}</Text>
      {item.type === 'order-adjusted' && (
        <TouchableOpacity style={styles.button} onPress={handleViewOrder}>
          <Text style={styles.buttonText}>Ver Pedido Ajustado</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Cargando notificaciones...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.noNotificationsText}>No tienes notificaciones nuevas.</Text>}
      />
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  notificationCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#EF233C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotificationsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default ManageItemScreen;
