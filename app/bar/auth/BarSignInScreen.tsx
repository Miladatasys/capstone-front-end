import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';


const BarSignInScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onBarSignInPressed = () => {
    console.log('Inicio de sesión de bar con', email, password);
    router.push("/bar/orders/Orders"); 
  };

  const onBarSignUpPressed = () => {
    router.push("/bar/auth/BarSignUpScreen");
  };

  const onBarForgotPasswordPressed = () => { 
    router.push("/bar/auth/BarForgotPasswordScreen");
  };

  return (
    <View style={styles.container}>
      {/* Añadir el logo */}
      <Image source={require('../../../assets/images/Logo_2.png')} style={styles.logo} />
      
      <Text style={styles.title}>Iniciar sesión en Bar</Text>
      
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <TouchableOpacity style={styles.button} onPress={onBarSignInPressed}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onBarSignUpPressed}>
        <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBarForgotPasswordPressed}>
        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 150,  // Ajusta el tamaño según sea necesario
    height: 150, // Ajusta el tamaño según sea necesario
    marginBottom: 30, // Espacio entre el logo y el título
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#EF233C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#0077b6',
    marginTop: 10,
    fontSize: 16,
  },
});

export default BarSignInScreen;
