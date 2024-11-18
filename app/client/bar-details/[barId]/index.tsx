import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import BottomNavBarDetails from '../../../../components/Navigation/BottomNavBarDetails';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { API_URL } from '@env';
import ClientHeader from '../../../../components/ClientHeader/ClientHeader';

const BarDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { bar_id, table_id, user_id } = useLocalSearchParams(); // VERIFICAR SI SE RECIBE correctamente bar_id y table_id
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState<number>(0);

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
    console.log("Parámetros recibidos en BarDetailsScreen: ", { bar_id, table_id });

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
        console.log("Obteniendo productos del bar con id:", bar_id);
        const response = await axios.get(`${API_URL}/api/bars/${bar_id}/products`);

        // Mezclar aleatoriamente los productos para cada bar
        const shuffledProducts = response.data.sort(() => 0.5 - Math.random());

        // Asignar las imágenes a cada producto
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
  }, [bar_id, table_id]);

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

  const handleRequestOrder = () => {
    const selectedProducts = products
      .filter((product) => quantities[product.product_id] > 0)
      .map((product) => ({
        product_id: product.product_id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        quantity: quantities[product.product_id],
        originalQuantity: quantities[product.product_id],
        available: product.availability,
      }))
      .filter(product => product.product_id && product.quantity > 0 && product.price > 0);

    if (selectedProducts.length > 0) {
      const productsString = JSON.stringify(selectedProducts);

      const sendOrder = async () => {
        try {
          const response = await axios.post(`${API_URL}/api/orders`, {
            products: selectedProducts,
            table_id: table_id,
            bar_id: bar_id,
            user_id: user_id
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

      sendOrder();
      router.push({
        pathname: `/client/bar-details/${bar_id}/OrderSummaryScreen`,
        params: { products: productsString, table_id, bar_id },
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
      <ClientHeader></ClientHeader>
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
    backgroundColor: '#fff',
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
