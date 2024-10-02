import React, { useState } from 'react';
import { View, Image, StyleSheet, useWindowDimensions, ScrollView, Text, Pressable } from 'react-native';
import { useRouter } from "expo-router";
import Logo from '../../../assets/images/Logo_2.png'; // Ensure this path is correct and the file exists
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';


const ClientConfirmEmailScreen: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const router = useRouter();

  const onConfirmPressed = () => {
    console.warn('Confirm Email');
  };

  const onResendCodePressed = () => {
    console.warn('Resend Code');
  };

  const onBackToSignInPressed = () => {
    router.push("/client/auth/ClientSignInScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        
        <Text style={styles.title}>Confirma tu correo electrónico</Text>

        <ClientCustomInput
          placeholder="Ingresa el código de confirmación"
          value={code}
          setvalue={setCode}
        />

        <Pressable onPress={onConfirmPressed} style={styles.button}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </Pressable>

        <Pressable onPress={onResendCodePressed} style={styles.tertiaryButton}>
          <Text style={styles.tertiaryButtonText}>Reenviar código</Text>
        </Pressable>

        <Pressable onPress={onBackToSignInPressed} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Volver a Iniciar Sesión</Text>
        </Pressable>
      </View>
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
    backgroundColor: '#fff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tertiaryButton: {
    marginTop: 10,
  },
  tertiaryButtonText: {
    color: '#EF233C',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  secondaryButton: {
    marginTop: 20,
  },
  secondaryButtonText: {
    color: '#EF233C',
    fontSize: 16,
  },
});

export default ClientConfirmEmailScreen;
