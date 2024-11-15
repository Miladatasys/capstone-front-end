import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
// import axios from 'axios'; // Descomentar esto cuando el backend esté listo

interface Order {
  id: string;
  table: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  customer: string;
}

const BarOrderDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [adjustedItems, setAdjustedItems] = useState<Order['items']>([]);
  const [adjustedTotal, setAdjustedTotal] = useState<number>(0);

  useEffect(() => {
    // Simulación de datos (descomentar para usar el backend)
    const simulatedOrder: Order = {
      id: id as string,
      table: '3',
      items: [
        { name: 'Bebida 1', price: 3000, quantity: 2 },
        { name: 'Bebida 2', price: 2500, quantity: 1 },
        { name: 'Bebida 3', price: 4000, quantity: 3 },
        { name: 'Bebida 4', price: 1680, quantity: 1 },
      ],
      total: 13180,
      status: 'Pendiente',
      customer: 'Nombre',
    };

    setOrder(simulatedOrder);
    setAdjustedItems(simulatedOrder.items);
    setAdjustedTotal(simulatedOrder.total);
  }, [id]);

  const handleChangeQuantity = (itemName: string, change: number) => {
    setAdjustedItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.name === itemName) {
          const newQuantity = Math.max(0, item.quantity + change);
          // Ajustar el total basado en la nueva cantidad
          setAdjustedTotal((prevTotal) => {
            const priceDifference = (newQuantity - item.quantity) * item.price;
            return Math.max(0, prevTotal + priceDifference);
          });
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const handleMarkAsUnavailable = (itemName: string) => {
    setAdjustedItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName
          ? {
              ...item,
              quantity: 0, // Poner cantidad a 0 para marcarlo como agotado
            }
          : item
      )
    );

    // Actualizar el total ajustado al marcar como agotado
    const item = adjustedItems.find((item) => item.name === itemName);
    if (item) {
      setAdjustedTotal((prevTotal) => Math.max(0, prevTotal - item.price * item.quantity));
    }
  };

  const handleConfirmOrder = () => {
    Alert.alert('Confirmación', '¿Confirmar este pedido ajustado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: () => {
          Alert.alert('Éxito', 'El pedido ha sido confirmado con los productos disponibles.');
          router.push('/bar/orders/Orders');
        },
      },
    ]);
  };

  const handleProposeChange = () => {
    Alert.alert('Cambio propuesto', 'Propuesta de cambio enviada al cliente.');
    router.push('/bar/orders/Orders');
  };

  const handleRejectOrder = () => {
    Alert.alert('Confirmación', '¿Rechazar este pedido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: () => {
          Alert.alert('Pedido Rechazado', 'El pedido ha sido rechazado.');
          router.push('/bar/orders/Orders');
        },
      },
    ]);
  };

  if (!order) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Revisar Pedido</Text>
        <TouchableOpacity style={styles.rejectButton} onPress={handleRejectOrder}>
          <Text style={styles.rejectButtonText}>Rechazar Pedido</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={adjustedItems}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.actionsContainer}>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>
                  {item.quantity.toLocaleString('en-US', { minimumIntegerDigits: 2 })}
                </Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleChangeQuantity(item.name, -1)}
                >
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleChangeQuantity(item.name, 1)}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
              >
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.infoText}>Mesa: {order.table}</Text>
      <Text style={styles.infoText}>Cliente: {order.customer}</Text>
      <Text style={styles.infoText}>Total ajustado: ${adjustedTotal.toLocaleString()}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.proposeButton]} onPress={handleProposeChange}>
          <Text style={styles.buttonText}>Proponer Cambio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.completedButton]} onPress={handleConfirmOrder}>
          <Text style={styles.buttonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  rejectButton: {
    backgroundColor: '#EF233C',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 50,
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemBox: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '40%',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 18,
    width: 25,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  proposeButton: {
    backgroundColor: '#FCA311',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarOrderDetails;
