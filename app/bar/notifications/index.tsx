import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

interface Notification {
  id: string;
  tableNumber: string; // Número de mesa
  product: string; // Producto no disponible
  quantity: number; // Cantidad del producto
  action: string; // Acción del cliente (sustituir o eliminar)
}

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Simulación de notificaciones con más detalles mientras no esté disponible el backend
    setNotifications([
      { id: '1', tableNumber: '3', product: 'Cerveza Artesanal', quantity: 2, action: 'eliminar' },
      { id: '2', tableNumber: '5', product: 'Pizza Margherita', quantity: 1, action: 'sustituir' }
    ]);

    // Aquí irá la integración con el backend
    /*
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('URL_DEL_BACKEND/api/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    */
  }, []);

  const handleNotificationPress = (notificationId: string) => {
    Toast.show({
      type: 'success',
      text1: 'Notificación vista',
      text2: `La notificación ${notificationId} ha sido gestionada.`,
    });

    // Aquí se podría enviar la actualización al backend
    /*
    const updateNotificationStatus = async () => {
      try {
        await axios.post(`URL_DEL_BACKEND/api/notifications/${notificationId}/mark-as-seen`);
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
    };

    updateNotificationStatus();
    */

    // Después de manejar la notificación, se puede redirigir a otra pantalla si es necesario
    setTimeout(() => {
      router.push('/bar/orders'); // Redirige a la lista de pedidos o algún otro flujo de gestión
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNotificationPress(item.id)}>
            <View style={styles.notificationCard}>
              <Text style={styles.notificationText}>
                <Text style={styles.boldText}>Mesa: {item.tableNumber}</Text>
              </Text>
              <Text style={styles.notificationText}>
                Producto: {item.product} - Cantidad: {item.quantity}
              </Text>
              <Text style={styles.notificationText}>
                Acción del cliente: {item.action === 'eliminar' ? 'Eliminar' : 'Sustituir'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
