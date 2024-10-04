import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

const ChangePasswordScreen: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  // Validaciones de formato de la nueva contraseña
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasUpperCase.test(password)
    );
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Campos Vacíos',
        text2: 'Todos los campos son obligatorios.',
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña No Válida',
        text2: 'La nueva contraseña debe tener al menos 8 caracteres, incluir un número y una letra mayúscula.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Las contraseñas no coinciden.',
      });
      return;
    }

    // Simulación de éxito
    Toast.show({
      type: 'success',
      text1: 'Cambio de Contraseña',
      text2: 'Tu contraseña se ha cambiado correctamente.',
      onHide: () => {
        // Redirigir al home después de que el Toast se haya ocultado
        router.push('/client/recommendations/RecommendationsScreen');
      },
    });

    // TODO: Integración con el backend para cambiar la contraseña
    /*
    axios.post('https://mi-backend.com/api/user/change-password', {
      currentPassword,
      newPassword,
    })
      .then(response => {
        Toast.show({
          type: 'success',
          text1: 'Contraseña Actualizada',
          text2: 'Tu contraseña se ha cambiado correctamente.',
          onHide: () => {
            router.push('/client/recommendations/RecommendationsScreen');
          },
        });
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo cambiar la contraseña. Inténtalo nuevamente.',
        });
      });
    */
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cambiar Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña Actual"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Nueva Contraseña"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Nueva Contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.confirmButton} onPress={handleChangePassword}>
        <Text style={styles.confirmButtonText}>Confirmar Cambio</Text>
      </TouchableOpacity>
      <Toast />
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
