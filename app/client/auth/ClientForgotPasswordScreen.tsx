import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { useRouter } from "expo-router";
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import Toast from 'react-native-toast-message';

const ClientForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  const onSendPressed = () => {
    if (email.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Correo Requerido',
        text2: 'Por favor, ingresa tu correo electrónico para restablecer la contraseña.',
      });
      return;
    }

    // Lógica para enviar la solicitud de restablecimiento de contraseña (simulada)
    Toast.show({
      type: 'success',
      text1: 'Correo enviado',
      text2: 'Revisa tu correo electrónico para continuar con el restablecimiento de la contraseña.',
    });

    // Navegar a la pantalla para crear una nueva contraseña
    router.push("/client/auth/ClientNewPasswordScreen");
  };

  const onBackToSignInPressed = () => {
    router.push("/client/auth/ClientSignInScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Recupera tu contraseña</Text>

        <ClientCustomInput
          placeholder="Correo Electrónico"
          value={email}
          setvalue={setEmail}
        />

        <Pressable 
          onPress={onSendPressed} 
          style={({ pressed }) => [
            styles.button, 
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.buttonText}>Enviar</Text>
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
    backgroundColor: '#EF233C', // Color principal del botón "Enviar"
  },
  buttonPressed: {
    backgroundColor: '#C71F33', // Color del botón cuando es presionado
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

export default ClientForgotPasswordScreen;
