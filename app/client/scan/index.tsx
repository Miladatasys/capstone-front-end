import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Asegúrate de importar useLocalSearchParams
import Toast from 'react-native-toast-message';
import SuccessToast from '../../../components/Bar/SuccessToast/SuccessToast';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@env';

export default function ClientScanScreen() {
  const { user_id } = useLocalSearchParams(); // Aquí se obtiene el user_id de los parámetros de la URL
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false); // Para controlar si ya se ha escaneado
  const [scannedData, setScannedData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>Se necesita permiso para acceder a la cámara</Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Conceder permiso</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) return;

    setScanned(true);
    console.log('Datos escaneados correctamente..');

    try {
        const parsedData = JSON.parse(data);
        const { bar_id, table_id, group_id, orderTotal_id: exOrderTotal_id } = parsedData;

        console.log("ParseData: ", parsedData);
        if (!bar_id || !table_id) {
            throw new Error('Código QR inválido, falta bar_id o table_id');
        }

        let orderTotal_id = exOrderTotal_id;

        // Crear una nueva sesión de pedido si no existe
        if (!orderTotal_id) {
            try {
                const createOrderResponse = await axios.post(`${API_URL}/api/orders/create-session`, {
                    user_id,
                    bar_id,
                    table_id
                });
                orderTotal_id = createOrderResponse.data.orderTotal_id;
                console.log('Sesión creada, orderTotal_id: ', orderTotal_id);
            } catch (error) {
                console.error('Error al crear la sesión de pedido:', error.response?.data || error.message);
                Toast.show({
                    type: 'error',
                    text1: 'Error al crear sesión',
                    text2: error.response?.data?.message || 'Inténtalo de nuevo.',
                });
                setScanned(false);
                return;
            }
        }

        // Si tiene group_id, es un QR de grupo
        if (group_id != undefined) {
            console.log('QR de grupo detectado');
            try {
                const response = await axios.post(`${API_URL}/api/group/${group_id}/join`, {
                    user_id,
                });
                console.log('Usuario unido al grupo exitosamente:', response.data);

                Toast.show({
                    type: 'success',
                    text1: 'Unión exitosa',
                    text2: 'Te has unido al grupo correctamente.',
                });

                // Redirigir a la vista del grupo
                router.push(`/client/bar-details/${bar_id}?bar_id=${bar_id}&table_id=${table_id}&user_id=${user_id}&group_id=${group_id}&orderTotal_id=${orderTotal_id}&creator_user_id=${user_id}`);
            } catch (error) {
                console.error('Error al unirse al grupo:', error.response?.data || error.message);
                Toast.show({
                    type: 'error',
                    text1: 'Error al unirse al grupo',
                    text2: error.response?.data?.message || 'Inténtalo de nuevo.',
                });
                setScanned(false);
            }
        } else {
            // Aquí manejamos el flujo normal si no es un QR de grupo
            console.log('QR de mesa');
            console.log('Datos procesados bar_id:', bar_id, 'table_id:', table_id, 'user_id: ', user_id, 'orderTotal_id: ', orderTotal_id);
            router.push(`/client/scan/InviteClientsScreen?bar_id=${bar_id}&table_id=${table_id}&user_id=${user_id}&orderTotal_id=${orderTotal_id}&creator_user_id=${user_id}`);
        }

    } catch (error) {
        console.error('Error al procesar el código QR:', error.message);
        Toast.show({
            type: 'error',
            text1: 'Error al escanear QR',
            text2: 'Código QR no válido o incompleto. Inténtalo de nuevo.',
        });
        setScanned(false); // Permitir volver a escanear
    }
};

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          onBarcodeScanned={handleBarcodeScanned} // Desactivado si ya escaneó
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraFacing}>
              <Text style={styles.cameraButtonText}>Cambiar Cámara</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {scannedData && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Número de Bar:</Text>
          <Text style={styles.dataText}>{scannedData.bar_id.toString()}</Text>
          <Text style={styles.dataTitle}>Número de Mesa:</Text>
          <Text style={styles.dataText}>{scannedData.table_id.toString()}</Text>
          {/* {scannedData.group_id && (
            <Text style={styles.dataTitle}>ID del Grupo:</Text>
            <Text style={styles.dataText}>{scannedData.group_id}</Text>
          )} */}
        </View>
      )}

      {scanned && (
        <Pressable
          onPress={() => {
            setScanned(false);
            setScannedData(null); // Oculta los datos al reintentar
          }}
          style={({ pressed }) => [
            styles.scanAgainButton,
            pressed ? styles.scanAgainButtonPressed : null,
          ]}
        >
          <Ionicons name="refresh" size={20} color="#EF233C" style={styles.icon} />
          <Text style={styles.scanAgainButtonText}>Escanear de nuevo</Text>
        </Pressable>
      )}

      {scanned && <SuccessToast />}

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  permissionMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#EF233C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  dataContainer: {
    width: '90%',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#E4E5E1',
    borderWidth: 1,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 16,
    color: '#2B2D42',
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderColor: '#EF233C',
    borderWidth: 1.5,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 20,
  },
  scanAgainButtonPressed: {
    backgroundColor: '#F8F8F8',
  },
  scanAgainButtonText: {
    color: '#EF233C',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  icon: {
    marginRight: 5,
  },
});
