import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import KitchenBottomBar from '../../../components/Kitchen/BottomBar/KitchenBottomBar';
import io from 'socket.io-client';  
import { API_URL } from '@env';

const socket = io(API_URL);  

interface Notification {
  id: string;
  tableNumber: string;
  items: string;
  total: number;
  action: string;
  isConfirmed: boolean;  // Para manejar si está confirmado
  isRejected: boolean;   // Para manejar si está rechazado
}

const KitchenNotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const router = useRouter();

  useEffect(() => {
    socket.on('new_order_kitchen', (newOrder: any) => {
      console.log('Nuevo pedido para la cocina recibido:', newOrder);
  
      const notificationId = `${newOrder.tableNumber}_${newOrder.orderId}`;
  
      setNotifications((prevNotifications) => {
        const exists = prevNotifications.some(notification => notification.id === notificationId);
        if (exists) return prevNotifications; // Evitar duplicados
  
        return [
          ...prevNotifications,
          {
            id: notificationId, 
            tableNumber: newOrder.tableNumber,
            items: newOrder.items,
            total: newOrder.total,
            action: 'kitchen',
            isConfirmed: false,  // Inicialmente el pedido no está confirmado
            isRejected: false,   // Inicialmente el pedido no está rechazado
          }
        ];
      });
  
      Toast.show({
        type: 'success',
        text1: 'Nuevo pedido para cocina',
        text2: `Mesa ${newOrder.tableNumber}: ${newOrder.items}`,
      });
    });
  
    return () => {
      socket.off('new_order_kitchen');
    };
  }, []);

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setModalVisible(true); // Mostrar el modal cuando se selecciona una notificación
    console.log("Modal abierto con la notificación: ", notification);
  };

  const handleConfirmOrder = () => {
    if (selectedNotification) {
      Toast.show({
        type: 'success',
        text1: 'Pedido confirmado',
        text2: `Mesa ${selectedNotification.tableNumber} ha confirmado el pedido.`,
      });

      socket.emit('order_confirmed_kitchen', {
        orderId: selectedNotification.id,
        tableNumber: selectedNotification.tableNumber,
        status: 'confirmed',
      });

      // Actualizar la notificación para agregar el símbolo de check
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === selectedNotification.id
            ? { ...notification, isConfirmed: true }
            : notification
        )
      );

      setModalVisible(false); // Cerrar el modal después de confirmar
    }
  };

  const handleRejectOrder = () => {
    if (selectedNotification) {
      Toast.show({
        type: 'error',
        text1: 'Pedido rechazado',
        text2: `Mesa ${selectedNotification.tableNumber} ha rechazado el pedido.`,
      });

      socket.emit('order_rejected_kitchen', {
        orderId: selectedNotification.id,
        tableNumber: selectedNotification.tableNumber,
        status: 'rejected',
      });

      // Actualizar la notificación para agregar el símbolo de "X"
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === selectedNotification.id
            ? { ...notification, isRejected: true }
            : notification
        )
      );

      setModalVisible(false); // Cerrar el modal después de rechazar
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
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
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones de Cocina</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Cerrar el modal
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedNotification && (
              <>
                <Text style={styles.modalTitle}>Confirmar o Rechazar Pedido</Text>
                <Text style={styles.modalText}>Mesa: {selectedNotification.tableNumber}</Text>
                <Text style={styles.modalText}>Items: {selectedNotification.items}</Text>

                <View style={styles.modalButtonContainer}>
                  <Button title="Confirmar" onPress={handleConfirmOrder} color="#28a745" />
                  <Button title="Rechazar" onPress={handleRejectOrder} color="#dc3545" />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Toast />
      <KitchenBottomBar />
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
    backgroundColor: '#f0f8ff',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo transparente
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default KitchenNotificationsScreen;
