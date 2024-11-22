import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AccountSettingsScreen: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: () => {
            // Lógica para cerrar sesión
            console.warn("Sesión cerrada");
            router.push('/client/auth/ClientSignInScreen');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  const SettingOption = ({ icon, text, onPress }) => (
    <TouchableOpacity
      style={styles.optionButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={text}
    >
      <Ionicons name={icon} size={24} color="#2B2D42" style={styles.optionIcon} />
      <Text style={styles.optionText}>{text}</Text>
      <Ionicons name="chevron-forward" size={24} color="#8D99AE" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2B2D42" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Mi Cuenta</Text>
          <Text style={styles.subtitle}>Gestiona tu información personal y preferencias</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <SettingOption
          icon="person-outline"
          text="Actualizar Perfil"
          onPress={() => router.push('/client/account/UpdateProfileScreen')}
        />
        <SettingOption
          icon="lock-closed-outline"
          text="Cambiar Contraseña"
          onPress={() => router.push('/client/account/ChangePasswordScreen')}
        />
        <SettingOption
          icon="log-out-outline"
          text="Cerrar Sesión"
          onPress={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EDF2F4',
  },
  backButton: {
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8D99AE',
  },
  optionsContainer: {
    padding: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: '#2B2D42',
  },
});

export default AccountSettingsScreen;

