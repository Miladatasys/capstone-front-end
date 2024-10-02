// PaymentMethodScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
// import axios from 'axios'; // Descomentar cuando el backend esté disponible

const PaymentMethodScreen: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [savedCards, setSavedCards] = useState([
    { id: '1', lastDigits: '1234', cardHolder: 'Juan Pérez' },
    { id: '2', lastDigits: '5678', cardHolder: 'Ana Gómez' },
  ]);
  const router = useRouter();

  useEffect(() => {
    // TODO: Integración con el backend para obtener tarjetas guardadas
    // Aquí deberíamos realizar una solicitud GET para obtener las tarjetas guardadas del usuario desde el backend.
    /*
    axios.get('https://mi-backend.com/api/user/saved-cards')
      .then(response => {
        setSavedCards(response.data.cards);
      })
      .catch(error => {
        console.error('Error al obtener las tarjetas guardadas:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudieron cargar las tarjetas guardadas.',
        });
      });
    */
  }, []);

  // Lógica para confirmar el método de pago seleccionado
  const handleConfirmPaymentMethod = () => {
    if (!selectedMethod) {
      Toast.show({
        type: 'info',
        text1: 'Método de Pago no Seleccionado',
        text2: 'Por favor, selecciona un método de pago para continuar.',
        position: 'bottom',
      });
      return;
    }

    // TODO: Integración con el backend para registrar el método de pago seleccionado
    /*
    axios.post('https://mi-backend.com/api/orders/payment-method', { paymentMethod: selectedMethod })
      .then(response => {
        console.log('Método de pago registrado:', response.data);
        // Redirigir a la pantalla de confirmación del pedido exitoso
        router.push({
          pathname: `/client/bar-details/[barId]/OrderConfirmationScreen`,
          params: {
            paymentMethod: selectedMethod,
          },
        });
      })
      .catch(error => {
        console.error('Error al registrar el método de pago:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo confirmar el método de pago. Inténtalo nuevamente.',
        });
      });
    */

    // Mock para simular el flujo mientras se realiza la integración
    Toast.show({
      type: 'success',
      text1: 'Método de Pago Seleccionado',
      text2: `El método de pago seleccionado es: ${selectedMethod}`,
    });

    router.push({
      pathname: `/client/bar-details/[barId]/OrderConfirmationScreen`,
      params: {
        paymentMethod: selectedMethod,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Selecciona un Método de Pago</Text>

      <Text style={styles.subTitle}>Tarjetas Guardadas</Text>
      {savedCards.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={[styles.paymentOption, selectedMethod === `Tarjeta ${card.lastDigits}` && styles.selectedOption]}
          onPress={() => setSelectedMethod(`Tarjeta ${card.lastDigits}`)}
        >
          <Text style={styles.paymentText}>**** **** **** {card.lastDigits} - {card.cardHolder}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subTitle}>Otros Métodos de Pago</Text>
      <TouchableOpacity
        style={[styles.paymentOption, selectedMethod === 'Tarjeta de Crédito' && styles.selectedOption]}
        onPress={() => setSelectedMethod('Tarjeta de Crédito')}
      >
        <Text style={styles.paymentText}>Tarjeta de Crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.paymentOption, selectedMethod === 'Tarjeta de Débito' && styles.selectedOption]}
        onPress={() => setSelectedMethod('Tarjeta de Débito')}
      >
        <Text style={styles.paymentText}>Tarjeta de Débito</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.paymentOption, selectedMethod === 'Efectivo' && styles.selectedOption]}
        onPress={() => setSelectedMethod('Efectivo')}
      >
        <Text style={styles.paymentText}>Efectivo</Text>
      </TouchableOpacity>

      <View style={styles.confirmContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPaymentMethod}>
          <Text style={styles.confirmButtonText}>Confirmar Método de Pago</Text>
        </TouchableOpacity>
      </View>

      <Toast />
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
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginTop: 20,
    marginBottom: 10,
  },
  paymentOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedOption: {
    borderColor: '#EF233C',
    borderWidth: 2,
  },
  paymentText: {
    fontSize: 18,
    color: '#2B2D42',
  },
  confirmContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentMethodScreen;
