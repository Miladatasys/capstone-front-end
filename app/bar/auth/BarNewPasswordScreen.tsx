import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';
import Toast from 'react-native-toast-message';

const BarNewPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();

  const onSubmitPressed = () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos Requeridos',
        text2: 'Por favor completa los campos de contraseña.',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error de Contraseña',
        text2: 'Las contraseñas no coinciden.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Contraseña Restablecida',
      text2: 'Tu contraseña ha sido restablecida exitosamente.',
    });

    setTimeout(() => {
      router.push("/bar/auth/BarSignInScreen");
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Text style={styles.title}>Nueva Contraseña</Text>

        <ClientCustomInput
          placeholder="Nueva Contraseña"
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
          text="Restablecer"
          onPress={onSubmitPressed}
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
    backgroundColor: '#ffffff',
  },
  root: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 30,
  },
});

export default BarNewPasswordScreen;
