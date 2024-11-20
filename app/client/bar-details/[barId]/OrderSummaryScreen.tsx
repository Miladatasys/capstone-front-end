import React, { useState, useEffect } from 'react';
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
  products: Product[];
  orderTime: string;
  total: number;
}

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { products: productsParam, table_id, bar_id, user_id, group_id, userName } = useLocalSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    if (typeof productsParam === 'string') {
      try {
        const parsedOrders = JSON.parse(productsParam);
        if (Array.isArray(parsedOrders)) {
          setOrders(parsedOrders);
          calculateTotal(parsedOrders);
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

  const calculateTotal = (orders: Order[]) => {
    const totalValue = orders.reduce((acc, order) => acc + order.total, 0);
    setTotal(totalValue);
  };

  const handleConfirmOrder = () => {
    Toast.show({
      type: 'success',
      text1: 'Pedido Confirmado',
      text2: 'Procediendo al pago...',
    });

    router.push({
      pathname: `/client/bar-details/${bar_id}/PaymentMethodScreen`,
      params: {
        paymentMethod: selectedMethod,
        total,
        bar_id,
        table_id,
      },
    });
  };

  const handleContinueOrdering = () => {
    router.push(`/client/bar-details/${bar_id}?user_id=${user_id}&table_id=${table_id}&bar_id=${bar_id}&group_id=${group_id}`);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderInfoText}>Hora del pedido: {item.orderTime}</Text>
      </View>
      <FlatList
        data={item.products}
        renderItem={({ item: product }) => (
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
        )}
        keyExtractor={(product) => product.id}
      />
      <Text style={styles.orderTotal}>Total de la comanda: ${item.total.toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Comandas</Text>
        
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => index.toString()}
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
  },
  continueButton: {
    backgroundColor: '#0077b6',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});