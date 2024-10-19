import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';
// import axios from 'axios'; // Descomentar cuando esté lista la integración con el backend

const ClientSignInScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  // Validar y proceder con la navegación a la pantalla de Recomendados
  const onClientSignInPressed = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Campos Requeridos',
        text2: 'Por favor ingresa tu nombre de usuario y contraseña.',
      });
      return;
    }
    
    // Aquí iría la integración con el backend para autenticar al usuario
    /*
    try {
      const response = await axios.post('URL_DEL_BACKEND/api/login', {
        username,
        password,
      });

      // Si el inicio de sesión es exitoso
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Inicio de Sesión Exitoso',
          text2: 'Bienvenido de nuevo!',
        });

        // Navega a la pantalla de Recomendaciones
        router.push("/client/recommendations/RecommendationsScreen");
      }
    } catch (error) {
      // Mostrar un Toast en caso de error con el inicio de sesión
      Toast.show({
        type: 'error',
        text1: 'Error de Inicio de Sesión',
        text2: error.response?.data?.message || 'Nombre de usuario o contraseña incorrectos.',
      });
    }
    */

    // Simulación de inicio de sesión exitoso mientras el backend no esté disponible
    Toast.show({
      type: 'success',
      text1: 'Inicio de Sesión Exitoso',
      text2: 'Bienvenido de nuevo!',
    });

    // Si los campos son válidos, navega a la siguiente pantalla
    setTimeout(() => {
      router.push("/client/recommendations/RecommendationsScreen");
    }, 2000); // Simulación de una espera de 2 segundos
  };

  const onClientForgotPasswordPressed = () => {
    router.push("/client/auth/ClientForgotPasswordScreen");
  };

  const onClientSignUpPressed = () => {
    router.push("/client/auth/ClientSignUpScreen");
  };

  const onBarSignInPressed = () => {
    // Navegar a la pantalla de login para el usuario bar
    router.push("/bar/auth/BarSignInScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <ClientCustomInput
          placeholder="Nombre de Usuario"
          value={username}
          setvalue={setUsername}
        />
        <ClientCustomInput
          placeholder="Contraseña"
          value={password}
          setvalue={setPassword}
          secureTextEntry={true}
        />

        <ClientCustomButton
          text="Iniciar Sesión"
          onPress={onClientSignInPressed}
        />
        
        <ClientCustomButton
          text="Olvidé mi Contraseña"
          onPress={onClientForgotPasswordPressed}
          type="TERTIARY"
        />

        <ClientCustomButton
          text="Registrarse"
          onPress={onClientSignUpPressed}
          type="SECONDARY"
        />
      </View>

      {/* Botón minimalista para iniciar como Bar */}
      <Pressable onPress={onBarSignInPressed} style={styles.barSignInButton}>
        <Text style={styles.barSignInText}>Iniciar como Bar</Text>
      </Pressable>

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
  barSignInButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  barSignInText: {
    color: '#888',
    fontSize: 17,
    textDecorationLine: 'underline',
  },
});

export default ClientSignInScreen;
