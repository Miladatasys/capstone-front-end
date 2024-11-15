import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import WaiterBottomBar from '../../components/Bar/BottomBar/WaiterBottomBar';

const WaiterHomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido, Mesero</Text>
        <Text style={styles.subtitle}>Aquí podrás gestionar las órdenes y las mesas.</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/waiter/WaiterOrdersScreen")} 
        >
          <Text style={styles.buttonText}>Ver Órdenes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/waiter/WaiterTablesScreen")}  
        >
          <Text style={styles.buttonText}>Gestionar Mesas</Text>
        </TouchableOpacity>
      </View>
      <WaiterBottomBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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