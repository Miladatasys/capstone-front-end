import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import KitchenBottomBar from '../../../components/Kitchen/BottomBar/KitchenBottomBar';

interface Notification {
  id: string;
  tableNumber: string;
  items: string;
  total: number;
  action: string;
}

const KitchenNotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Simulación de notificaciones para la cocina
    setNotifications([
      { id: '1', tableNumber: '3', items: 'Pizza Margherita, Ensalada César', total: 15500, action: 'nuevo pedido' },
      { id: '2', tableNumber: '5', items: 'Pasta Carbonara, Sopa del día', total: 12000, action: 'modificación' }
    ]);

    // Aquí irá la integración con el backend
    /*
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('URL_DEL_BACKEND/api/kitchen/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching kitchen notifications:', error);
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

    setTimeout(() => {
      router.push(`/Kitchen/Orders/${notificationId}`);
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
          Acción: {item.action}
        </Text>
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
});

export default KitchenNotificationsScreen;

