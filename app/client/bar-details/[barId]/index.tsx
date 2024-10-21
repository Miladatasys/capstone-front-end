import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import BottomNavBarDetails from '../../../../components/Navigation/BottomNavBarDetails';
import NotificationIcon from '../../../../components/Notification/NotificationIcon';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const BarDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { bar_id, table_id } = useLocalSearchParams(); // Asegúrate de que estás recibiendo correctamente bar_id y table_id
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState<number>(0);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    console.log("Parámetros recibidos en BarDetailsScreen: ", { bar_id, table_id }); // Verifica si los parámetros se reciben correctamente

    if (!bar_id) {
      console.error("Error: El bar_id no fue proporcionado.");
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo obtener el id del bar.',
      });
      return;
    }

    // Obtener productos del backend
    const fetchProducts = async () => {
      try {
        console.log("Obteniendo productos del bar con id:", bar_id);
        const response = await axios.get(`http://10.0.2.2:3000/api/bars/${bar_id}/products`);
        console.log("Productos recibidos:", response.data);
        setProducts(response.data);
        // Aquí se cae


        const initialQuantities = {};
        console.log(initialQuantities)
        response.data.forEach((product) => {
          initialQuantities[product.product_id] = 0; // Usar product_id para las cantidades
        });
        setQuantities(initialQuantities);
        console.log("Cantidades inicializadas:", initialQuantities);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        Toast.show({
          type: 'error',
          text1: 'Error al obtener productos',
          text2: 'No se pudieron cargar los productos del bar.',
        });
      }
    };

    fetchProducts();
  }, [bar_id, table_id]);

  const updateQuantity = (prodQuantId: string, isIncrement: boolean) => {
    console.log(`Actualizando cantidad para el producto con id ${prodQuantId}. Incremento: ${isIncrement}`);
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[prodQuantId] || 0;
      const maxQuantity = products.find(product => product.product_id === prodQuantId)?.category === "Bebida" ? 15 : 8; // Limite según categoría
      const newQuantity = isIncrement ? Math.min(currentQuantity + 1, maxQuantity) : Math.max(0, currentQuantity - 1);

      // Recalcular el total
      const updatedTotal = products.reduce((acc, product) => {
        const quantity = product.product_id === prodQuantId ? newQuantity : prevQuantities[product.product_id];
        return acc + parseFloat(product.price) * quantity; // Asegúrate de convertir a número
      }, 0);

      console.log("Nuevo total calculado:", updatedTotal);

      setTotal(updatedTotal);

      return {
        ...prevQuantities,
        [prodQuantId]: newQuantity,
      };
    });
  };

  const handleRequestOrder = () => {
    console.log("Preparando pedido...");
    const selectedProducts = products
      .filter((product) => quantities[product.product_id] > 0)
      .map((product) => ({
        ...product,
        quantity: quantities[product.product_id],
      }));

    console.log("Productos seleccionados:", selectedProducts);

    if (selectedProducts.length > 0) {
      const productsString = JSON.stringify(selectedProducts);

      const sendOrder = async () => {
        try {
          console.log("Enviando pedido para la mesa con id:", table_id);
          const response = await axios.post('http://10.0.2.2:3000/api/orders', {
            products: selectedProducts,
            table_id: table_id,
          });
          console.log("Respuesta del servidor al enviar pedido:", response.data);
          Toast.show({
            type: 'success',
            text1: 'Pedido enviado',
            text2: 'Esperando confirmación del bar...',
          });
        } catch (error) {
          console.error("Error al enviar el pedido:", error);
          Toast.show({
            type: 'error',
            text1: 'Error al enviar pedido',
            text2: 'No se pudo enviar el pedido. Inténtalo de nuevo.',
          });
        }
      };

      sendOrder();

      // Redirigir a la pantalla de confirmación
      router.push({
        pathname: `/client/bar-details/${bar_id}/OrderSummaryScreen`,
        params: { products: productsString, table_id },
      });
    } else {
      console.log("No hay productos seleccionados.");
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
        <NotificationIcon hasNotification={hasNotification} onPress={() => router.push(`/client/bar-details/[bar_id]/manage-item`)} />
      </View>

      <Text style={styles.title}>Productos del Bar</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>C/U ${parseFloat(item.price).toLocaleString()}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.product_id, false)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>
                  {quantities[item.product_id].toLocaleString('en-US', { minimumIntegerDigits: 2 })}
                </Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.product_id, true)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.subtotalContainer}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>
                <Text style={styles.subtotalAmount}>
                  ${(quantities[item.product_id] * parseFloat(item.price)).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.product_id.toString()} // Usa product_id como clave
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
