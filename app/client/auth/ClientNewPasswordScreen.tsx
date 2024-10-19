import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { useRouter } from "expo-router";
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import Toast from 'react-native-toast-message';
// import axios from 'axios'; // Descomentar cuando esté lista la integración con el backend

const ClientNewPasswordScreen: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();

  const onSubmitPressed = async () => {
    if (!code.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos Requeridos',
        text2: 'Por favor completa todos los campos antes de continuar.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Las contraseñas no coinciden. Por favor verifica e inténtalo de nuevo.',
      });
      return;
    }

    // Aquí iría la integración con el backend para restablecer la contraseña
    /*
    try {
      const response = await axios.post('URL_DEL_BACKEND/api/reset-password', {
        code,
        newPassword,
      });

      // Si la contraseña se restablece exitosamente
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Contraseña restablecida',
          text2: 'Tu contraseña ha sido restablecida exitosamente.',
        });

        // Redirigir al usuario a la pantalla de inicio de sesión
        setTimeout(() => {
          router.push("/client/auth/ClientSignInScreen");
        }, 2000); // Esperar 2 segundos antes de redirigir
      }
    } catch (error) {
      // Mostrar un Toast en caso de error al restablecer la contraseña
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Hubo un error al restablecer la contraseña. Inténtalo nuevamente.',
      });
    }
    */

    // Simulación de restablecimiento exitoso mientras el backend no esté disponible
    Toast.show({
      type: 'success',
      text1: 'Contraseña restablecida',
      text2: 'Tu contraseña ha sido restablecida exitosamente.',
    });

    // Esperar un momento para que el usuario pueda ver el mensaje y luego redirigir al inicio de sesión
    setTimeout(() => {
      router.push("/client/auth/ClientSignInScreen");
    }, 2000); // Redirigir después de 2 segundos
  };

  const onBackToSignInPressed = () => {
    router.push("/client/auth/ClientSignInScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Crea una nueva contraseña</Text>

        <ClientCustomInput
          placeholder="Código de Verificación"
          value={code}
          setvalue={setCode}
        />

        <ClientCustomInput
          placeholder="Nueva Contraseña"
          value={newPassword}
          setvalue={setNewPassword}
          secureTextEntry={true}
        />

        <ClientCustomInput
          placeholder="Confirmar Nueva Contraseña"
          value={confirmPassword}
          setvalue={setConfirmPassword}
          secureTextEntry={true}
        />

        <Pressable 
          onPress={onSubmitPressed} 
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.buttonText}>Restablecer Contraseña</Text>
        </Pressable>

        <Pressable 
          onPress={onBackToSignInPressed} 
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed ? styles.secondaryButtonPressed : null,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Volver a Iniciar Sesión</Text>
        </Pressable>
      </View>

      {/* Mostrar Toast para toda la pantalla */}
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  root: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: '60%',
    maxWidth: 250,
    maxHeight: 180,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF233C', // Cambiar el color a rojo principal
  },
  buttonPressed: {
    backgroundColor: '#C71F33', // Color cuando el botón es presionado
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonPressed: {
    backgroundColor: '#ddd', // Cambiar el fondo cuando el botón secundario se presiona
    borderRadius: 5,
  },
  secondaryButtonText: {
    color: '#EF233C',
    fontSize: 16,
  },
});

export default ClientNewPasswordScreen;
