import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const OrderSummaryScreen: React.FC = () => {
  const router = useRouter();
  const { products: productsParam } = useLocalSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  useEffect(() => {
    // Parse the products param to get the list of products
    if (typeof productsParam === 'string') {
      try {
        const parsedProducts = JSON.parse(productsParam);
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
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
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El parámetro de productos no es válido o está vacío.',
      });
    }
  }, [productsParam]);

  useEffect(() => {
    calculateTotal();
  }, [products]);

  const calculateTotal = () => {
    const totalValue = products.reduce((total, product) => total + product.price * product.quantity, 0);
    setTotal(totalValue);
  };

  const handleConfirmPayment = () => {
    if (products.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Sin productos',
        text2: 'No hay productos seleccionados para pagar.',
      });
      return;
    }

    // Mostrar Toast y cambiar el estado de procesamiento
    Toast.show({
      type: 'success',
      text1: 'Pedido Confirmado',
      text2: 'Tu pago está siendo procesado...',
    });

    setIsProcessingPayment(true);

    // Simulamos el proceso de pago con un retraso de 3 segundos
    setTimeout(() => {
      setIsProcessingPayment(false);
      router.push('/client/bar-details/[barId]/OrderConfirmationScreen');
    }, 3000);

    // Comentario para la integración con el backend:
    // Aquí deberíamos hacer una solicitud POST al backend para confirmar el pedido.
    // Ejemplo:
    // axios.post('https://mi-backend.com/api/orders', { products })
    //   .then(response => {
    //     console.log('Pedido registrado:', response.data);
    //     router.push('/client/bar-details/[barId]/OrderConfirmationScreen');
    //   })
    //   .catch(error => {
    //     setIsProcessingPayment(false);
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Error al procesar el pedido',
    //       text2: 'Hubo un problema al confirmar tu pedido. Inténtalo nuevamente.',
    //     });
    //   });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resumen del Pedido</Text>

      {isProcessingPayment ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EF233C" />
          <Text style={styles.loadingText}>Procesando tu pago...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetails}>
                  C/U ${item.price.toLocaleString()} x {item.quantity.toString().padStart(2, '0')} unidades
                </Text>
                <Text style={styles.subtotal}>
                  Subtotal: ${(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />

          <View style={styles.summary}>
            <Text style={styles.totalText}>Total: ${total.toLocaleString()}</Text>
            <Pressable
              style={({ pressed }) => [styles.confirmButton, pressed && styles.confirmButtonPressed]}
              onPress={handleConfirmPayment}
            >
              <Text style={styles.confirmButtonText}>Confirmar y Pagar</Text>
            </Pressable>
          </View>
        </>
      )}

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#2B2D42',
  },
  list: {
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  productDetails: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginTop: 4,
  },
  summary: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonPressed: {
    backgroundColor: '#C71F33',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    color: '#2B2D42',
  },
});

export default OrderSummaryScreen;
