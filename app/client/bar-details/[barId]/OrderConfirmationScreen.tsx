import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

const OrderConfirmationScreen: React.FC = () => {
  const router = useRouter();
  const { paymentMethod, barId, total } = useLocalSearchParams();

  // Lógica para volver a la pantalla principal y confirmar el pedido
  const handleGoHome = () => {
    router.push(`/client/bar-details/${barId}`);
  };
  
    // Aquí comentarías la integración con axios hasta que el backend esté listo
    /*
    axios.post('https://tu-backend.com/api/orders/confirm', {
      paymentMethod: paymentMethod || 'Desconocido',
      id_mesa: barId, // ID de la mesa
      total: total, // Total del pedido
      // Otros campos que podrían ser necesarios
      // id_cliente: clienteId, // Si tienes autenticación en el app
      // detalles_pedido: productos, // Si tienes los productos del pedido
    })
    .then(response => {
      console.log('Pedido confirmado:', response.data);
      // Redirigir a la pantalla de confirmación del pedido exitoso
      router.push(`/client/bar-details/${barId}/OrderConfirmationScreen`);
    })
    .catch(error => {
      console.error('Error al confirmar el pedido:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo confirmar tu pedido. Inténtalo nuevamente.',
      });
    });
    */
    
    // Por ahora, simplemente navegas de regreso a la pantalla de inicio
    //router.push(`/client/bar-details/index`);
  //};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>¡Gracias por tu Pedido!</Text>
      <Text style={styles.message}>
        Tu pedido ha sido confirmado y se está procesando.
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
