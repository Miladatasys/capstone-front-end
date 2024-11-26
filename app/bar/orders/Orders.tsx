import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BarBottomBar from '../../../components/Bar/BottomBar/BarBottomBar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


interface Order {
  id: string;
  table: string;
  items: string;
  total: number;
  status: 'Rechazado' | 'Aceptado';
  timestamp: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  const ordersData: Order[] = [
    { id: '1', table: 'Mesa 1', items: 'Cerveza, Pisco Sour', total: 12000, status: 'Aceptado', timestamp: '2023-05-20T14:30:00Z' },
    { id: '2', table: 'Mesa 2', items: 'Vodka, Papas Fritas', total: 8000, status: 'Aceptado', timestamp: '2023-05-20T15:15:00Z' },
    { id: '4', table: 'Mesa 4', items: 'Cerveza', total: 4000, status: 'Rechazado', timestamp: '2023-05-20T16:45:00Z' },
  ];

  useEffect(() => {
    setOrders(ordersData);
  }, []);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => router.push(`/bar/orders/OrderDetail?id=${item.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalles del pedido de ${item.table}`}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.tableText}>{item.table}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.itemsText}>{item.items}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>${item.total.toLocaleString()}</Text>
        <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Aceptado':
        return '#4CAF50';
      case 'Rechazado':
        return '#FF6347';
      default:
        return '#000';
    }
  };

  const filterOrdersByStatus = (status: Order['status'] | 'Todos') => {
    if (status === 'Todos') return orders;
    return orders.filter(order => order.status === status);
  };

  const renderOrders = (status: Order['status'] | 'Todos') => () => (
    <FlatList
      data={filterOrdersByStatus(status)}
      renderItem={renderOrderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
    />
  );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'Todos' },
    { key: 'accepted', title: 'Aceptado' },
    { key: 'rejected', title: 'Rechazado' },
  ]);

  const renderScene = SceneMap({
    all: renderOrders('Todos'),
    accepted: renderOrders('Aceptado'),
    rejected: renderOrders('Rechazado'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333" />
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos</Text>
        <TouchableOpacity 
          onPress={() => router.push('/bar/auth/BarSignInScreen')} 
          accessibilityLabel="Ir a inicio"
        >
          <Ionicons name="exit-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled={true}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            tabStyle={styles.tab}
            activeColor="#EF233C"
            inactiveColor="#333"
          />
        )}
      />

      <BarBottomBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tableText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabIndicator: {
    backgroundColor: '#EF233C',
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  tab: {
    width: 'auto',
  },
});

export default Orders;