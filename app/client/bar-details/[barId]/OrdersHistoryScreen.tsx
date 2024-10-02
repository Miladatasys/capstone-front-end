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
    setOrders([
      { id: '1', barId: '1', date: '2024-09-29', total: 15000, status: 'Completado' },
      { id: '2', barId: '1', date: '2024-09-25', total: 10000, status: 'Cancelado' },
      { id: '3', barId: '1', date: '2024-09-20', total: 12000, status: 'En preparación' },
    ]);

    // TODO: Integración con el backend
    /*
    axios.get(`https://mi-backend.com/api/orders/history?barId=${barId}`)
      .then(response => {
        setOrders(response.data.orders);
      })
      .catch(error => {
        console.error('Error al obtener el historial de pedidos:', error);
      });
    */
  }, [barId]);

  const handleSelectOrder = (orderId: string) => {
    // Podríamos mostrar más detalles del pedido seleccionado
    console.log(`Pedido seleccionado: ${orderId}`);
    // Aquí podríamos redirigir a una pantalla de detalles específicos del pedido si lo deseamos
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Historial de Pedidos</Text>
      <FlatList
        data={orders.filter(order => order.barId === barId)} // Filtra por el bar actual
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
