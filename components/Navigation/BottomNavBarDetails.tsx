import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const BottomNavBarDetails: React.FC = () => {
  const router = useRouter();
  const { barId } = useLocalSearchParams(); // Para acceder al `barId` si es necesario
  const [selectedTab, setSelectedTab] = useState<string>('orders');

  const handlePress = (tab: string, route: string) => {
    setSelectedTab(tab);
    router.push(route);
  };

  return (
    <View style={styles.container}>
      {/* Botón de Inicio */}
      <TouchableOpacity onPress={() => handlePress('home', '/client/recommendations/RecommendationsScreen')}>
        <View style={styles.iconContainer}>
          <Ionicons name="home-outline" size={24} color={selectedTab === 'home' ? '#EF233C' : '#E4E5E1'} />
          <Text style={[styles.iconText, selectedTab === 'home' && styles.selectedIconText]}>Inicio</Text>
        </View>
      </TouchableOpacity>

      {/* Botón de Pedidos */}
      <TouchableOpacity onPress={() => handlePress('orders', '/client/orders')}>
        <View style={styles.iconContainer}>
          <Ionicons name="basket-outline" size={24} color={selectedTab === 'orders' ? '#EF233C' : '#E4E5E1'} />
          <Text style={[styles.iconText, selectedTab === 'orders' && styles.selectedIconText]}>Pedidos</Text>
        </View>
      </TouchableOpacity>

      {/* Botón de Historial de Pedidos */}
      <TouchableOpacity onPress={() => handlePress('history', `/client/bar-details/${barId}/OrdersHistoryScreen`)}>
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={24} color={selectedTab === 'history' ? '#EF233C' : '#E4E5E1'} />
          <Text style={[styles.iconText, selectedTab === 'history' && styles.selectedIconText]}>Historial</Text>
        </View>
      </TouchableOpacity>

      {/* Botón de Mi Cuenta */}
      <TouchableOpacity onPress={() => handlePress('account', '/client/account')}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={24} color={selectedTab === 'account' ? '#EF233C' : '#E4E5E1'} />
          <Text style={[styles.iconText, selectedTab === 'account' && styles.selectedIconText]}>Mi Cuenta</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E4E5E1',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    color: '#E4E5E1',
  },
  selectedIconText: {
    color: '#EF233C',
  },
});

export default BottomNavBarDetails;
