import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const AccountSettingsScreen: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: () => {
            // Lógica para cerrar sesión
            // Aquí podrías limpiar el token del usuario, por ejemplo:
            // AsyncStorage.removeItem('userToken'); o algún otro proceso de cierre de sesión
            console.warn("Sesión cerrada");
            router.push('/client/auth/ClientSignInScreen');
          },
        },
      ],
      { cancelable: false }
    );
  };

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
        onPress={handleLogout}
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
  },
  optionButton: {
    backgroundColor: '#F1F1F1',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#2B2D42',
  },
});

export default AccountSettingsScreen;
