import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const AccountSettingsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mi Cuenta</Text>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push('/client/account/UpdateProfileScreen')}
      >
        <Text style={styles.optionText}>Actualizar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push('/client/account/ChangePasswordScreen')}
      >
        <Text style={styles.optionText}>Cambiar Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => {
          // Lógica para cerrar sesión
          // Aquí podríamos limpiar el token del usuario y redirigir a la pantalla de inicio de sesión
          console.warn('Cerrar sesión');
          router.push('/client/auth/SignInScreen');
        }}
      >
        <Text style={styles.optionText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#2B2D42',
    fontWeight: 'bold',
  },
});

export default AccountSettingsScreen;
