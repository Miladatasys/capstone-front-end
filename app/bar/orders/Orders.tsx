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

  // Verificar si el pedido está disponible antes de renderizar
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
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  orderInfo: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemList: {
    marginBottom: 20,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  itemInfo: {
    flexDirection: 'column',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectButton: {
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    padding: 15,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
