import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importamos el ícono de Material Icons

interface NotificationIconProps {
  hasNotification: boolean;
  onPress: () => void; // Función a ejecutar al hacer clic
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ hasNotification, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <MaterialIcons
        name="notifications"
        size={35} // Tamaño más grande del ícono
        color={hasNotification ? 'grey' : 'black'} // Cambiamos el color dependiendo de si hay notificación
      />
      {hasNotification && (
        <View style={styles.notificationBadge}>
          {/* Punto rojo indicando notificación */}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 5, // Reducimos el padding para acercar más el punto a la campana
  },
  notificationBadge: {
    position: 'absolute',
    top: 2, // Más cerca del ícono
    right: 2,
    width: 12, // Tamaño más grande
    height: 12,
    borderRadius: 6, // Circular
    backgroundColor: 'red',
    borderWidth: 1.5, // Borde delgado para mayor contraste
    borderColor: 'white',
  },
});

export default NotificationIcon;
