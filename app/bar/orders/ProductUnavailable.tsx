import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message'; // Importamos el paquete de toast

interface Order {
  id: string;
  table: string;
  items: string[];
  total: number;
  status: string;
  unavailableItem: string;
}

const ProductUnavailable: React.FC = () => {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  // Simulación de los datos del pedido mientras tanto
  const order: Order = {
    id: id as string,
    table: '3',
    items: ['Bebida 1', 'Bebida 2', 'Bebida 3', 'Bebida 4'],
    total: 13180,
    status: 'Pendiente',
    unavailableItem: 'Bebida 1', // El producto no disponible
  };

  const handleSubmit = () => {
    // Mostrar un toast confirmando la notificación al cliente
    Toast.show({
      type: 'success',
      text1: 'Notificación enviada',
      text2: 'El cliente ha sido notificado sobre el item no disponible.',
    });

    // Después de un corto tiempo, redirigir a la lista de pedidos
    setTimeout(() => {
      router.push('/bar/orders/Orders'); // Ruta de la lista de pedidos
    }, 1500); // 1.5 segundos de espera antes de la redirección
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push(`/bar/orders/${id}`)}>
        <Text style={styles.backButton}>Ver Pedidos</Text>
      </TouchableOpacity>

      <Text style={styles.unavailableLabel}>❌ Item no Disponible</Text>

      {/* Información del pedido */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Id Pedido</Text>
        <Text style={styles.value}>#{order.id}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Estado del Pedido</Text>
        <Text style={styles.statusPending}>{order.status}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nº de Mesa</Text>
        <Text style={styles.value}>{order.table}</Text>
      </View>

      {/* Lista de productos con el no disponible en rojo */}
      {order.items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.itemBox,
            item === order.unavailableItem && styles.unavailableItemBox,
          ]}
        >
          <Text
            style={[
              styles.itemText,
              item === order.unavailableItem && styles.unavailableItemText,
            ]}
          >
            {item}
          </Text>
        </View>
      ))}

      {/* Botón para notificar al cliente */}
      <TouchableOpacity style={styles.notifyButton} onPress={handleSubmit}>
        <Text style={styles.notifyButtonText}>Notificar a Cliente</Text>
      </TouchableOpacity>

      {/* Renderizar el toast */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    fontSize: 18,
    color: '#EF233C',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: 'bold', // Negrita para que sea más llamativo
  },
  unavailableLabel: {
    color: '#EF233C',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  statusPending: {
    color: '#EF233C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemBox: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  unavailableItemBox: {
    backgroundColor: '#EF233C',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  unavailableItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notifyButton: {
    backgroundColor: '#EF233C',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  notifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductUnavailable;
