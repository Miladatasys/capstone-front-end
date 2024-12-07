import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@env';

interface Order {
  id: string;
  table: string;
  items: { name: string; price: number; quantity: number; id_prod: string }[];
  total: number;
  status: string;
  customer: string;
}

export default function BarOrderDetails() {
  const { tableNumber } = useLocalSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bar/queue`);
        const orders = response.data.filter(
          (order: any) => order.tableNumber === tableNumber
        );

        if (orders.length > 0) {
          const items = orders.map((product: any) => ({
            id_prod: product.id,
            name: product.product_name,
            price: parseFloat(product.unit_price),
            quantity: product.quantity,
          }));

          setOrder({
            id: tableNumber as string,
            table: tableNumber as string,
            items: items,
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: 'pending',
            customer: 'Desconocido', // Puedes ajustar esto según los datos disponibles
          });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [tableNumber]);

  const handleConfirmOrder = async () => {
    const barQueueIds = order?.items.map((item) => item.id_prod);

    try {
      await axios.put(`${API_URL}/api/bar/confirm`, {
        barQueue_ids: barQueueIds,
      });

      Alert.alert('Éxito', 'El pedido ha sido confirmado.');
      router.push('/bar/orders');
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const handleRejectOrder = async () => {
    const barQueueIds = order?.items.map((item) => item.id_prod);

    try {
      await axios.put(`${API_URL}/api/bar/reject`, {
        barQueue_ids: barQueueIds,
      });

      Alert.alert('Pedido Rechazado', 'El pedido ha sido rechazado.');
      router.push('/bar/orders');
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Detalles del Pedido</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.orderInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="restaurant" size={20} color="#666" />
          <Text style={styles.infoText}>Mesa: {order.table}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="person" size={20} color="#666" />
          <Text style={styles.infoText}>Cliente: {order.customer}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="pricetag" size={20} color="#666" />
          <Text style={styles.infoText}>Total: ${order.total.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Productos</Text>
      <FlatList
        data={order?.items}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
            </View>
            <View style={styles.quantityBox}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>
          </View>
        )}
        style={styles.itemList}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.rejectButton} onPress={handleRejectOrder}>
          <Text style={styles.buttonText}>Rechazar Pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={styles.buttonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  orderInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemList: {
    flex: 1,
  },
  itemBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityBox: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});