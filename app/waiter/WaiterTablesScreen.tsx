import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

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
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Mesas</Text>
      <FlatList
        data={tables}
        renderItem={renderTableItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
