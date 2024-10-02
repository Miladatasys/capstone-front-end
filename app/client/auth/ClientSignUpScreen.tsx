import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from "expo-router";
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';
import Toast from 'react-native-toast-message';

const ClientSignUpScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();

  const onRegisterPressed = () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos Requeridos',
        text2: 'Todos los campos son obligatorios. Por favor, complétalos.',
      });
      return;
    }

    if (password !== confirmPassword) {
      // Mostrar mensaje Toast de error si las contraseñas no coinciden
      Toast.show({
        type: 'error',
        text1: 'Error de Registro',
        text2: 'Las contraseñas no coinciden.',
      });
      return;
    }

    // Mostrar mensaje Toast de éxito
    Toast.show({
      type: 'success',
      text1: 'Registro Exitoso',
      text2: 'Te has registrado correctamente.',
    });

    // Redirigir al usuario a iniciar sesión después de mostrar el Toast de éxito
    setTimeout(() => {
      router.push("/client/auth/ClientSignInScreen");
    }, 2000); // Esperar 2 segundos antes de redirigir
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

        <ClientCustomButton
          text="Registrarse"
          onPress={onRegisterPressed}
        />

        <ClientCustomButton
          text="¿Ya tienes una cuenta? Inicia sesión"
          onPress={onSignInPressed}
          type="TERTIARY"
        />
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
  primaryButton: {
    marginVertical: 10,
  },
});

export default ClientSignUpScreen;
