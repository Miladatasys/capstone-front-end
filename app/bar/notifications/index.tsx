import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import BarBottomBar from '../../../components/Bar/BottomBar/BarBottomBar';
import io from 'socket.io-client';  // Importar socket.io-client
import { API_URL } from '@env';

const socket = io(API_URL);  // Conectar al servidor Socket.IO

interface Notification {
  id: string;
  tableNumber: string;
  items: string;
  total: number;
  action: string;
}

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    socket.on('new_order_bar', (newOrder: any) => {
      console.log('Nuevo pedido para la barra recibido:', newOrder);
  
      // Verificar si la notificación ya está presente
      setNotifications((prevNotifications) => {
        const exists = prevNotifications.some(notification => notification.id === newOrder.tableNumber + new Date().getTime());
        if (exists) return prevNotifications; // Evitar duplicados
  
        return [
          ...prevNotifications,
          {
            id: newOrder.tableNumber + new Date().getTime(),
            tableNumber: newOrder.tableNumber,
            items: newOrder.items,
            total: newOrder.total,
            action: 'bar'
          }
        ];
      });
  
      Toast.show({
        type: 'success',
        text1: 'Nuevo pedido para barra',
        text2: `Mesa ${newOrder.tableNumber}: ${newOrder.items}`,
      });
    });
  
    return () => {
      socket.off('new_order_bar');
    };
  }, []);
  
  

  const handleNotificationPress = (notificationId: string) => {
    Toast.show({
      type: 'success',
      text1: 'Notificación vista',
      text2: `La notificación ${notificationId} ha sido gestionada.`,
    });

    setTimeout(() => {
      router.push(`/bar/orders/${notificationId}`);  
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
