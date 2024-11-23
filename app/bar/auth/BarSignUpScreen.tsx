import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from "expo-router";
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';
import Toast from 'react-native-toast-message';

const BarSignUpScreen: React.FC = () => {
  const [barName, setBarName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();

  const onRegisterPressed = () => {
    if (!barName.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos Requeridos',
        text2: 'Todos los campos son obligatorios. Por favor, complétalos.',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error de Registro',
        text2: 'Las contraseñas no coinciden.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Registro Exitoso',
      text2: 'Tu cuenta de bar ha sido creada.',
    });

    setTimeout(() => {
      router.push("/bar/auth/BarSignInScreen");
    }, 2000);
  };

  const onSignInPressed = () => {
    router.push("/bar/auth/BarSignInScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Registro de Bar</Text>

        <ClientCustomInput
          placeholder="Nombre del Bar"
          value={barName}
          setvalue={setBarName}
        />
        <ClientCustomInput
          placeholder="Correo Electrónico"
          value={email}
          setvalue={setEmail}
        />
        <ClientCustomInput
          placeholder="Teléfono"
          value={phone}
          setvalue={setPhone}
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
});

export default BarSignUpScreen;