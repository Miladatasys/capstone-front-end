import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';

const BarSignInScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onBarSignInPressed = () => {
    setLoading(true);
    console.log('Inicio de sesión de bar con', email, password);
    setTimeout(() => {
      setLoading(false);
      router.push("/bar/notifications");
    }, 2000); // Simulando una carga de 2 segundos
  };

  const onBarSignUpPressed = () => {
    router.push("/bar/auth/BarSignUpScreen");
  };

  const onBarForgotPasswordPressed = () => { 
    router.push("/bar/auth/BarForgotPasswordScreen");
  };

  const onWaiterAccessPressed = () => {
    router.push("/waiter/WaiterHomeScreen");
  };

  const onClientAccessPressed = () => {
    router.push("/client/auth/ClientSignInScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Iniciar sesión en Bar</Text>

        <View style={styles.inputContainer}>
          <ClientCustomInput
            placeholder="Correo electrónico"
            value={email}
            setvalue={setEmail}
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
            onPress={onBarSignInPressed}
          />
        )}

        <TouchableOpacity onPress={onBarForgotPasswordPressed}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={onBarSignUpPressed}>
            <Text style={styles.signUpButtonText}>Regístrate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.alternateAccessContainer}>
          <ClientCustomButton
            text="Acceder como mesero"
            onPress={onWaiterAccessPressed}
            type="SECONDARY"
          />
          <TouchableOpacity onPress={onClientAccessPressed} style={styles.clientButton}>
            <Ionicons name="people-outline" size={24} color="#8D99AE" />
            <Text style={styles.clientButtonText}>Iniciar como cliente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  linkText: {
    color: '#0077b6',
    marginTop: 15,
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#8D99AE',
    fontSize: 14,
  },
  signUpButtonText: {
    color: '#EF233C',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  alternateAccessContainer: {
    width: '100%',
    marginTop: 30,
  },
  clientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  clientButtonText: {
    color: '#8D99AE',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default BarSignInScreen;

