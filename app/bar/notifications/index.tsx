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
  isConfirmed: boolean;  // Para manejar si está confirmado
  isRejected: boolean;   // Para manejar si está rechazado
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
            action: 'bar',
            isConfirmed: false,  // Inicialmente el pedido no está confirmado
            isRejected: false,   // Inicialmente el pedido no está rechazado
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

  const handleNotificationPress = (notification: Notification) => {
    // Lógica para abrir el modal cuando se selecciona la notificación
    console.log("Notificación seleccionada:", notification);
  };

  const handleConfirmOrder = (notificationId: string) => {
    // Confirmar el pedido
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isConfirmed: true }
          : notification
      )
    );

    Toast.show({
      type: 'success',
      text1: 'Pedido confirmado',
      text2: `El pedido de la mesa ${notificationId} ha sido confirmado.`,
    });

    socket.emit('order_confirmed_bar', { orderId: notificationId, status: 'confirmed' });
  };

  const handleRejectOrder = (notificationId: string) => {
    // Rechazar el pedido
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRejected: true }
          : notification
      )
    );

    Toast.show({
      type: 'error',
      text1: 'Pedido rechazado',
      text2: `El pedido de la mesa ${notificationId} ha sido rechazado.`,
    });

    socket.emit('order_rejected_bar', { orderId: notificationId, status: 'rejected' });
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity>
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
        {item.isConfirmed && <Text style={styles.checkmark}>✅</Text>}  
        {item.isRejected && <Text style={styles.rejected}>❌</Text>}    
        <View style={styles.buttonsContainer}>
          {!item.isConfirmed && !item.isRejected && (
            <>
              <TouchableOpacity onPress={() => handleConfirmOrder(item.id)}>
                <Text style={styles.confirmButton}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRejectOrder(item.id)}>
                <Text style={styles.rejectButton}>Rechazar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
  checkmark: {
    fontSize: 24,
    color: 'green',
    marginTop: 10,
  },
  rejected: {
    fontSize: 24,
    color: 'red',
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  confirmButton: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButton: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
