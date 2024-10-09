import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SuccessToast: React.FC = () => {
  return (
    <View style={styles.toastContainer}>
      <Ionicons name="checkmark-circle" size={28} color="#fff" style={styles.icon} />
      <Text style={styles.toastTitle}>Escaneado con éxito</Text>
      <Text style={styles.toastSubtitle}>Redirigiendo a la carta</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: '#4BB543', // Verde
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Sombra para Android
  },
  icon: {
    marginBottom: 10,
  },
  toastTitle: {
    color: '#fff', // Texto blanco para contraste con el rojo
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  toastSubtitle: {
    color: '#fff', // Texto blanco para contraste con el rojo
    fontSize: 16,
  },
});

export default SuccessToast;
