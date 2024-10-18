import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
// import axios from 'axios'; // Descomenta esto cuando el backend esté listo

interface Order {
  id: string;
  table: string;
  items: string[];
  total: number;
  status: string;
  customer: string;
}

const BarOrderDetails: React.FC = () => {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  // Simulación de los datos mientras tanto (reemplazar por la llamada al backend cuando esté listo)
  useEffect(() => {
    // Cuando el backend esté listo, descomentar esta función y eliminar los datos simulados
    // const fetchOrder = async () => {
    //   try {
    //     const response = await axios.get(`URL_DEL_BACKEND/api/orders/${id}`); // Cambia la URL por la real
    //     setOrder(response.data); // Actualiza los datos del pedido con la respuesta del backend
    //     setOrderStatus(response.data.status); // Establece el estado del pedido
    //   } catch (error) {
    //     console.error('Error al obtener los detalles del pedido:', error);
    //   }
    // };
    
    // fetchOrder(); // Llama a la función para obtener los datos del pedido

    // Simulación de los datos del pedido mientras se integra el backend
    const simulatedOrder: Order = {
      id: id as string,
      table: '3',
      items: ['Bebida 1', 'Bebida 2', 'Bebida 3', 'Bebida 4'],
      total: 13180,
      status: 'Pendiente',
      customer: 'Nombre',
    };

    setOrder(simulatedOrder);
    setOrderStatus(simulatedOrder.status);
  }, [id]);

  const handleMarkAsCompleted = () => {
    Alert.alert('Confirmación', '¿Marcar este pedido como completado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: async () => {
          // Cuando el backend esté listo, descomentar esto para la actualización del estado del pedido
          // try {
          //   await axios.put(`URL_DEL_BACKEND/api/orders/${id}/complete`); // Llama al endpoint correspondiente
          //   setOrderStatus('Completado');
          //   Alert.alert('Éxito', 'El pedido ha sido marcado como completado.');
          // } catch (error) {
          //   console.error('Error al marcar el pedido como completado:', error);
          // }

          setOrderStatus('Completado'); // Simulación del cambio de estado
          Alert.alert('Éxito', 'El pedido ha sido marcado como completado.');
        },
      },
    ]);
  };

  const handleCancelOrder = () => {
    Alert.alert('Confirmación', '¿Cancelar este pedido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aceptar',
        onPress: async () => {
          // Cuando el backend esté listo, descomentar esto para la cancelación del pedido
          // try {
          //   await axios.put(`URL_DEL_BACKEND/api/orders/${id}/cancel`); // Llama al endpoint correspondiente
          //   setOrderStatus('Cancelado');
          //   Alert.alert('Éxito', 'El pedido ha sido cancelado.');
          // } catch (error) {
          //   console.error('Error al cancelar el pedido:', error);
          // }

          setOrderStatus('Cancelado'); // Simulación del cambio de estado
          Alert.alert('Éxito', 'El pedido ha sido cancelado.');
        },
      },
    ]);
  };

  if (!order) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <TextInput
        placeholder="Buscar"
        style={styles.searchInput}
      />

      {/* Detalles del pedido */}
      <Text style={styles.title}>Pedidos en Barra</Text>
      <View style={styles.detailContainer}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderBarName}>Bar Providencia</Text>
          <Text style={styles.orderTotal}>${order.total}</Text>
        </View>
        <Text style={styles.orderItemsCount}>{order.items.length} Bebidas</Text>

        {/* Lista de items */}
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemBox}>
            <Text>{item}</Text>
          </View>
        ))}

        {/* Información del pedido */}
        <Text style={styles.infoText}>Nº de Mesa: {order.table}</Text>
        <Text style={styles.infoText}>Nombre Cliente: {order.customer}</Text>

        {/* Botón de acción */}
<TouchableOpacity 
  style={styles.unavailableButton} 
  onPress={() => router.push(`/bar/orders/ProductUnavailable?id=${id}`)}
>
  <Text style={styles.unavailableText}>¿Producto no disponible?</Text>
</TouchableOpacity>


        {/* Botón de ver detalles */}
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Ver detalles</Text>
        </TouchableOpacity>

        {/* Botones de estado si está pendiente */}
        {orderStatus === 'Pendiente' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.completedButton]} onPress={handleMarkAsCompleted}>
              <Text style={styles.buttonText}>Marcar como Completado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelOrder}>
              <Text style={styles.buttonText}>Cancelar Pedido</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pendiente':
      return '#EF233C';
    case 'En proceso':
      return '#FCA311';
    case 'Completado':
      return '#4CAF50';
    case 'Cancelado':
      return '#757575';
    default:
      return '#000';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderBarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderItemsCount: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  itemBox: {
    backgroundColor: '#E5E5E5',
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  },
  unavailableButton: {
    backgroundColor: '#E5E5E5',
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
    alignItems: 'center',
  },
  unavailableText: {
    fontSize: 16,
    color: '#555',
  },
  detailsButton: {
    backgroundColor: '#E5E5E5',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#EF233C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarOrderDetails;
