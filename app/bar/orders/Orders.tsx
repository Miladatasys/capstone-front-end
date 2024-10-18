import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BarBottomBar from '../../../components/Bar/BottomBar/BarBottomBar';
import { useRouter } from 'expo-router';
// import axios from 'axios'; // Descomentar esto cuando el backend esté listo

interface Order {
  id: string;
  table: string;
  items: string;
  total: number;
  status: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  // Simulamos datos falsos por ahora
  const ordersData: Order[] = [
    { id: '1', table: 'Mesa 1', items: 'Cerveza, Pisco Sour', total: 12000, status: 'Pendiente' },
    { id: '2', table: 'Mesa 2', items: 'Vodka, Papas Fritas', total: 8000, status: 'En proceso' },
    { id: '3', table: 'Mesa 3', items: 'Pizza', total: 15000, status: 'Completado' },
    { id: '4', table: 'Mesa 4', items: 'Cerveza', total: 4000, status: 'Cancelado' },
  ];

  useEffect(() => {
    // Cuando el backend esté disponible, descomentar el siguiente bloque para hacer la solicitud.
    // const fetchOrders = async () => {
    //   try {
    //     const response = await axios.get('URL_DEL_BACKEND/api/orders'); // Cambia 'URL_DEL_BACKEND' por la URL real
    //     setOrders(response.data); // Actualiza los pedidos con los datos obtenidos del backend
    //   } catch (error) {
    //     console.error('Error al obtener los pedidos:', error);
    //   }
    // };

    // fetchOrders(); // Llama a la función para obtener los pedidos desde el backend

    // Por ahora, usamos los datos simulados
    setOrders(ordersData);
  }, []);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity onPress={() => router.push(`/bar/orders/${item.id}`)}>
      <View style={styles.orderItem}>
        <Text style={styles.tableText}>Mesa: {item.table}</Text>
        <Text style={styles.itemsText}>Items: {item.items}</Text>
        <Text style={styles.totalText}>Total: ${item.total}</Text>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          Estado: {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

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

  // Filtrar pedidos según el estado
  const filterOrdersByStatus = (status: string) => {
    if (status === 'Todos') return orders;
    return orders.filter(order => order.status === status);
  };

  // Crear las escenas para cada pestaña
  const renderPendingOrders = () => (
    <FlatList
      data={filterOrdersByStatus('Pendiente')}
      renderItem={renderOrderItem}
      keyExtractor={item => item.id}
    />
  );

  const renderInProgressOrders = () => (
    <FlatList
      data={filterOrdersByStatus('En proceso')}
      renderItem={renderOrderItem}
      keyExtractor={item => item.id}
    />
  );

  const renderCompletedOrders = () => (
    <FlatList
      data={filterOrdersByStatus('Completado')}
      renderItem={renderOrderItem}
      keyExtractor={item => item.id}
    />
  );

  const renderCancelledOrders = () => (
    <FlatList
      data={filterOrdersByStatus('Cancelado')}
      renderItem={renderOrderItem}
      keyExtractor={item => item.id}
    />
  );

  const renderAllOrders = () => (
    <FlatList
      data={filterOrdersByStatus('Todos')}
      renderItem={renderOrderItem}
      keyExtractor={item => item.id}
    />
  );

  // Configuración del TabView
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'Todos' },
    { key: 'pending', title: 'Pendiente' },
    { key: 'inProgress', title: 'En Proceso' },
    { key: 'completed', title: 'Completado' },
    { key: 'cancelled', title: 'Cancelado' },
  ]);

  const renderScene = SceneMap({
    pending: renderPendingOrders,
    inProgress: renderInProgressOrders,
    completed: renderCompletedOrders,
    cancelled: renderCancelledOrders,
    all: renderAllOrders,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos Activos</Text>

      {/* Componente de pestañas */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled={true} // Permite desplazamiento entre pestañas
            indicatorStyle={{ backgroundColor: '#EF233C' }}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
      />

      <BarBottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  orderItem: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tableText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemsText: {
    fontSize: 14,
    color: '#555',
  },
  totalText: {
    fontSize: 14,
    marginTop: 4,
    color: '#000',
  },
  statusText: {
    fontSize: 13,
    marginTop: 4,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomColor: '#EF233C',
    borderBottomWidth: 1,
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 14, // Ajustar el tamaño de la fuente para mejorar la legibilidad
    color: '#EF233C',
  },
});

export default Orders;
