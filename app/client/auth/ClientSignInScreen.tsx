import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, Pressable, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';
import { API_URL } from '@env';

const { width } = Dimensions.get('window');

const ClientSignInScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(width))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
      const response = await axios.post(`${API_URL}/api/login`, {
        email: username,
        password,
      });

      if (response.status === 200) {
        const user_id = response.data.user_id;
        const user_type_id = response.data.user_type_id;
        
        Toast.show({
          type: 'success',
          text1: 'Inicio de Sesión Exitoso',
          text2: '¡Bienvenido de nuevo!',
        });

        const token = response.data.token;
        router.push(`/client/recommendations/RecommendationsScreen?user_id=${user_id}&user_type_id=${user_type_id}`);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      
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
      <Animated.View style={[styles.root, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <View style={styles.inputContainer}>
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
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#EF233C" style={styles.loader} />
        ) : (
          <ClientCustomButton
            text="Iniciar Sesión"
            onPress={onClientSignInPressed}
          />
        )}

        <View style={styles.linkContainer}>
          <Pressable onPress={onClientForgotPasswordPressed}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </Pressable>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>¿No tienes una cuenta?</Text>
          <Pressable onPress={onClientSignUpPressed}>
            <Text style={styles.signUpButtonText}>Regístrate</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Pressable onPress={onBarSignInPressed} style={styles.barSignInButton}>
        <Ionicons name="business-outline" size={24} color="#8D99AE" />
        <Text style={styles.barSignInText}>Iniciar como Bar</Text>
      </Pressable>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: '70%',
    height: 120,
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  linkContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  linkText: {
    color: '#2B2D42',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#8D99AE',
    fontSize: 16,
  },
  signUpButtonText: {
    color: '#EF233C',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  barSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  barSignInText: {
    color: '#8D99AE',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ClientSignInScreen;

