import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { paymentMethod, bar_id, table_id, total, user_id } = useLocalSearchParams();

  useEffect(() => {
    const completeOrder = async () => {
      try {
        // Obtener las órdenes pendientes
        const pendingOrdersString = await AsyncStorage.getItem(`pendingOrders_${bar_id}_${table_id}`);
        if (pendingOrdersString) {
          const pendingOrders = JSON.parse(pendingOrdersString);
          
          // Crear una nueva orden completada
          const completedOrder = {
            id: `order-${Date.now()}`,
            date: new Date().toISOString(),
            total: parseFloat(total as string),
            status: 'Completado',
            barId: bar_id,
            user_id: user_id,
          };

          // Obtener órdenes completadas existentes
          const existingCompletedOrdersString = await AsyncStorage.getItem(`completedOrders_${bar_id}`);
          const existingCompletedOrders = existingCompletedOrdersString 
            ? JSON.parse(existingCompletedOrdersString) 
            : [];

          // Añadir la nueva orden completada
          const updatedCompletedOrders = [...existingCompletedOrders, completedOrder];

          // Guardar las órdenes completadas actualizadas
          await AsyncStorage.setItem(`completedOrders_${bar_id}`, JSON.stringify(updatedCompletedOrders));

          // Limpiar las órdenes pendientes
          await AsyncStorage.removeItem(`pendingOrders_${bar_id}_${table_id}`);

          console.log('Orden completada y guardada en el historial');
        }
      } catch (error) {
        console.error('Error al completar la orden:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo completar el pedido.',
        });
      }
    };

    completeOrder();
  }, [bar_id, table_id, total]);

  const handleGoHome = () => {
    router.push({
      pathname: `/client/bar-details/${bar_id}`,
      params: { bar_id, table_id, clearCart: 'true', user_id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>¡Gracias por tu Pedido!</Text>
      <Text style={styles.message}>
        Tu pedido ha sido confirmado y se está procesando.
      </Text>
      <Text style={styles.paymentDetails}>
        Método de Pago: {paymentMethod || 'Desconocido'}
      </Text>
      <Text style={styles.paymentDetails}>
        Total Pagado: ${Number(total).toLocaleString()}
      </Text>

      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Text style={styles.homeButtonText}>Volver a Inicio</Text>
      </TouchableOpacity>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    color: '#2B2D42',
    textAlign: 'center',
    marginBottom: 15,
  },
  paymentDetails: {
    fontSize: 16,
    color: '#2B2D42',
    marginBottom: 10,
  },
  homeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 30,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});