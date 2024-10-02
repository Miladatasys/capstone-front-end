import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Hook para obtener la ruta actual

  // Determina qué pestaña está activa según la ruta actual
  const getTabColor = (tabRoute: string) => {
    return pathname.includes(tabRoute) ? '#EF233C' : '#E4E5E1';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/client/recommendations/RecommendationsScreen')}>
        <Ionicons
          name="home-outline"
          size={32}
          color={getTabColor('/client/recommendations')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/client/scan')}>
        <Ionicons
          name="qr-code-outline"
          size={32}
          color={getTabColor('/client/scan')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/client/account')}>
        <Ionicons
          name="person-outline"
          size={32}
          color={getTabColor('/client/account')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
});

export default BottomNavBar;
