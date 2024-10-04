import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

const UpdateProfileScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  // Validación de correo electrónico
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación del número de teléfono
  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Manejar la actualización del perfil
  const handleUpdateProfile = () => {
    if (!name || !email || !phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Campos Vacíos',
        text2: 'Todos los campos son obligatorios.',
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Correo No Válido',
        text2: 'Por favor ingresa un correo electrónico válido.',
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Toast.show({
        type: 'error',
        text1: 'Número de Teléfono No Válido',
        text2: 'Por favor ingresa un número de teléfono válido (de 7 a 15 dígitos).',
      });
      return;
    }

    // Simulación de actualización exitosa
    Toast.show({
      type: 'success',
      text1: 'Perfil Actualizado',
      text2: 'Tu perfil se ha actualizado correctamente.',
    });

    // Redirigir al usuario a la pantalla principal después de la actualización
    setTimeout(() => {
      router.push('/client/recommendations/RecommendationsScreen');
    }, 2000); // Se espera 2 segundos para que el Toast sea visible

    // TODO: Integración con el backend para actualizar el perfil del usuario
    /*
    axios.post('https://mi-backend.com/api/user/update-profile', {
      name,
      email,
      phoneNumber,
    })
      .then(response => {
        Toast.show({
          type: 'success',
          text1: 'Perfil Actualizado',
          text2: 'Tu perfil se ha actualizado correctamente.',
        });
        // Redirigir al inicio después de la actualización exitosa
        setTimeout(() => {
          router.push('/client/recommendations/RecommendationsScreen');
        }, 2000);
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo actualizar el perfil. Inténtalo nuevamente.',
        });
      });
    */
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Actualizar Perfil</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre Completo"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Teléfono"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleUpdateProfile}>
          <Text style={styles.confirmButtonText}>Actualizar Perfil</Text>
        </TouchableOpacity>
        
        <Toast />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateProfileScreen;
