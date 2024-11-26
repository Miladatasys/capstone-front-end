import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../../assets/images/Logo_2.png';
import ClientCustomInput from '../../../components/CustomInput/ClientCustomInput';
import ClientCustomButton from '../../../components/CustomButton/ClientCustomButton';

const BarSignInScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Mesero');
  const [showRoleOptions, setShowRoleOptions] = useState(false);

  const roles = ['Mesero', 'Barra', 'Cocina', 'Administrador'];

  const onBarSignInPressed = () => {
    setLoading(true);
    console.log('Inicio de sesión de bar con', email, password, 'Rol:', selectedRole);
    setTimeout(() => {
      setLoading(false);
      switch (selectedRole) {
        case 'Mesero':
          router.push("/waiter/WaiterHomeScreen");
          break;
        case 'Barra':
          router.push("/bar/notifications");
          break;
        case 'Cocina':
          router.push("/Kitchen/Notifications");
          break;
        case 'Administrador':
          router.push("/barAdmin/mainScreen");          
          break;
        default:
          console.error('Rol no reconocido');
      }
    }, 2000);
  };

  const onBarSignUpPressed = () => {
    router.push("/bar/auth/BarSignUpScreen");
  };

  const onBarForgotPasswordPressed = () => { 
    router.push("/bar/auth/BarForgotPasswordScreen");
  };

  const onClientAccessPressed = () => {
    router.push("/client/auth/ClientSignInScreen");
  };

  const toggleRoleOptions = () => {
    setShowRoleOptions(!showRoleOptions);
  };

  const selectRole = (role: string) => {
    setSelectedRole(role);
    setShowRoleOptions(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Iniciar sesión en Bar</Text>

        <View style={styles.inputContainer}>
          <ClientCustomInput
            placeholder="Correo electrónico"
            value={email}
            setvalue={setEmail}
          />
          <ClientCustomInput
            placeholder="Contraseña"
            value={password}
            setvalue={setPassword}
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={toggleRoleOptions} style={styles.roleSelector}>
            <Text style={styles.roleSelectorText}>{selectedRole}</Text>
            <Ionicons name={showRoleOptions ? "chevron-up" : "chevron-down"} size={24} color="#8D99AE" />
          </TouchableOpacity>
          {showRoleOptions && (
            <View style={styles.roleOptions}>
              {roles.map((role) => (
                <TouchableOpacity key={role} onPress={() => selectRole(role)} style={styles.roleOption}>
                  <Text style={styles.roleOptionText}>{role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#EF233C" style={styles.loader} />
        ) : (
          <ClientCustomButton
            text="Iniciar Sesión"
            onPress={onBarSignInPressed}
          />
        )}

        <TouchableOpacity onPress={onBarForgotPasswordPressed}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={onBarSignUpPressed}>
            <Text style={styles.signUpButtonText}>Regístrate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.alternateAccessContainer}>
          <TouchableOpacity onPress={onClientAccessPressed} style={styles.clientButton}>
            <Ionicons name="people-outline" size={24} color="#8D99AE" />
            <Text style={styles.clientButtonText}>Iniciar como cliente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  linkText: {
    color: '#0077b6',
    marginTop: 15,
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#8D99AE',
    fontSize: 14,
  },
  signUpButtonText: {
    color: '#EF233C',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  alternateAccessContainer: {
    width: '100%',
    marginTop: 30,
  },
  clientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  clientButtonText: {
    color: '#8D99AE',
    fontSize: 16,
    marginLeft: 10,
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8D99AE',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  roleSelectorText: {
    fontSize: 16,
    color: '#2B2D42',
  },
  roleOptions: {
    borderWidth: 1,
    borderColor: '#8D99AE',
    borderRadius: 5,
    marginTop: -10,
    marginBottom: 10,
  },
  roleOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#8D99AE',
  },
  roleOptionText: {
    fontSize: 16,
    color: '#2B2D42',
  },
});

export default BarSignInScreen;

