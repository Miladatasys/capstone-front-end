import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import BottomNavBarDetails from '../../../../components/Navigation/BottomNavBarDetails';
import NotificationIcon from '../../../../components/Notification/NotificationIcon'; // Importar el nuevo componente
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
// import axios from 'axios'; // Descomentar cuando esté listo el backend

const BarDetailsScreen: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState<number>(0);
  const [hasNotification, setHasNotification] = useState(false); // Estado para manejar las notificaciones

  useEffect(() => {
    // Simulación de notificación por producto no disponible
    setTimeout(() => {
      setHasNotification(true); // Mostrar la notificación después de 5 segundos (simulación)
    }, 5000);

    // Datos simulados mientras no esté disponible el backend
    setProducts([
      { id: '1', name: 'Cerveza Artesanal', price: 3500, image: 'https://via.placeholder.com/80' },
      { id: '2', name: 'Pisco Sour', price: 4000, image: 'https://via.placeholder.com/80' },
      { id: '3', name: 'Vino Tinto', price: 5000, image: 'https://via.placeholder.com/80' },
    ]);

    // Inicializamos el estado de las cantidades con 0 para cada producto
    setQuantities({
      '1': 0,
      '2': 0,
      '3': 0,
    });

    // Aquí es donde llamaría al backend para obtener los productos disponibles de un bar
    /*
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`URL_DEL_BACKEND/api/bar/${barId}/products`);
        setProducts(response.data); // Actualiza los productos con los datos del backend
        // Inicializar cantidades de productos
        const initialQuantities = {};
        response.data.forEach((product) => {
          initialQuantities[product.id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching products from backend:', error);
      }
    };

    fetchProducts(); // Llama a la función cuando el componente se monta
    */
  }, []);

  const updateQuantity = (productId: string, increment: boolean) => {
    setQuantities((prevQuantities) => {
      const updatedQuantity = increment
        ? prevQuantities[productId] + 1
        : Math.max(prevQuantities[productId] - 1, 0);

      const product = products.find((item) => item.id === productId);
      const priceDifference = (updatedQuantity - prevQuantities[productId]) * product.price;
      setTotal((prevTotal) => prevTotal + priceDifference);

      return {
        ...prevQuantities,
        [productId]: updatedQuantity,
      };
    });
  };

  const handlePayPress = () => {
    const selectedProducts = products.filter(product => quantities[product.id] > 0).map(product => ({
      ...product,
      quantity: quantities[product.id],
    }));
  
    if (selectedProducts.length > 0) {
      const productsString = JSON.stringify(selectedProducts);

      // En esta parte puedo enviar los productos seleccionados al backend
      /*
      const sendOrder = async () => {
        try {
          await axios.post(`URL_DEL_BACKEND/api/orders`, {
            barId,
            tableNumber,  // Asegúrate de tener el número de mesa disponible
            products: selectedProducts,
          });
          router.push({
            pathname: `/client/bar-details/[barId]/OrderSummaryScreen`,
            params: { products: productsString },
          });
        } catch (error) {
          console.error('Error al enviar la orden al backend:', error);
          Toast.show({
            type: 'error',
            text1: 'Error al realizar el pedido',
            text2: 'No se pudo enviar el pedido, por favor intenta nuevamente.',
            position: 'bottom',
          });
        }
      };

      sendOrder(); // Llama a la función para enviar la orden
      */
      
      router.push({
        pathname: `/client/bar-details/[barId]/OrderSummaryScreen`,
        params: { products: productsString },
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'No hay productos seleccionados',
        text2: 'Por favor selecciona algún producto para continuar.',
        position: 'bottom',
      });
    }
  };

  const handleNotificationPress = () => {
    setHasNotification(false); // Desactivar la notificación después de presionarla

    // Aquí es donde llamaría al backend para actualizar el estado del pedido cuando el cliente gestiona un ítem no disponible
    /*
    const updateUnavailableItem = async () => {
      try {
        await axios.put(`URL_DEL_BACKEND/api/orders/${orderId}/unavailable-item`, {
          action: 'remove' || 'substitute', // Según la acción seleccionada por el cliente
        });
        router.push(`/client/bar-details/[barId]/manage-item`);
      } catch (error) {
        console.error('Error actualizando el estado del ítem no disponible:', error);
      }
    };

    updateUnavailableItem(); // Llama a la función para actualizar el estado
    */
    
    router.push(`/client/bar-details/[barId]/manage-item`); // Redirigir a la gestión de ítems
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Agregar el ícono de notificación en la parte superior */}
      <View style={styles.notificationContainer}>
        <NotificationIcon hasNotification={hasNotification} onPress={handleNotificationPress} />
      </View>

      <Text style={styles.title}>Productos del Bar</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>C/U ${item.price.toLocaleString()}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, false)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>
                  {quantities[item.id].toLocaleString('en-US', { minimumIntegerDigits: 2 })}
                </Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, true)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.subtotalContainer}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>
                <Text style={styles.subtotalAmount}>
                  ${ (quantities[item.id] * item.price).toLocaleString() }
                </Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.totalBar}>
        <Text style={styles.totalText}>Total: ${total.toLocaleString()}</Text>
        <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
          <Text style={styles.payButtonText}>Pagar</Text>
        </TouchableOpacity>
      </View>

      <BottomNavBarDetails />
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notificationContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#2B2D42',
  },
  list: {
    paddingBottom: 100,
  },
  productCard: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 15,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  subtotalLabel: {
    fontSize: 16,
    color: '#888',
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  payButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BarDetailsScreen;
