import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import BottomNavBarDetails from '../../../../components/Navigation/BottomNavBarDetails';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { API_URL } from '@env';
import ClientHeader from '../../../../components/ClientHeader/ClientHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';  

const socket = io(API_URL);  // Conectar al servidor Socket.IO

const BarDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { bar_id, table_id, user_id, clearCart } = useLocalSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState<number>(0);
  const [existingOrders, setExistingOrders] = useState<any[]>([]);

  const productImages = {
    "cerveza artesanal": "https://th.bing.com/th/id/OIP.cm7k8KVwQDuFE8l_t-N7PQHaE8?rs=1&pid=ImgDetMain",
    "pizza marguerita": "https://srecepty.cz/system/images/85465/full.pizza-margherita-39581-1.jpeg",
    "mojito": "https://th.bing.com/th/id/R.fd97ae8fe99292edbe7550a055a10330?rik=O6lcLwN%2fRebrpA&pid=ImgRaw&r=0",
    "cerveza lager": "https://th.bing.com/th/id/R.c2b477bf1296bca30d2c010e92e5ddb1?rik=zuULjRpeXVsnmg&pid=ImgRaw&r=0",
    "café americano": "https://cdn.shopify.com/s/files/1/0262/5080/5306/products/americano-1_800x.jpg?v=1618806696",
    "tacos al pastor": "https://th.bing.com/th/id/OIP.RQdGh9n6wH2A65UUf_JEBwHaE8?rs=1&pid=ImgDetMain",
    "whiskey old fashioned": "https://th.bing.com/th/id/R.f37e1460eac80c223d56b662efc87536?rik=DYFD9JtUdvg9tw&pid=ImgRaw&r=0"
  };

  useEffect(() => {
    if (!bar_id || !table_id) {
      console.error("Error: El bar_id o table_id no fueron proporcionados.");
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo obtener el id del bar o de la mesa.',
      });
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bars/${bar_id}/products`);
        const shuffledProducts = response.data.sort(() => 0.5 - Math.random());
        const productsWithImages = shuffledProducts.map((product) => ({
          ...product,
          image_url: productImages[product.name.toLowerCase()] || 'https://srecepty.cz/system/images/85465/full.pizza-margherita-39581-1.jpeg',
        }));
        setProducts(productsWithImages);

        const initialQuantities = {};
        productsWithImages.forEach((product) => {
          initialQuantities[product.product_id] = 0;
        });
        setQuantities(initialQuantities);
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
    loadExistingOrders();

    if (clearCart === 'true') {
      clearCartData();
    }
  }, [bar_id, table_id, clearCart]);

  const loadExistingOrders = async () => {
    try {
      const existingOrdersString = await AsyncStorage.getItem(`existingOrders_${bar_id}_${table_id}`);
      if (existingOrdersString) {
        const parsedOrders = JSON.parse(existingOrdersString);
        setExistingOrders(parsedOrders);
      }
    } catch (error) {
      console.error("Error loading existing orders:", error);
    }
  };

  const clearCartData = async () => {
    try {
      await AsyncStorage.removeItem(`existingOrders_${bar_id}_${table_id}`);
      setExistingOrders([]);
      setQuantities({});
      setTotal(0);
      console.log('Carrito limpiado después del pago');
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
    }
  };

  const updateQuantity = (prodQuantId: string, isIncrement: boolean) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[prodQuantId] || 0;
      const maxQuantity = products.find(product => product.product_id === prodQuantId)?.category === "Bebida" ? 15 : 8;
      const newQuantity = isIncrement ? Math.min(currentQuantity + 1, maxQuantity) : Math.max(0, currentQuantity - 1);

      const updatedTotal = products.reduce((acc, product) => {
        const quantity = product.product_id === prodQuantId ? newQuantity : prevQuantities[product.product_id] || 0;
        return acc + (parseFloat(product.price || '0') * quantity);
      }, 0);

      setTotal(updatedTotal);
      return {
        ...prevQuantities,
        [prodQuantId]: newQuantity,
      };
    });
  };

  const handleRequestOrder = async () => {
    // Filtrar y mapear los productos seleccionados
    const selectedProducts = products
      .filter((product) => quantities[product.product_id] > 0)
      .map((product) => ({
        product_id: product.product_id,
        name: product.name,
        price: parseFloat(product.price), // Precio del producto
        quantity: quantities[product.product_id], // Cantidad seleccionada
        category: product.category, // Categoría del producto
      }));

    if (selectedProducts.length > 0) {
      const newOrder = {
        products: selectedProducts,
        user_id, // Asegurarse de que sea un número
        table_id,
        bar_id,
        special_notes: "", // Opcional
        orderGroup_id: null
      };

      console.log('Datos enviados:', newOrder);
      console.log('Endpoint llamado:', `${API_URL}/api/orders`);

      try {
        // Enviar datos al backend
        const response = await axios.post(`${API_URL}/api/orders`, newOrder);
        console.log('Orden creada exitosamente:', response.data);

        // Emitir el evento para notificar a la barra (o cocina)
        socket.emit('new_order', {
          tableNumber: table_id,
          items: selectedProducts.map((product) => product.name).join(', '),
          total: total,
        });

        // Guardar la orden localmente
        const updatedExistingOrders = [
          ...existingOrders,
          { ...newOrder, orderTime: new Date().toLocaleString() },
        ];
        setExistingOrders(updatedExistingOrders);

        await AsyncStorage.setItem(
          `existingOrders_${bar_id}_${table_id}`,
          JSON.stringify(updatedExistingOrders)
        );

        // Redirigir a la pantalla de resumen del pedido
        const productsString = JSON.stringify(updatedExistingOrders);
        router.push({
          pathname: `/client/bar-details/${bar_id}/OrderSummaryScreen`,
          params: { products: productsString, table_id, bar_id, user_id },
        });
        

        // Resetear cantidades y total
        const resetQuantities = {};
        products.forEach((product) => {
          resetQuantities[product.product_id] = 0;
        });
        setQuantities(resetQuantities);
        setTotal(0);

        Toast.show({
          type: 'success',
          text1: 'Pedido realizado',
          text2: 'Tu pedido ha sido enviado exitosamente.',
        });
      } catch (error) {
        console.error('Error al crear el pedido:', error);
        Toast.show({
          type: 'error',
          text1: 'Error al realizar pedido',
          text2: 'No se pudo enviar tu pedido. Intenta nuevamente.',
        });
      }
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
      <ClientHeader />
      <Text style={styles.title}>Productos del Bar</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>C/U ${parseFloat(item.price || '0').toLocaleString()}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.product_id, false)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>
                  {(quantities[item.product_id] !== undefined ? quantities[item.product_id] : 0).toLocaleString('en-US', { minimumIntegerDigits: 2 })}
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
                  ${(quantities[item.product_id] * parseFloat(item.price || '0')).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.product_id.toString()}
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
  },
  list: {
    padding: 10,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
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
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  subtotalLabel: {
    fontSize: 14,
    color: '#888',
  },
  subtotalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarDetailsScreen;
