import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const WaiterBottomBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<number>(0);

  useEffect(() => {
    // Simulate receiving a notification after 5 seconds (for testing)
    const timer = setTimeout(() => {
      setNotifications(prev => prev + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getTabColor = (tabRoute: string) => {
    return pathname?.startsWith(tabRoute) ? '#EF233C' : '#747272';
  };

  const getTextStyle = (tabRoute: string) => {
    return pathname?.startsWith(tabRoute) ? styles.selectedIconText : styles.iconText;
  };

  const handleNavigation = (route: string) => {
    if (pathname && !pathname.startsWith(route)) {
      router.push(route);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleNavigation('/waiter/WaiterOrdersScreen')}>
        <View style={styles.iconContainer}>
          <Ionicons name="list-outline" size={24} color={getTabColor('/waiter/WaiterOrdersScreen')} />
          <Text style={getTextStyle('/waiter/WaiterOrdersScreen')}>
            Ver Ordenes {notifications > 0 ? `(${notifications})` : ''}
          </Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handleNavigation('/waiter/WaiterTablesScreen')}>
        <View style={styles.iconContainer}>
          <Ionicons name="grid-outline" size={24} color={getTabColor('/waiter/WaiterTablesScreen')} />
          <Text style={getTextStyle('/waiter/WaiterTablesScreen')}>Mesas</Text>
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
    fontSize: 12,
    color: '#EF233C',
  },
});

export default WaiterBottomBar;