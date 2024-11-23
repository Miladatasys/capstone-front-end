import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Order {
  id: string;
  table: string;
  items: string;
  status: 'Pendiente' | 'Entregado';
  timestamp: string;
}

const KitchenOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  const ordersData: Order[] = [
    { id: '1', table: 'Mesa 1', items: 'Pizza Margherita, Ensalada César', status: 'Entregado', timestamp: '2023-05-20T14:30:00Z' },
    { id: '2', table: 'Mesa 3', items: 'Risotto de champiñones', status: 'Entregado', timestamp: '2023-05-20T16:00:00Z' },
  ];

  useEffect(() => {
    setOrders(ordersData);
  }, []);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.tableText}>{item.table}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.itemsText}>{item.items}</Text>
      <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pendiente':
        return '#FFA500';
      case 'Entregado':
        return '#9E9E9E';
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
    { key: 'pending', title: 'Pendiente' },
    { key: 'ready', title: 'Entregado' },
  ]);

  const renderScene = SceneMap({
    all: renderOrders('Todos'),
    pending: renderOrders('Pendiente'),
    ready: renderOrders('Entregado'),
  });

  const handleExit = () => {
    Alert.alert(
      "Confirmar salida",
      "¿Estás seguro de que quieres salir?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sí", 
          onPress: () => router.push('/bar/auth/BarSignInScreen')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333" />
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos de Cocina</Text>
        <Ionicons 
          name="exit-outline" 
          size={24} 
          color="#fff" 
          onPress={handleExit}
        />
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
            activeColor="#4CAF50"
            inactiveColor="#333"
          />
        )}
      />
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
    backgroundColor: '#4CAF50',
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

export default KitchenOrders;

