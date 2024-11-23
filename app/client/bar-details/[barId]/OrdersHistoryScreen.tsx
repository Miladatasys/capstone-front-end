import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@env';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

const ITEMS_PER_PAGE = 10;

const convertToCLP = (usdAmount: number) => {
  const exchangeRate = 800;
  return Math.round(usdAmount * exchangeRate);
};

const OrdersHistoryScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { barId } = useLocalSearchParams();

  useEffect(() => {
    fetchOrders();
  }, [barId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/history/${barId}`);
      console.log('Orders from backend:', response.data.orders);
  
      // Mapear los datos para que coincidan con la interfaz Order
      const mappedOrders = response.data.orders.map((order: any) => ({
        id: order.ordertotal_id.toString(),
        date: order.creation_date,
        total: parseFloat(order.total),
        status: order.status,
        items: order.products.map((product: any) => ({
          name: product.product_name,
          quantity: product.quantity,
          price: parseFloat(product.unit_price),
        })),
      }));
  
      setOrders(mappedOrders.reverse());
    } catch (error) {
      console.error('Error al obtener los pedidos del backend:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar los pedidos del backend.',
      });
    } finally {
      setLoading(false);
    }
  };
  

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.orderTotal}>Total: ${convertToCLP(item.total).toLocaleString()} </Text>
      <Text style={styles.orderTime}>{new Date(item.date).toLocaleTimeString()}</Text>
      <Text style={styles.orderItems}>
        {item.items ? item.items.map(i => `${i.quantity}x ${i.name}`).join(', ') : 'No items'}
      </Text>
    </View>
  );

  const paginatedOrders = orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const addTestOrders = async () => {
    const testOrders = [
      {
        id: '1',
        date: new Date().toISOString(),
        total: 20000,
        status: 'completado',
        items: [{ name: 'Cerveza', quantity: 2, price: 4000 }, { name: 'Nachos', quantity: 1, price: 12000 }]
      },
      {
        id: '2',
        date: new Date(Date.now() - 86400000).toISOString(),
        total: 15000,
        status: 'completado',
        items: [{ name: 'Margarita', quantity: 1, price: 7000 }, { name: 'Tacos', quantity: 2, price: 4000 }]
      }
    ];
  
    await AsyncStorage.setItem(`orders_${barId}`, JSON.stringify(testOrders));
    console.log('Test orders added');
    fetchOrders();
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2B2D42" />
        </TouchableOpacity>
        <Text style={styles.title}>Historial de Pedidos</Text>
      </View>
      {orders.length > 0 ? (
        <>
          <FlatList
            data={paginatedOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
              onPress={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Ionicons name="chevron-back" size={24} color={currentPage === 1 ? "#ccc" : "#2B2D42"} />
            </TouchableOpacity>
            <Text style={styles.paginationText}>{`Página ${currentPage} de ${totalPages}`}</Text>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
              onPress={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Ionicons name="chevron-forward" size={24} color={currentPage === totalPages ? "#ccc" : "#2B2D42"} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View>
          <Text style={styles.noOrdersText}>No hay pedidos anteriores para este bar.</Text>
          <TouchableOpacity style={styles.testButton} onPress={addTestOrders}>
            <Text style={styles.testButtonText}>Agregar pedidos de prueba</Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B2D42',
    flex: 1,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  orderTotal: {
    fontSize: 18,
    color: '#2B2D42',
    fontWeight: '600',
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noOrdersText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  paginationButton: {
    padding: 10,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 16,
    color: '#2B2D42',
  },
  testButton: {
    backgroundColor: '#2B2D42',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersHistoryScreen;

