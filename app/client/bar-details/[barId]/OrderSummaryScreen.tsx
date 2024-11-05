import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios'; // Descomentar cuando se vaya a usar con el backend
// import { API_URL } from '@env'; // Descomentar cuando se vaya a usar con el backend

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number; // cantidad disponible actualmente
  originalQuantity?: number; // cantidad solicitada originalmente por el cliente
  available: boolean;
}

const OrderSummaryScreen: React.FC = () => {
  const router = useRouter();
  const { products: productsParam, table_id } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [originalTotal, setOriginalTotal] = useState<number | null>(null);

  useEffect(() => {
    // Comentar este bloque cuando se vaya a usar el backend
    if (typeof productsParam === 'string') {
      try {
        const parsedProducts = JSON.parse(productsParam);
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
          calculateOriginalTotal(parsedProducts);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'El formato de los productos no es válido.',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `No se pudieron cargar los productos correctamente. ${error.message}`,
        });
      }
    }

    // Código para obtener productos desde el backend (descomentar para habilitar)
    /*
    const fetchOrderDetails = async () => {
      try {
        console.log("Obteniendo detalles del pedido para la mesa con id:", table_id);
        const response = await axios.get(`${API_URL}/api/orders/${table_id}`);
        const orderDetails = response.data;
        setProducts(orderDetails.products);
        calculateOriginalTotal(orderDetails.products);
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
        Toast.show({
          type: 'error',
          text1: 'Error al obtener detalles del pedido',
          text2: 'No se pudieron cargar los detalles del pedido desde el backend.',
        });
      }
    };

    fetchOrderDetails();
    */
  }, [productsParam, table_id]);

  useEffect(() => {
    calculateTotal();
  }, [products]);

  const calculateOriginalTotal = (products: Product[]) => {
    const totalValue = products.reduce((total, product) => total + product.price * (product.originalQuantity || product.quantity), 0);
    setOriginalTotal(totalValue);
  };

  const calculateTotal = () => {
    const totalValue = products.reduce((total, product) => total + product.price * product.quantity, 0);
    setTotal(totalValue);
  };

  const handleConfirmOrder = () => {
    Toast.show({
      type: 'success',
      text1: 'Pedido Confirmado',
      text2: 'Procediendo al pago...',
    });
    router.push(`/client/bar-details/[barId]/PaymentMethodScreen`);
  };

  const handleCancelOrder = () => {
    Toast.show({
      type: 'info',
      text1: 'Pedido Cancelado',
      text2: 'Has cancelado el pedido.',
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resumen del Pedido</Text>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>C/U ${item.price.toLocaleString()}</Text>
              <View style={styles.row}>
                {/* Mostrar "Antes" y "Después" si falta cantidad o está marcado como no disponible */}
                {(!item.available || item.quantity < (item.originalQuantity || 0)) ? (
                  <>
                    <View style={[styles.column, styles.alignLeft]}>
                      <Text style={styles.columnTitle}>Antes</Text>
                      <Text style={styles.strikeThrough}>
                        {item.originalQuantity} unidades
                      </Text>
                      <Text style={styles.strikeThrough}>
                        Subtotal: ${(item.price * item.originalQuantity!).toLocaleString()}
                      </Text>
                    </View>
                    <View style={[styles.column, styles.alignRight]}>
                      <Text style={styles.columnTitle}>Después</Text>
                      <Text>
                        {item.quantity} unidades
                      </Text>
                      <Text>
                        Subtotal: ${(item.price * item.quantity).toLocaleString()}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={[styles.column, styles.alignRight]}>
                    <Text>{item.quantity} unidades</Text>
                    <Text>Subtotal: ${(item.price * item.quantity).toLocaleString()}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.productIcon}>
              <Ionicons name={item.available ? "checkmark-circle" : "close-circle"} size={24} color={item.available ? "green" : "red"} />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.row}>
          <View style={[styles.column, styles.alignLeft]}>
            <Text style={styles.totalText}>
              <Text style={styles.strikeThrough}>Total: ${originalTotal?.toLocaleString()}</Text>
            </Text>
          </View>
          <View style={[styles.column, styles.alignRight]}>
            <Text style={styles.totalText}>Total: ${total.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.confirmButton} onPress={handleConfirmOrder}>
            <Text style={styles.confirmButtonText}>Aceptar</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={handleCancelOrder}>
            <Text style={styles.cancelButtonText}>Modificar</Text>
          </Pressable>
        </View>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginVertical: 20,
    textAlign: 'center',
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  column: {
    flex: 1,
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    color: '#C71F33',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#888',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderSummaryScreen;
