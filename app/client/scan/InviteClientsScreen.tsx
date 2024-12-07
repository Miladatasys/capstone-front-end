import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomButton from '../../../components/CustomButton/InviteCustomButton';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@env';

export default function InviteClientsScreen() {
  const [showQRCode, setShowQRCode] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { bar_id, table_id, user_id, orderTotal_id } = useLocalSearchParams();

  console.log('Log en la vista InviteClientsScreen');
  // console.log('Initial params:', { bar_id, table_id, user_id });

  const handleInvite = async () => {
    console.log('Iniciando proceso de creación de grupo...');
    try {
      setLoading(true);
      // console.log('Enviando solicitud al backend con los datos:', {
      //   name: `Grupo de ${user_id}`,
      //   creator_user_id: user_id,
      //   table_id: table_id,
      // });


      
      // Solicitud al backend para crear el grupo
      const response = await axios.post(`${API_URL}/api/creategroup`, {
        name: `Grupo de ${user_id}`,
        creator_user_id: user_id,
        table_id: table_id
      });

      // console.log('Respuesta del backend:', response.data);

      const { group_id } = response.data;
      console.log('Grupo creado exitosamente. ID del grupo:', group_id);

      setGroupId(group_id);
      setShowQRCode(true);
    } catch (error) {
      console.error('Error al crear el grupo:', error.message);
      console.log('Detalles del error:', error.response ? error.response.data : error);
      alert('Hubo un error al crear el grupo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAlone = () => {
    console.log('Continuando hacia el menú...');
    router.push(`/client/bar-details/${bar_id}?&user_id=${user_id}&table_id=${table_id}&bar_id=${bar_id}&orderTotal_id=${orderTotal_id}`);
  };

  const handleGoToMenu = () => {
    console.log('Ir al menú después de crear el grupo.');
    router.push(`/client/bar-details/${bar_id}?user_id=${user_id}&table_id=${table_id}&bar_id=${bar_id}&group_id=${groupId}&orderTotal_id=${orderTotal_id}`);
  };

  const handleRescan = () => {
    console.log('Volviendo a escanear QR.');
    router.push('/client/scan');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.rescanButton} onPress={handleRescan}>
        <Ionicons name="scan-outline" size={24} color="#EF233C" />
        <Text style={styles.rescanText}>Volver a escanear</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#EF233C" />
      ) : !showQRCode ? (
        <>
          <Text style={styles.questionText}>¿Deseas invitar a más personas al pedido?</Text>
          <View style={styles.buttonContainer}>
            <CustomButton title="Invitar" onPress={handleInvite} style={styles.inviteButton} />
            
            <CustomButton title="Continuar solo" onPress={handleContinueAlone} style={styles.continueButton} />
          </View>
        </>
      ) : (
        <View style={styles.qrContainer}>
          <Text style={styles.qrText}>Escanea este código QR para unirte al pedido:</Text>
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={`{"bar_id": "${bar_id}", "table_id": "${table_id}", "user_id": "${user_id}", "group_id": "${groupId}", "orderTotal_id": "${orderTotal_id}", "creator_user_id": "${user_id}"}`}
              size={200}
            />
          </View>
          <CustomButton title="Ir a la Carta" onPress={handleGoToMenu} style={styles.menuButton} />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  rescanButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B2D42',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 1,
  },
  rescanText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2B2D42',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  inviteButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  continueButton: {
    backgroundColor: '#2B2D42',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  qrText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  qrCodeWrapper: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuButton: {
    marginTop: 20,
    backgroundColor: '#2B2D42',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});