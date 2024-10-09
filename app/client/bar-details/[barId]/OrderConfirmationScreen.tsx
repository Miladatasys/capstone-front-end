import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const OrderConfirmationScreen: React.FC = () => {
  const router = useRouter();
  const { paymentMethod } = useLocalSearchParams();

  // Lógica para volver a la pantalla principal
  const handleGoHome = () => {
    router.push('/client/recommendations/RecommendationsScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>¡Gracias por tu Pedido!</Text>
      <Text style={styles.message}>
        Tu pedido ha sido confirmado y se está procesando.{' '}
      </Text>
      <Text style={styles.paymentDetails}>
        Método de Pago: {paymentMethod ? paymentMethod : 'Desconocido'}
      </Text>

      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
        <Text style={styles.homeButtonText}>Volver a Inicio</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
    marginBottom: 40,
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

export default OrderConfirmationScreen;
