import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import BarBottomBar from '../../../components/Bar/BottomBar/BarBottomBar';

// Definimos la interfaz para los productos del pedido
interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: string;
  tableNumber: string;
  products: OrderProduct[];
  total: number;
}

const OrderDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Obtenemos el ID del pedido desde los parámetros
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

  useEffect(() => {
    // Aquí iría la lógica para obtener el detalle del pedido del backend
    const fetchOrderDetail = async () => {
      try {
        // Simulación de datos para el pedido
        const simulatedOrderDetail: OrderDetail = {
          id: '1',
          tableNumber: '3',
          products: [
            { productId: '1', name: 'Cerveza Artesanal', quantity: 2, price: 3500 },
            { productId: '2', name: 'Pizza Margherita', quantity: 1, price: 8500 },
          ],
          total: 10500,
        };
        setOrderDetail(simulatedOrderDetail);
      } catch (error) {
        console.error('Error fetching order detail:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo cargar el detalle del pedido.',
        });
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (!orderDetail) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando detalles del pedido...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón de Volver en la parte superior izquierda */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/bar/orders/Orders')}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Detalles del Pedido</Text>
      <Text style={styles.tableText}>Mesa: {orderDetail.tableNumber}</Text>
      <View style={styles.divider} />
      <FlatList
        data={orderDetail.products}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
            <Text style={styles.productPrice}>Precio: ${item.price.toLocaleString()}</Text>
          </View>
        )}
      />
      <View style={styles.divider} />
      <Text style={styles.totalText}>Total: ${orderDetail.total.toLocaleString()}</Text>
      
      <BarBottomBar />
      <Toast />
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
    marginTop: 50,
  },
  tableText: {
    fontSize: 18,
    marginBottom: 8,
  },
  productItem: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
  },
  productPrice: {
    fontSize: 14,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E5E1',
    marginVertical: 8,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingVertical: 5, // Aumentar padding vertical
    paddingHorizontal: 15, // Aumentar padding horizontal
    backgroundColor: '#EF233C',
    borderRadius: 5,
    elevation: 2,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16, // Aumentar tamaño de la fuente
    fontWeight: 'bold',
  },
});

export default OrderDetail;
