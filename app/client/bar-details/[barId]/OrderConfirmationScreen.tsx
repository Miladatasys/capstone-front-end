import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

const OrderConfirmationScreen: React.FC = () => {
  const router = useRouter();
  const { paymentMethod } = useLocalSearchParams();

  // Lógica para volver a la pantalla principal
  const handleGoHome = () => {
    router.push('/client/recommendations/RecommendationsScreen');
  };

  // Lógica para simular la confirmación de pedido y notificar al usuario
  // Aquí se realizaría la integración real con el backend
  React.useEffect(() => {
    // Simulamos una llamada al backend para confirmar el pedido
    Toast.show({
      type: 'success',
      text1: 'Pedido Confirmado',
      text2: 'Tu pedido ha sido registrado y está siendo procesado.',
      position: 'top',
    });

    // Comentario para la integración con el backend:
    // Cuando el usuario llega a esta pantalla, deberíamos realizar una solicitud POST al backend para confirmar el pedido.
    // axios.post('https://mi-backend.com/api/orders/confirm', {
    //     paymentMethod: paymentMethod, // Enviar el método de pago seleccionado
    //   })
    //   .then(response => {
    //     console.log('Pedido confirmado:', response.data);
    //     // Podemos guardar el estado del pedido o mostrar más detalles al usuario si es necesario
    //   })
    //   .catch(error => {
    //     console.error('Error al confirmar el pedido:', error);
    //     // Mostrar un mensaje de error al usuario si hay problemas con la confirmación del pedido
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Error',
    //       text2: 'Hubo un problema al confirmar tu pedido. Por favor, inténtalo de nuevo.',
    //       position: 'bottom',
    //     });
    //   });
  }, [paymentMethod]);

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

      {/* Mostrar Toast */}
      <Toast />
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
