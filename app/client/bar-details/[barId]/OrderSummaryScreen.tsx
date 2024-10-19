import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons'; // Importamos Ionicons para usar íconos

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  available: boolean; // Indicamos si el producto está disponible o no
}

const OrderSummaryScreen: React.FC = () => {
  const router = useRouter();
  const { products: productsParam } = useLocalSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    // Parseamos los productos recibidos desde la pantalla anterior
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

  // Simulamos el tiempo de confirmación del pedido
  useEffect(() => {
    setTimeout(() => {
      const orderConfirmed = Math.random() > 0.5; // 50% de posibilidades de confirmar el pedido
      setIsOrderConfirmed(orderConfirmed);
      setIsLoading(false);
    }, 5000); // Esperamos 5 segundos para simular el proceso
  }, []);

  const calculateTotal = () => {
    const totalValue = products.reduce((total, product) => total + product.price * product.quantity, 0);
    setTotal(totalValue);
  };

  const handleProceedToPayment = () => {
    router.push(`/client/bar-details/[barId]/PaymentMethodScreen`);
  };

  const handleModifyOrder = () => {
    router.back(); // Redirigimos de vuelta a la pantalla de detalles del bar para modificar el pedido
  };

  const handleAcceptInconvenience = () => {
    Toast.show({
      type: 'info',
      text1: 'Inconveniente aceptado',
      text2: 'Se procederá con el pedido modificado.',
    });
    handleProceedToPayment(); // Continuamos con el pago
  };

  const renderProductIcon = (available: boolean) => {
    return available ? (
      <Ionicons name="checkmark-circle" size={24} color="green" />
    ) : (
      <Ionicons name="close-circle" size={24} color="red" />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resumen del Pedido</Text>

      <FlatList
        data={products}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Resumen del Pedido</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDetails}>
                C/U ${item.price.toLocaleString()} x {item.quantity.toString().padStart(2, '0')} unidades
              </Text>
              <Text style={styles.subtotal}>
                Subtotal: ${(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
            {/* Icono verde o rojo según la disponibilidad */}
            <View style={styles.productIcon}>{renderProductIcon(item.available)}</View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <>
            <View style={styles.summary}>
              <Text style={styles.totalText}>Total: ${total.toLocaleString()}</Text>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#EF233C" />
                <Text style={styles.loadingText}>Esperando confirmación del local...</Text>
                <Image
                  source={{ uri: 'https://i.gifer.com/YCZH.gif' }} // Ejemplo de animación GIF de carga
                  style={styles.loadingIcon}
                />
              </View>
            ) : isOrderConfirmed ? (
              <View style={styles.confirmationContainer}>
                <Text style={styles.confirmationText}>✅ Pedido Confirmado!</Text>
                <Pressable
                  style={({ pressed }) => [styles.confirmButton, pressed && styles.confirmButtonPressed]}
                  onPress={handleProceedToPayment}
                >
                  <Ionicons name="cash" size={18} color="white" />
                  <Text style={styles.confirmButtonText}>Proceder al Pago</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.inconvenienceContainer}>
                <Text style={styles.inconvenienceText}>⚠️ Inconveniente con el Pedido</Text>
                <Text style={styles.inconvenienceDetail}>Algunos productos no están disponibles o hay un problema.</Text>
                <View style={styles.buttonRow}>
                  <Pressable
                    style={({ pressed }) => [styles.modifyButton, pressed && styles.modifyButtonPressed]}
                    onPress={handleModifyOrder}
                  >
                    <Ionicons name="arrow-back" size={18} color="white" />
                    <Text style={styles.modifyButtonText}>Modificar Pedido</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.acceptButton, pressed && styles.acceptButtonPressed]}
                    onPress={handleAcceptInconvenience}
                  >
                    <Ionicons name="checkmark" size={18} color="white" />
                    <Text style={styles.acceptButtonText}>Aceptar y Continuar</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </>
        }
      />

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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  productInfo: {
    flex: 1,
  },
  productIcon: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 15, // Mover un poco arriba
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 15,
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
  loadingIcon: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  confirmationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row', // Mostrar ícono y texto juntos
    marginBottom: 20, // Añadir margen inferior
  },
  confirmButtonPressed: {
    backgroundColor: '#C71F33',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8, // Espacio entre ícono y texto
  },
  inconvenienceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  inconvenienceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C71F33',
    marginBottom: 10,
  },
  inconvenienceDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20, // Añadir margen inferior
  },
  modifyButton: {
    backgroundColor: '#888',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1, // Ambos botones tienen el mismo tamaño
    justifyContent: 'center',
    marginRight: 10,
  },
  modifyButtonPressed: {
    backgroundColor: '#666',
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Espacio entre ícono y texto
  },
  acceptButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1, // Ambos botones tienen el mismo tamaño
    justifyContent: 'center',
  },
  acceptButtonPressed: {
    backgroundColor: '#C71F33',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Espacio entre ícono y texto
  },
});

export default OrderSummaryScreen;
