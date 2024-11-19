import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HeaderProps {
  cartItemsCount?: number;
  notificationsCount?: number;
}

export default function Header({
  cartItemsCount = 0,
  notificationsCount = 0,
}: HeaderProps) {
  const router = useRouter();
  const { barId } = useLocalSearchParams();
  const [barName, setBarName] = useState('Cargando...');

  useEffect(() => {
    const getBarName = async () => {
      try {
        const storedBarName = await AsyncStorage.getItem('selectedBarName');
        if (storedBarName) {
          setBarName(storedBarName);
        } else {
          setBarName('Bar no seleccionado');
        }
      } catch (error) {
        console.error('Error al recuperar el nombre del bar:', error);
        setBarName('Error al cargar');
      }
    };

    getBarName();
  }, []);

  const handleCartPress = () => {
    router.push(`/client/bar-details/${barId}/ClientCart`);
  };

  const handleNotificationsPress = () => {
    router.push(`/client/bar-details/${barId}/ClientNotification`);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {barName}
      </Text>
      <View style={styles.iconsContainer}>


        <TouchableOpacity 
          onPress={handleNotificationsPress} 
          style={styles.iconButton}
          accessibilityLabel={`Notificaciones, ${notificationsCount} no leídas`}
          accessibilityHint="Toca para ver las notificaciones"
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          {notificationsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});