import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';
import Toast from 'react-native-toast-message';

const BarConfirmEmailScreen: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const router = useRouter();

  const onConfirmPressed = () => {
    if (code.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Código Requerido',
        text2: 'Por favor ingresa el código de confirmación.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Confirmación Exitosa',
      text2: 'Tu correo ha sido confirmado.',
    });

    // Redirige a la pantalla de nueva contraseña después de confirmar
    setTimeout(() => {
      router.push("/bar/auth/BarNewPasswordScreen");
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.root}>
        <Text style={styles.title}>Confirmar Correo</Text>

        <ClientCustomInput
          placeholder="Código de Confirmación"
          value={code}
          setvalue={setCode}
        />

        <ClientCustomButton
          text="Confirmar"
          onPress={onConfirmPressed}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
});

export default BarConfirmEmailScreen;
