import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Table {
  id: string;
  number: string;
  status: 'disponible' | 'ocupada' | 'ocupada por cliente';
}

const WaiterTablesScreen: React.FC = () => {
  const router = useRouter();

  // Simulación de mesas
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 'Mesa 1', status: 'disponible' },
    { id: '2', number: 'Mesa 2', status: 'ocupada' },
    { id: '3', number: 'Mesa 3', status: 'ocupada por cliente' },
    { id: '4', number: 'Mesa 4', status: 'disponible' },
  ]);

  const handleTableStatusChange = (tableId: string) => {
    setTables(tables.map(table =>
      table.id === tableId
        ? { ...table, status: table.status === 'disponible' ? 'ocupada' : 'disponible' }
        : table
    ));
  };

  const renderTableItem = ({ item }: { item: Table }) => (
    <View style={styles.tableItem}>
      <Text style={styles.tableNumber}>Mesa {item.number}</Text>
      <Text style={[styles.tableStatus, { color: item.status === 'ocupada' ? '#FF6347' : '#4CAF50' }]}>
        Estado: {item.status === 'disponible' ? 'Disponible' : item.status === 'ocupada' ? 'Ocupada' : 'Ocupada por cliente'}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTableStatusChange(item.id)}
      >
        <Text style={styles.buttonText}>{item.status === 'disponible' ? 'Ocupar Mesa' : 'Liberar Mesa'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Mesas</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={tables}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2B2D42',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  tableItem: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tableStatus: {
    fontSize: 14,
    marginTop: 5,
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
});

export default WaiterTablesScreen;

