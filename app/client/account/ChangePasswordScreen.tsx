import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';

const ChangePasswordScreen: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/client/account/AccountSettingsScreen');
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    
    let errorMessage = '';
    if (password.length < minLength) {
      errorMessage += 'La contraseña debe tener al menos 8 caracteres. ';
    }
    if (!hasNumber.test(password)) {
      errorMessage += 'Debe incluir al menos un número. ';
    }
    if (!hasUpperCase.test(password)) {
      errorMessage += 'Debe incluir al menos una letra mayúscula. ';
    }
    if (!hasLowerCase.test(password)) {
      errorMessage += 'Debe incluir al menos una letra minúscula. ';
    }
    if (!hasSpecialChar.test(password)) {
      errorMessage += 'Debe incluir al menos un carácter especial. ';
    }
    
    return errorMessage.trim();
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'currentPassword':
        if (!value.trim()) {
          error = 'La contraseña actual es obligatoria';
        }
        break;
      case 'newPassword':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        if (value !== newPassword) {
          error = 'Las contraseñas no coinciden';
        }
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const debouncedValidateField = useCallback(
    debounce((field: string, value: string) => validateField(field, value), 300),
    [newPassword]
  );

  const handleChangePassword = () => {
    validateField('currentPassword', currentPassword);
    validateField('newPassword', newPassword);
    validateField('confirmPassword', confirmPassword);

    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Campos Vacíos',
        text2: 'Todos los campos son obligatorios.',
      });
      return;
    }

    if (errors.currentPassword || errors.newPassword || errors.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Campos Inválidos',
        text2: 'Por favor, corrige los errores en el formulario.',
      });
      return;
    }

    // Simulación de éxito
    Toast.show({
      type: 'success',
      text1: 'Cambio de Contraseña',
      text2: 'Tu contraseña se ha cambiado correctamente.',
      onHide: () => {
        router.push('/client/recommendations/RecommendationsScreen');
      },
    });
  };

  const InputField = ({ icon, placeholder, value, onChangeText, field }) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={24} color="#8D99AE" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          debouncedValidateField(field, text);
        }}
        accessibilityLabel={placeholder}
      />
      {errors[field] ? (
        <Text style={styles.errorText}>{errors[field]}</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#2B2D42" />
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Cambiar Contraseña</Text>
          
          <InputField
            icon="lock-closed-outline"
            placeholder="Contraseña Actual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            field="currentPassword"
          />
          <InputField
            icon="key-outline"
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            field="newPassword"
          />
          <InputField
            icon="checkmark-circle-outline"
            placeholder="Confirmar Nueva Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            field="confirmPassword"
          />

          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={handleChangePassword}
            accessibilityRole="button"
            accessibilityLabel="Confirmar Cambio de Contraseña"
          >
            <Text style={styles.confirmButtonText}>Confirmar Cambio</Text>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});

export default ChangePasswordScreen;

