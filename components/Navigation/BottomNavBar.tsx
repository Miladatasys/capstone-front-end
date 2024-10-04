import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Hook para obtener la ruta actual

  // Determina qué pestaña está activa según la ruta actual
  const getTabColor = (tabRoute: string) => {
    return pathname.includes(tabRoute) ? '#EF233C' : '#747272';
  };

  const getTextStyle = (tabRoute: string) => {
    return pathname.includes(tabRoute) ? styles.selectedIconText : styles.iconText;
  };

  return (
    <View style={styles.container}>
      {/* Botón de Inicio */}
      <TouchableOpacity onPress={() => router.push('/client/recommendations/RecommendationsScreen')}>
        <View style={styles.iconContainer}>
          <Ionicons name="home-outline" size={24} color={getTabColor('/client/recommendations')} />
          <Text style={getTextStyle('/client/recommendations')}>Inicio</Text>
        </View>
      </TouchableOpacity>

      {/* Botón de Escanear */}
      <TouchableOpacity onPress={() => router.push('/client/scan')}>
        <View style={styles.iconContainer}>
          <Ionicons name="qr-code-outline" size={24} color={getTabColor('/client/scan')} />
          <Text style={getTextStyle('/client/scan')}>Escanear</Text>
        </View>
      </TouchableOpacity>

      {/* Botón de Mi Cuenta */}
      <TouchableOpacity onPress={() => router.push('/client/account/AccountSettingsScreen')}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={24} color={getTabColor('/client/account')} />
          <Text style={getTextStyle('/client/account')}>Mi Cuenta</Text>
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

export default BottomNavBar;
