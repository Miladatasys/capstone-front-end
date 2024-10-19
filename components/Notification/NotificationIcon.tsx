import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importamos el ícono de Material Icons

interface NotificationIconProps {
  hasNotification: boolean;
  onPress: () => void; // Función a ejecutar al hacer clic
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ hasNotification, onPress }) => {
  return (
    // Agrandamos el área del TouchableOpacity para que sea más fácil de presionar
    <TouchableOpacity onPress={onPress} style={styles.touchableContainer}>
      <View style={styles.iconContainer}>
        <MaterialIcons
          name="notifications"
          size={35} // Tamaño del ícono
          color={hasNotification ? 'grey' : 'black'} // Cambiamos el color dependiendo de si hay notificación
        />
        {hasNotification && (
          <View style={styles.notificationBadge}>
            {/* Punto rojo indicando notificación */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    // Aumentamos el tamaño para hacer el área más grande y fácil de presionar
    padding: 10, // Aumentamos el padding para hacer más grande el área presionable
    borderRadius: 25, // Redondeamos el área de toque
    backgroundColor: 'transparent', // Fondo transparente
  },
  iconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0, // Más cerca del ícono
    right: 0,
    width: 14, // Tamaño más grande
    height: 14,
    borderRadius: 7, // Circular
    backgroundColor: 'red',
    borderWidth: 2, // Borde delgado para mayor contraste
    borderColor: 'white',
  },
});

export default NotificationIcon;
