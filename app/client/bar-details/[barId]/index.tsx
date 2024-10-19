import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import BottomNavBarDetails from '../../../../components/Navigation/BottomNavBarDetails';
import NotificationIcon from '../../../../components/Notification/NotificationIcon';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
// import axios from 'axios'; // Descomentar cuando esté listo el backend

const BarDetailsScreen: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState<number>(0);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    // Simulación de notificación por producto no disponible
    setTimeout(() => {
      setHasNotification(true); // Mostrar la notificación después de 5 segundos (simulación)
    }, 5000);

    // Aquí llamamos al backend para obtener los productos
    /*
    const fetchProducts = async () => {
      try {
        const response = await axios.get('URL_BACKEND/products'); // Cambia URL_BACKEND por la URL real del backend
        setProducts(response.data); // Asignamos los productos recibidos del backend
        const initialQuantities = {};
        response.data.forEach(product => {
          initialQuantities[product.id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error al obtener productos',
          text2: 'No se pudieron cargar los productos del bar.',
        });
      }
    };

    fetchProducts(); // Llamamos a la función al montar el componente
    */

    // Datos simulados mientras no esté disponible el backend
    setProducts([
      { id: '1', name: 'Cerveza Artesanal', price: 3500, image: 'https://via.placeholder.com/80' },
      { id: '2', name: 'Pisco Sour', price: 4000, image: 'https://via.placeholder.com/80' },
      { id: '3', name: 'Vino Tinto', price: 5000, image: 'https://via.placeholder.com/80' },
    ]);

    setQuantities({
      '1': 0,
      '2': 0,
      '3': 0,
    });
  }, []);

  const updateQuantity = (id: string, isIncrement: boolean) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[id] || 0;
      const newQuantity = isIncrement ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);

      // Recalculamos el total
      const updatedTotal = products.reduce((acc, product) => {
        const quantity = product.id === id ? newQuantity : prevQuantities[product.id];
        return acc + product.price * quantity;
      }, 0);

      setTotal(updatedTotal);

      return {
        ...prevQuantities,
        [id]: newQuantity,
      };
    });
  };

  const handleRequestOrder = () => {
    const selectedProducts = products.filter(product => quantities[product.id] > 0).map(product => ({
      ...product,
      quantity: quantities[product.id],
    }));

    if (selectedProducts.length > 0) {
      const productsString = JSON.stringify(selectedProducts);

      // Aquí llamamos al backend para enviar el pedido
      /*
      const sendOrder = async () => {
        try {
          const response = await axios.post('URL_BACKEND/orders', { 
            products: selectedProducts,
            tableId: 'NUMERO_MESA', // Debes enviar también el número de mesa
          });
          Toast.show({
            type: 'success',
            text1: 'Pedido enviado',
            text2: 'Esperando confirmación del bar...',
          });
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Error al enviar pedido',
            text2: 'No se pudo enviar el pedido. Inténtalo de nuevo.',
          });
        }
      };

      sendOrder(); // Llamamos a la función para enviar el pedido
      */

      // Redirigir a la pantalla de confirmación
      router.push({
        pathname: `/client/bar-details/[barId]/OrderSummaryScreen`,
        params: { products: productsString },
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'No hay productos seleccionados',
        text2: 'Por favor selecciona algún producto para continuar.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.notificationContainer}>
        <NotificationIcon hasNotification={hasNotification} onPress={() => router.push(`/client/bar-details/[barId]/manage-item`)} />
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
                  ${(quantities[item.id] * item.price).toLocaleString()}
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
        <TouchableOpacity style={styles.payButton} onPress={handleRequestOrder}>
          <Text style={styles.payButtonText}>Pedir</Text> 
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
