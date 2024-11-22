import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';

const UpdateProfileScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', phoneNumber: '' });
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = 'El nombre es obligatorio';
        } else if (value.trim().length < 2) {
          error = 'El nombre debe tener al menos 2 caracteres';
        } else if (value.trim().length > 50) {
          error = 'El nombre no puede exceder los 50 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          error = 'El nombre solo puede contener letras y espacios';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'El correo electrónico es obligatorio';
        } else if (!validateEmail(value)) {
          error = 'Ingresa un correo electrónico válido';
        }
        break;
      case 'phoneNumber':
        if (!value.trim()) {
          error = 'El número de teléfono es obligatorio';
        } else if (!validatePhoneNumber(value)) {
          error = 'Ingresa un número de teléfono válido (8 -10 dígitos)';
        }
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const debouncedValidateField = useCallback(
    debounce((field: string, value: string) => validateField(field, value), 300),
    []
  );

  const handleUpdateProfile = () => {
    validateField('name', name);
    validateField('email', email);
    validateField('phoneNumber', phoneNumber);

    if (!name.trim() || !email.trim() || !phoneNumber.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos Vacíos',
        text2: 'Todos los campos son obligatorios.',
      });
      return;
    }

    if (errors.name || errors.email || errors.phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Campos Inválidos',
        text2: 'Por favor, corrige los errores en el formulario.',
      });
      return;
    }

    // Simulación de actualización exitosa
    Toast.show({
      type: 'success',
      text1: 'Perfil Actualizado',
      text2: 'Tu perfil se ha actualizado correctamente.',
    });

    setTimeout(() => {
      router.push('/client/recommendations/RecommendationsScreen');
    }, 2000);
  };

  const InputField = ({ icon, placeholder, value, onChangeText, keyboardType, field }) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={24} color="#8D99AE" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          debouncedValidateField(field, text);
        }}
        keyboardType={keyboardType}
        accessibilityLabel={placeholder}
      />
      {errors[field] ? (
        <Text style={styles.errorText}>{errors[field]}</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Actualizar Perfil</Text>
          
          <InputField
            icon="person-outline"
            placeholder="Nombre Completo"
            value={name}
            onChangeText={setName}
            keyboardType="default"
            field="name"
          />
          <InputField
            icon="mail-outline"
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            field="email"
          />
          <InputField
            icon="call-outline"
            placeholder="Número de Teléfono"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            field="phoneNumber"
          />

          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={handleUpdateProfile}
            accessibilityRole="button"
            accessibilityLabel="Actualizar Perfil"
          >
            <Text style={styles.confirmButtonText}>Actualizar Perfil</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputIcon: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    paddingLeft: 50,
    fontSize: 16,
    color: '#2B2D42',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorText: {
    color: '#EF233C',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 15,
  },
  confirmButton: {
    backgroundColor: '#2B2D42',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateProfileScreen;

