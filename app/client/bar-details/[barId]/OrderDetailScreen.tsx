import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetailScreenProps {
  id: string;
  date: string;
  total: number;
  status: string;
  products: Product[];
}

const OrderDetailScreen: React.FC = () => {
  const { orderId, barId } = useLocalSearchParams(); // Obtén el id del pedido desde los parámetros de ruta
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetailScreenProps | null>(null);

  useEffect(() => {
    // Datos simulados hasta tener el backend
    setOrder({
      id: orderId as string,
      date: '2024-09-29',
      total: 15000,
      status: 'Completado',
      products: [
        { id: '1', name: 'Cerveza Artesanal', quantity: 2, price: 3500 },
        { id: '2', name: 'Pisco Sour', quantity: 1, price: 4000 },
      ],
    });

    // TODO: Integración con el backend
    /*
    axios.get(`https://mi-backend.com/api/orders/${orderId}`)
      .then(response => {
        setOrder(response.data.order);
      })
      .catch(error => {
        console.error('Error al obtener el detalle del pedido:', error);
      });
    */
  }, [orderId]);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando detalles del pedido...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Detalles del Pedido</Text>
      <Text>Fecha: {order.date}</Text>
      <Text>Total: ${order.total.toLocaleString()}</Text>
      <Text>Estado: {order.status}</Text>

      <Text style={styles.subTitle}>Productos:</Text>
      <FlatList
        data={order.products}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>Cantidad: {item.quantity}</Text>
            <Text>Precio: ${item.price.toLocaleString()}</Text>
            <Text>Subtotal: ${(item.price * item.quantity).toLocaleString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Botón para volver al historial con el estilo actualizado */}
      <TouchableOpacity style={styles.confirmButton} onPress={() => router.back()}>
        <Text style={styles.confirmButtonText}>Volver al Historial</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginTop: 10,
    marginBottom: 5,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  list: {
    paddingBottom: 100,
  },
  // Estilo del botón actualizado para que coincida con confirmButton
  confirmButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default OrderDetailScreen;
