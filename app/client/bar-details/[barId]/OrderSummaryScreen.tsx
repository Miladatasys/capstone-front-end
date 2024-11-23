import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  originalQuantity?: number;
  available: boolean;
}

interface Order {
  id: string;
  products: Product[];
  orderTime: string;
  total: number;
}

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { products: productsParam, table_id, bar_id, user_id, group_id, userName } = useLocalSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (typeof productsParam === 'string') {
      try {
        const parsedOrders = JSON.parse(productsParam);
        if (Array.isArray(parsedOrders)) {
          const ordersWithIds = parsedOrders.map((order, index) => ({
            ...order,
            id: `order-${index}-${Date.now()}`,
            products: order.products.map(product => ({
              ...product,
              id: product.id || `product-${Date.now()}-${Math.random()}`
            }))
          }));
          setOrders(ordersWithIds);
          calculateTotal(ordersWithIds);
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
  }, [productsParam]);

  const calculateTotal = useCallback((orders: Order[]) => {
    const totalValue = orders.reduce((acc, order) => acc + order.total, 0);
    setTotal(totalValue);
  }, []);

  const handleConfirmOrder = async () => {
    try {
      await AsyncStorage.setItem(`pendingOrders_${bar_id}_${table_id}`, JSON.stringify(orders));
    
      Toast.show({
        type: 'success',
        text1: 'Pedido Confirmado',
        text2: 'Procediendo al pago...',
      });

      await cleanOrders();

      router.push({
        pathname: `/client/bar-details/${bar_id}/PaymentMethodScreen`,
        params: {
          total,
          bar_id,
          table_id,
        },
      });
    } catch (error) {
      console.error('Error saving pending orders:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo procesar el pedido. Por favor, inténtelo de nuevo.',
      });
    }
  };

  const handleContinueOrdering = () => {
    router.push(`/client/bar-details/${bar_id}?user_id=${user_id}&table_id=${table_id}&bar_id=${bar_id}&group_id=${group_id}`);
  };

  const cleanOrders = async () => {
    try {
      await AsyncStorage.removeItem(`pendingOrders_${bar_id}_${table_id}`);
      await AsyncStorage.removeItem(`existingOrders_${bar_id}_${table_id}`);
      setOrders([]);
      setTotal(0);
      Toast.show({
        type: 'success',
        text1: 'Pedido limpio',
        text2: 'Se han eliminado todas las comandas pendientes.',
      });
    } catch (error) {
      console.error('Error cleaning orders:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron limpiar las comandas. Por favor, inténtelo de nuevo.',
      });
    }
  };

  const renderProductItem = useCallback(({ item: product }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price.toLocaleString()}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantity}>{product.quantity}</Text>
        <Ionicons 
          name={product.available ? "checkmark-circle" : "close-circle"} 
          size={20} 
          color={product.available ? "#4CAF50" : "#F44336"} 
        />
      </View>
    </View>
  ), []);

  const renderOrderItem = useCallback(({ item: order }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderInfoText}>Hora del pedido: {order.orderTime}</Text>
      </View>
      <FlatList
        data={order.products}
        renderItem={renderProductItem}
        keyExtractor={(product) => `${order.id}-${product.id}`}
        extraData={order.id}
      />
      <Text style={styles.orderTotal}>Total de la comanda: ${order.total.toLocaleString()}</Text>
    </View>
  ), [renderProductItem]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Resumen de Pedido</Text>
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(order) => order.id}
          extraData={orders}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.totalBar}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
        </View>
        <View style={styles.buttonBar}>
          <Pressable style={[styles.button, styles.continueButton]} onPress={handleContinueOrdering}>
            <Text style={styles.buttonText}>Seguir pidiendo</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.confirmButton]} onPress={handleConfirmOrder}>
            <Text style={styles.buttonText}>Pagar</Text>
          </Pressable>
        </View>
      </View>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginVertical: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  orderContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  orderInfoText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginTop: 16,
    textAlign: 'right',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  continueButton: {
    backgroundColor: '#0077b6',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
