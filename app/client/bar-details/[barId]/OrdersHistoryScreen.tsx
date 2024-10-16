import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  barId: string;
}

const OrdersHistoryScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const { barId } = useLocalSearchParams();

  useEffect(() => {
    // Datos simulados mientras no esté disponible el backend
    const simulatedOrders = [
      { id: '1', barId: '1', date: '2024-09-29', total: 15000, status: 'Completado' },
      { id: '2', barId: '1', date: '2024-09-25', total: 10000, status: 'Cancelado' },
      { id: '3', barId: '1', date: '2024-09-20', total: 12000, status: 'En preparación' },
    ];
  
    setOrders(simulatedOrders);
  
    console.log('Orders:', simulatedOrders);  // <-- Esto es para verificar que los datos están siendo cargados
  }, [barId]);
  
  console.log('Bar ID:', barId);  // <-- Verifica si el barId está correcto


    // TODO: Integración con el backend
    /*
    axios.get(https://mi-backend.com/api/orders/history?barId=${barId})
      .then(response => {
        setOrders(response.data.orders);
      })
      .catch(error => {
        console.error('Error al obtener el historial de pedidos:', error);
      });
    */

  const handleSelectOrder = (orderId: string) => {
    // Redirigir a la pantalla de detalles del pedido
    router.push({
      pathname: `/client/bar-details/${barId}/OrderDetailScreen`,
      params: { orderId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Historial de Pedidos</Text>
      <FlatList
  data={orders}  // Muestra todos los pedidos sin filtrar
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleSelectOrder(item.id)}
    >
      <Text style={styles.orderDate}>Fecha: {item.date}</Text>
      <Text style={styles.orderTotal}>Total: ${item.total.toLocaleString()}</Text>
      <Text style={styles.orderStatus}>Estado: {item.status}</Text>
    </TouchableOpacity>
  )}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.list}
/>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  orderTotal: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  orderStatus: {
    fontSize: 16,
    color: '#888',
  },
});

export default OrdersHistoryScreen;