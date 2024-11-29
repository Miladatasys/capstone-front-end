import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import io from 'socket.io-client';  // Importa socket.io-client
import BarBottomBar from '../../../components/Bar/BottomBar/BarBottomBar'; 

interface Notification {
  id: string; 
  tableNumber: string; 
  items: string; 
  total: number; 
  action: string; 
}

const API_URL = 'http://localhost:3000'; 
const socket = io(API_URL);

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Conectar con el servidor y escuchar el evento 'new_order'
    socket.on('new_order', (newOrder: Notification) => {
      console.log('Nuevo pedido recibido:', newOrder);
      // Añadir el nuevo pedido a la lista de notificaciones
      setNotifications((prevNotifications) => [...prevNotifications, newOrder]);
      
      // Mostrar un toast para indicar que se ha recibido una nueva notificación
      Toast.show({
        type: 'success',
        text1: 'Nuevo pedido',
        text2: `Mesa ${newOrder.tableNumber}: ${newOrder.items} - Total: $${newOrder.total}`,
      });
    });

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.off('new_order'); // Detener la escucha del evento al desmontarse
    };
  }, []);

  const handleNotificationPress = (notificationId: string) => {
    Toast.show({
      type: 'success',
      text1: 'Notificación vista',
      text2: `La notificación ${notificationId} ha sido gestionada.`,
    });

    // Redirigir a la vista del pedido específico
    setTimeout(() => {
      router.push(`/bar/orders/${notificationId}`); // Redirige a la vista del pedido usando el ID de la notificación
    }, 1000);
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item.id)}>
      <View style={styles.notificationCard}>
        <Text style={styles.notificationText}>
          <Text style={styles.boldText}>Mesa: {item.tableNumber}</Text>
        </Text>
        <Text style={styles.notificationText}>
          Items: {item.items}
        </Text>
        <Text style={styles.notificationText}>
          Total: ${item.total ? item.total.toLocaleString() : '0'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
      />
      <Toast />
      <BarBottomBar />
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
    backgroundColor: '#e3f2fd',
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
