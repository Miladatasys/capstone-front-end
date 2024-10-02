import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import Logo from '../assets/images/Logo_2.png'; // Asegúrate de que esta ruta sea correcta

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  const onLogoPressed = () => {
    // Navegar al inicio de sesión del cliente
    router.push("/client/auth/ClientSignInScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onLogoPressed}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default WelcomeScreen;
