import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const WaiterHomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, Mesero</Text>
      <Text style={styles.subtitle}>Aquí podrás gestionar las órdenes y las mesas.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/waiter/WaiterOrdersScreen")}  // Asegúrate que la ruta a las órdenes sea correcta
      >
        <Text style={styles.buttonText}>Ver Órdenes</Text>
      </TouchableOpacity>

      {/* Ruta correcta a la pantalla de gestión de mesas */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/waiter/WaiterTablesScreen")}  // Esto llevará a WaiterTablesScreen.tsx
      >
        <Text style={styles.buttonText}>Gestionar Mesas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0096c7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default WaiterHomeScreen;
