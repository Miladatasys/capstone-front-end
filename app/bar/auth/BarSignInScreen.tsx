import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const BarSignInScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onBarSignInPressed = () => {
    console.log('Inicio de sesión de bar con', email, password);
    router.push("/bar/notifications"); 
  };

  const onBarSignUpPressed = () => {
    router.push("/bar/auth/BarSignUpScreen");
  };

  const onBarForgotPasswordPressed = () => { 
    router.push("/bar/auth/BarForgotPasswordScreen");
  };

  const onWaiterAccessPressed = () => {
    // Acceso directo para el mesero sin login
    router.push("/waiter/WaiterHomeScreen");
  };

  const onClientAccessPressed = () => {
    // Navegar a la pantalla de inicio de sesión del cliente
    router.push("/client/auth/ClientSignInScreen");
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

      {/* Opción minimalista para el mesero */}
      <TouchableOpacity onPress={onWaiterAccessPressed} style={styles.waiterButton}>
        <Text style={styles.waiterButtonText}>Acceder como mesero</Text>
      </TouchableOpacity>

      {/* Opción minimalista y elegante para el cliente */}
      <TouchableOpacity onPress={onClientAccessPressed} style={styles.clientButton}>
        <Text style={styles.clientButtonText}>Iniciar como cliente</Text>
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
    width: 150, 
    height: 150, 
    marginBottom: 30, 
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
  waiterButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0096c7',
    borderRadius: 10,
    width: '60%',
  },
  waiterButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  clientButton: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2B2D42',
    borderRadius: 10,
    width: '60%',
  },
  clientButtonText: {
    color: '#2B2D42',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default BarSignInScreen;