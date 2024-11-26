import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

interface OrderProduct {
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

interface Order {
  id: string;
  table: string;
  items: OrderProduct[];
  total: number;
  status: 'Pendiente' | 'En preparación' | 'Listo' | 'Entregado';
  customer: string;
  timestamp: string;
}

export default function KitchenOrderDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const simulatedOrder: Order = {
      id: id as string,
      table: 'Mesa 3',
      items: [
        { name: 'Pizza Margherita', price: 8500, quantity: 1, specialInstructions: 'Sin cebolla' },
        { name: 'Ensalada César', price: 5500, quantity: 2 },
        { name: 'Pasta Carbonara', price: 9000, quantity: 1 },
      ],
      total: 28500,
      status: 'Pendiente',
      customer: 'Mesa 3',
      timestamp: new Date().toISOString(),
    };

    setOrder(simulatedOrder);
  }, [id]);

  const handleRejectOrder = () => {
    Alert.alert('Confirmación', '¿Rechazar este pedido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: () => {
          Toast.show({
            type: 'success',
            text1: 'Pedido rechazado',
            text2: 'El pedido ha sido rechazado.',
          });
          // Aquí iría la lógica para actualizar el estado del pedido
          router.push('/Kitchen/Orders/KitchenOrders');
        },
      },
    ]);
  };

  const handleFinishCooking = () => {
    Alert.alert('Confirmación', '¿Confirmar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: () => {
          Toast.show({
            type: 'success',
            text1: 'Pedido Confirmado',
            text2: 'El pedido ha sido marcado como listo para servir.',
          });
          router.push('/Kitchen/Orders/KitchenOrders');
        },
      },
    ]);
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Kitchen/Orders/KitchenOrders')}>
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
        <View style={styles.infoItem}>
          <Ionicons name="time" size={20} color="#666" />
          <Text style={styles.infoText}>Hora: {new Date(order.timestamp).toLocaleTimeString()}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Productos</Text>
      <FlatList
        data={order.items}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
              {item.specialInstructions && (
                <Text style={styles.specialInstructions}>Instrucciones: {item.specialInstructions}</Text>
              )}
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
        <TouchableOpacity style={styles.finishButton} onPress={handleFinishCooking}>
          <Text style={styles.buttonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
      <Toast />
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
  specialInstructions: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 4,
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
  finishButton: {
    backgroundColor: '#2196F3',
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

