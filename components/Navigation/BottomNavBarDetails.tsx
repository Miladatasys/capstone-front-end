import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';

const BottomNavBarDetails: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Obtiene la ruta actual
  const { barId } = useLocalSearchParams(); // Para acceder al `barId` si es necesario

  // Determina qué pestaña está activa según la ruta actual
  const getTabColor = (tabRoutes: string[]) => {
    return tabRoutes.some((tabRoute) => pathname.includes(tabRoute)) ? '#EF233C' : '#747272';
  };

  const getTextStyle = (tabRoutes: string[]) => {
    return tabRoutes.some((tabRoute) => pathname.includes(tabRoute)) ? styles.selectedIconText : styles.iconText;
  };

  return (
    <View style={styles.container}>
      {/* Botón de Inicio */}
      <TouchableOpacity onPress={() => router.push('/client/recommendations/RecommendationsScreen')}>
        <View style={styles.iconContainer}>
          <Ionicons name="home-outline" size={24} color={getTabColor(['/client/recommendations'])} />
          <Text style={getTextStyle(['/client/recommendations'])}>Inicio</Text>
        </View>
      </TouchableOpacity>

      {/* Botón de Escanear */}
        <View style={styles.iconContainer}>
          <Ionicons
            name="book-outline"
            size={24}
            color={getTabColor(['/client/bar-details', '/client/orders'])}
          />
          <Text style={getTextStyle(['/client/bar-details', '/client/orders'])}>Carta</Text>
        </View>


      {/* Botón de Historial de Pedidos */}
      <TouchableOpacity onPress={() => router.push(`/client/bar-details/${barId}/OrdersHistoryScreen`)}>
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={24} color={getTabColor([`/client/bar-details/${barId}/OrdersHistoryScreen`])} />
          <Text style={getTextStyle([`/client/bar-details/${barId}/OrdersHistoryScreen`])}>Historial</Text>
        </View>
      </TouchableOpacity>

      {/* Botón de Mi Cuenta */}
      <TouchableOpacity onPress={() => router.push('/client/account/AccountSettingsScreen')}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={24} color={getTabColor(['/client/account'])} />
          <Text style={getTextStyle(['/client/account'])}>Mi Cuenta</Text>
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
    color: '#747272',
  },
  selectedIconText: {
    color: '#EF233C',
  },
});

export default BottomNavBarDetails;
