import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@env';
interface SavedCard {
  id: string;
  lastDigits: string;
  cardHolder: string;
}

export default function PaymentMethodScreen() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const router = useRouter();
  const { total, bar_id, table_id, creator_user_id, user_id, orderTotal_id } = useLocalSearchParams();

  useEffect(() => {
    if (creator_user_id !== user_id) {
      Toast.show({
        type: 'error',
        text1: 'Acceso Denegado',
        text2: 'Solo el creador del pedido puede seleccionar el método de pago.',
      });
      router.back();
    }
  }, [total, bar_id, table_id, creator_user_id, orderTotal_id]);

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const savedCardsJson = await AsyncStorage.getItem('savedCards');
        if (savedCardsJson) {
          setSavedCards(JSON.parse(savedCardsJson));
        } else {
          // Mock data for demonstration
          const mockCards = [
            { id: '1', lastDigits: '1234', cardHolder: 'Juan Pérez' },
            { id: '2', lastDigits: '5678', cardHolder: 'Ana Gómez' },
          ];
          await AsyncStorage.setItem('savedCards', JSON.stringify(mockCards));
          setSavedCards(mockCards);
        }
      } catch (error) {
        console.error('Error fetching saved cards:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudieron cargar las tarjetas guardadas.',
        });
      }
    };

    fetchSavedCards();
  }, []);

  const handleConfirmPaymentMethod = async () => {
    console.log('Confirming payment method');
    if (!selectedMethod) {
      Toast.show({
        type: 'info',
        text1: 'Método de Pago no Seleccionado',
        text2: 'Por favor, selecciona un método de pago para continuar.',
        position: 'bottom',
      });
      return;
    }

    try {
      console.log('Sending payment request to backend');
      const response = await axios.post(`${API_URL}/api/payments/${orderTotal_id}/pay`, {
        user_id,
        payment_method: selectedMethod,
        amounts: [total], // Assuming a single payment for the total amount
      });

      console.log('Payment response:', response.data);

      const { paymentId, orderStatus } = response.data;

      console.log('Payment ID:', paymentId);
      console.log('Order Total ID:', orderTotal_id);

      Toast.show({
        type: 'success',
        text1: 'Pago Exitoso',
        text2: `El pago ha sido registrado. Estado del pedido: ${orderStatus}`,
      });

      router.push({
        pathname: `/client/bar-details/${bar_id}/OrderConfirmationScreen`,
        params: {
          paymentMethod: selectedMethod,
          total,
          bar_id,
          table_id,
          paymentId,
          orderTotal_id
        },
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo confirmar el método de pago. Inténtalo nuevamente.',
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2B2D42" />
        </TouchableOpacity>
        <Text style={styles.title}>Selecciona un Método de Pago</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total a pagar: ${Number(total).toLocaleString()}</Text>
        </View>

        <View style={styles.confirmContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPaymentMethod}>
            <Text style={styles.confirmButtonText}>Confirmar Método de Pago</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B2D42',
    flex: 1,
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
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
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

