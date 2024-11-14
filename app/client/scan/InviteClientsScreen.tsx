import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomButton from '../../../components/CustomButton/InviteCustomButton';
import QRCode from 'react-native-qrcode-svg';

export default function InviteClientsScreen() {
  const [showQRCode, setShowQRCode] = useState(false);
  const router = useRouter();
  const { bar_id, table_id, user_id } = useLocalSearchParams(); // Recibe el `bar_id` como parámetro

  console.log('En la vista de InviteClientsScreen.tsx: bar_id: ',bar_id,'user_id: ',user_id,'table_id: ',table_id)
  //Generar QR con datos de direccionamiento
  const handleInvite = () => {
    // Muestra el código QR para que otros clientes puedan escanearlo
    setShowQRCode(true);
  };

  const handleContinueAlone = () => {
    // Redirige directamente al resumen del pedido sin invitar a otros
    //router.push(`/client/bar-details/${bar_id}/OrderSummaryScreen`);
    console.log('Pasando de vista InviteClients, continuando solo a bar','bar_id',bar_id,'user_id: ',user_id,'table_id: ',table_id)
    //router.push(`/client/bar-details/${bar_id}?&user_id=${user_id}&table_id=${table_id}`);
    router.push(`/client/bar-details/${bar_id}?&user_id=${user_id}&table_id=${table_id}&bar_id=${bar_id}`);
    
  };

  const handleGoToMenu = () => {
    // Redirige a la pantalla de productos (Carta) después de mostrar el QR
    console.log('Pasando de vista bar, luego de crear un QR de invitación:','bar_id',bar_id,'user_id: ',user_id,'table_id: ',table_id)
    router.push(`/client/bar-details/${bar_id}?user_id=${user_id}&table_id=${table_id}&bar_id=${bar_id}`);

    // router.push(`/client/bar-details/${bar_id}&${user_id}&${table_id}`);
  };

  return (
    <View style={styles.container}>
      {!showQRCode ? (
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
              value={`{"bar_id": "${bar_id}", "table_id": "${table_id}", "user_id": "${user_id}"}`}
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
