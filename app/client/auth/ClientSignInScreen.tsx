import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';
import { API_URL } from '@env';

const ClientSignInScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
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
  
    setLoading(true);
  
    try {
      // Realiza la solicitud al backend para autenticar al usuario
      //console.log('Api url: ',API_URL)  
      const response = await axios.post(`${API_URL}/api/login`, {
        email: username,
        password,
      });
      //console.log(response.data); // Log para verificar la respuesta
      //console.log(response)
      // Si el inicio de sesión es exitoso
      if (response.status === 200) {
        const user_id = response.data.user_id; // Asegúrate de que el backend devuelva user_id
        const userType = response.data.user_type_id; // También puedes extraer el tipo de usuario si es necesario
        
        console.log('Inicio de sesión exitoso:', { user_id, userType });
  
        Toast.show({
          type: 'success',
          text1: 'Inicio de Sesión Exitoso',
          text2: 'Bienvenido de nuevo!',
        });
  
        // Almacenar el token JWT si es necesario
        const token = response.data.token;
        //console.log('token: ', token)
        // Puedes almacenar el token usando AsyncStorage o algún método similar
  
        // Navegar a la pantalla de Recomendaciones
        router.push("/client/recommendations/RecommendationsScreen");
      }
    } catch (error) {
      // Mostrar un Toast en caso de error con el inicio de sesión
      console.error('Error al realizar la solicitud:', error); // Log para ver el error completo
      
      Toast.show({
        type: 'error',
        text1: 'Error de Inicio de Sesión',
        text2: error.response?.data?.message || 'Nombre de usuario o contraseña incorrectos.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onClientForgotPasswordPressed = () => {
    router.push("/client/auth/ClientForgotPasswordScreen");
  };

  const onClientSignUpPressed = () => {
    router.push("/client/auth/ClientSignUpScreen");
  };

  const onBarSignInPressed = () => {
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

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ClientCustomButton
            text="Iniciar Sesión"
            onPress={onClientSignInPressed}
          />
        )}

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

      <Pressable onPress={onBarSignInPressed} style={styles.barSignInButton}>
        <Text style={styles.barSignInText}>Iniciar como Bar</Text>
      </Pressable>

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
