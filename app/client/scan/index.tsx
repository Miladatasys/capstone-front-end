import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import SuccessToast from '../../../components/Bar/SuccessToast/SuccessToast';
import { Ionicons } from '@expo/vector-icons';

export default function ClientScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
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

  const handleBarcodeScanned = ({ data }) => {
    setScanned(true);
  
    const barId = processBarCodeData(data);
    
    if (!barId) {
      Toast.show({
        type: 'error',
        text1: 'Error al escanear',
        text2: 'No se pudo procesar el código QR. Inténtalo de nuevo.',
      });
      setScanned(false);
      return;
    }

    setScannedData(barId);

    setTimeout(() => {
      router.push(`/client/bar-details/${barId}`);
    }, 2000);
  };

  function processBarCodeData(data) {
    try {
      const url = new URL(data);
      const barId = url.searchParams.get('barId');
      if (barId) return barId;

      const pathParts = url.pathname.split('/');
      const potentialBarId = pathParts[pathParts.length - 1]; 
      return potentialBarId;
    } catch (error) {
      return data;
    }
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
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
          <Text style={styles.dataTitle}>Datos escaneados:</Text>
          <Text style={styles.dataText}>{scannedData}</Text>
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
    alignItems: 'flex-start', // Alinea el texto a la izquierda
    alignSelf: 'flex-start', // Mantiene el contenedor alineado a la izquierda
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
