import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useRouter } from 'expo-router';

interface Order {
  id: string;
  table: string;
  items: string;
  total: number;
  status: string;
}

const WaiterOrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  // Datos simulados actualizados con los nuevos estados
  const ordersData: Order[] = [
    { id: '1', table: 'Mesa 1', items: 'Cerveza, Pisco Sour', total: 12000, status: 'Pendiente' },
    { id: '2', table: 'Mesa 2', items: 'Vodka, Papas Fritas', total: 8000, status: 'En proceso' },
    { id: '3', table: 'Mesa 3', items: 'Pizza', total: 15000, status: 'Entregado' },
    { id: '4', table: 'Mesa 4', items: 'Cerveza', total: 4000, status: 'Cancelado' },
  ];

  useEffect(() => {
    // Simulando la obtención de datos del backend
    setOrders(ordersData);
  }, []);

  const updateOrderStatus = (orderId: string) => {
    // Actualiza el estado del pedido a "Entregado"
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'Entregado' } : order
    ));
    console.log(`Pedido ${orderId} marcado como entregado.`);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderItem}>
      <Text style={styles.tableText}>Mesa: {item.table}</Text>
      <Text style={styles.itemsText}>Items: {item.items}</Text>
      <Text style={styles.totalText}>Total: ${item.total}</Text>
      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
        Estado: {item.status}
      </Text>
      
      {/* Botón para marcar como entregado */}
      {item.status !== 'Entregado' && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => updateOrderStatus(item.id)}>
          <Text style={styles.buttonText}>Marcar como entregado</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return '#FCA311'; // Mostaza para pendiente
      case 'En proceso':
        return '#4CAF50'; // Verde para en proceso
      case 'Entregado':
        return '#0096c7'; // Azul para entregado
      case 'Cancelado':
        return '#EF233C'; // Rojo para cancelado
      default:
        return '#000';
    }
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'Todos') return orders;
    return orders.filter(order => order.status === status);
  };

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
      data={filterOrdersByStatus('Entregado')}
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

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'Todos' },
    { key: 'pending', title: 'Pendiente' },
    { key: 'inProgress', title: 'En proceso' },
    { key: 'completed', title: 'Entregado' },
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
      <Text style={styles.title}>Pedidos del Mesero</Text>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled={true}
            indicatorStyle={{ backgroundColor: '#EF233C' }}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
      />
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
  button: {
    backgroundColor: '#0096c7',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
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
    fontSize: 14,
    color: '#EF233C',
  },
});

export default WaiterOrdersScreen;
