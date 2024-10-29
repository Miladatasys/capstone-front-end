import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { API_URL } from '@env';


const ClientSignUpScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onRegisterPressed = async () => {
    // Validación básica de los campos vacíos
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos Requeridos',
        text2: 'Todos los campos son obligatorios. Por favor, complétalos.',
      });
      return;
    }

    // Validación de coincidencia de contraseñas
    console.log(`Password: "${password}", Confirm Password: "${confirmPassword}"`); // Para depuración
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error de Registro',
        text2: 'Las contraseñas no coinciden.',
      });
      return;
    }

    setLoading(true); // Mostrar indicador de carga

    try {
      // Realizar la solicitud al backend para registrar al usuario
      const response = await axios.post(`${API_URL}/api/register-consumer`, {
        first_name: username,
        email,
        password,
        confirmPassword
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Registro Exitoso',
          text2: 'Te has registrado correctamente.',
        });

        // Redirigir al inicio de sesión después de un breve delay
        setTimeout(() => {
          router.push("/client/auth/ClientSignInScreen");
        }, 2000);
      }
    } catch (error) {
      // Manejo detallado de errores
      Toast.show({
        type: 'error',
        text1: 'Error de Registro',
        text2: error.response?.data?.message || 'Ocurrió un error al intentar registrarse. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setLoading(false); // Ocultar indicador de carga
    }
  };

  const onSignInPressed = () => {
    router.push("/client/auth/ClientSignInScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Crear una cuenta</Text>

        <ClientCustomInput
          placeholder="Nombre de Usuario"
          value={username}
          setvalue={setUsername}
        />
        <ClientCustomInput
          placeholder="Correo Electrónico"
          value={email}
          setvalue={setEmail}
        />
        <ClientCustomInput
          placeholder="Contraseña"
          value={password}
          setvalue={setPassword}
          secureTextEntry={true}
        />
        <ClientCustomInput
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          setvalue={setConfirmPassword}
          secureTextEntry={true}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ClientCustomButton
            text="Registrarse"
            onPress={onRegisterPressed}
          />
        )}

        <ClientCustomButton
          text="¿Ya tienes una cuenta? Inicia sesión"
          onPress={onSignInPressed}
          type="TERTIARY"
        />
      </View>

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
  primaryButton: {
    marginVertical: 10,
  },
});

export default ClientSignUpScreen;
