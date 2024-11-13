
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

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);
    console.log('Datos escaneados correctamente..');

    try {
      // Asegúrate de que los datos escaneados del QR son un JSON válido
      const parsedData = JSON.parse(data);
      const { bar_id, table_id } = parsedData;

      if (!bar_id || !table_id) {
        throw new Error('Código QR inválido, falta bar_id o table_id');
      }

      // Pasamos los parámetros a la siguiente vista
      setScannedData({ bar_id, table_id });

      console.log('Datos procesados bar_id:', bar_id, 'table_id:', table_id);
      setTimeout(() => {
        console.log('Redirigiendo a la vista del bar con:', { bar_id, table_id });
        // Asegúrate de pasar table_id como query parameter
        //router.push(`/client/bar-details/${bar_id}?bar_id=${bar_id}&table_id=${table_id}`);
        router.push(`/client/scan/InviteClientsScreen?bar_id=${bar_id}&table_id=${table_id}`);

      }, 2000);

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


// Para futura implementación revisar
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import { useState, useEffect } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import Toast from 'react-native-toast-message';
// import SuccessToast from '../../../components/Bar/SuccessToast/SuccessToast';
// import { Ionicons } from '@expo/vector-icons';

// export default function ClientScanScreen() {
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanned, setScanned] = useState(false); // Controla si ya se ha escaneado un QR
//   const [scannedData, setScannedData] = useState(null); // Guarda los datos escaneados del QR
//   const router = useRouter();
//   const { bar_id } = useLocalSearchParams(); // Obtiene bar_id de los parámetros de la URL

//   useEffect(() => {
//     if (!permission) {
//       requestPermission(); // Solicita permisos de la cámara al usuario
//     }
//   }, [permission]);

//   // Si no hay permisos, no se muestra la cámara
//   if (!permission) {
//     return <View />;
//   }

//   // Si los permisos no han sido otorgados, muestra un mensaje solicitando permisos
//   if (!permission.granted) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionMessage}>Se necesita permiso para acceder a la cámara</Text>
//         <Pressable onPress={requestPermission} style={styles.permissionButton}>
//           <Text style={styles.permissionButtonText}>Conceder permiso</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   // Función que maneja el QR escaneado
//   const handleBarcodeScanned = ({ data }) => {
//     if (scanned) return; // Si ya se ha escaneado, evita que se escanee nuevamente

//     setScanned(true); // Marca que ya se ha escaneado
//     const tableId = processBarCodeData(data); // Procesa los datos del QR para obtener el table_id

//     if (!tableId) {
//       // Si no se puede procesar el QR, muestra un error
//       Toast.show({
//         type: 'error',
//         text1: 'Error al escanear',
//         text2: 'No se pudo procesar el código QR. Inténtalo de nuevo.',
//       });
//       setScanned(false); // Permite volver a escanear
//       return;
//     }

//     setScannedData(tableId); // Guarda el ID de la mesa

//     // Navega a la página de detalles del bar con bar_id y tableId
//     setTimeout(() => {
//       router.push(`/client/bar-details/${bar_id}?tableId=${tableId}`);
//     }, 2000); // Retraso para permitir mostrar una notificación de éxito
//   };

//   // Función para procesar el QR y obtener el ID de la mesa
//   function processBarCodeData(data) {
//     try {
//       // Intenta procesar el QR como si fuera una URL
//       const url = new URL(data);
//       const tableId = url.searchParams.get('tableId'); // Obtiene el tableId de los parámetros
//       if (tableId) return tableId;

//       // Si no contiene tableId, obtiene el último segmento de la ruta de la URL
//       const pathParts = url.pathname.split('/');
//       return pathParts[pathParts.length - 1];
//     } catch (error) {
//       // Si no es una URL válida, devuelve el texto plano del QR
//       return data;
//     }
//   }

//   // Cambia la cámara frontal o trasera
//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   return (
//     <View style={styles.container}>
//       {/* Si no se ha escaneado, muestra la cámara */}
//       {!scanned && (
//         <CameraView
//           style={StyleSheet.absoluteFillObject}
//           facing={facing}
//           onBarcodeScanned={handleBarcodeScanned} // Escanea el QR
//         >
//           <View style={styles.cameraOverlay}>
//             <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraFacing}>
//               <Text style={styles.cameraButtonText}>Cambiar Cámara</Text>
//             </TouchableOpacity>
//           </View>
//         </CameraView>
//       )}

//       {/* Muestra los datos de la mesa escaneada */}
//       {scannedData && (
//         <View style={styles.dataContainer}>
//           <Text style={styles.dataTitle}>Número de Mesa:</Text>
//           <Text style={styles.dataText}>{scannedData}</Text>
//         </View>
//       )}

//       {/* Botón para reintentar escaneo */}
//       {scanned && (
//         <Pressable
//           onPress={() => {
//             setScanned(false);
//             setScannedData(null); // Reinicia el estado para volver a escanear
//           }}
//           style={({ pressed }) => [
//             styles.scanAgainButton,
//             pressed ? styles.scanAgainButtonPressed : null,
//           ]}
//         >
//           <Ionicons name="refresh" size={20} color="#EF233C" style={styles.icon} />
//           <Text style={styles.scanAgainButtonText}>Escanear de nuevo</Text>
//         </Pressable>
//       )}

//       {scanned && <SuccessToast />} {/* Muestra el mensaje de éxito al escanear */}
//       <Toast /> {/* Maneja los mensajes Toast para mostrar errores y éxitos */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   // Estilos para el contenedor principal
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//     backgroundColor: '#fff',
//   },
//   // Estilos para el contenedor de permisos
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f8f8f8',
//   },
//   permissionMessage: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   permissionButton: {
//     backgroundColor: '#EF233C',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   permissionButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   cameraOverlay: {
//     position: 'absolute',
//     top: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   cameraButton: {
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   cameraButtonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   dataContainer: {
//     width: '90%',
//     padding: 15,
//     backgroundColor: '#F8F8F8',
//     borderRadius: 10,
//     marginBottom: 20,
//     borderColor: '#E4E5E1',
//     borderWidth: 1,
//     alignItems: 'flex-start',
//     alignSelf: 'flex-start',
//   },
//   dataTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2B2D42',
//     marginBottom: 5,
//   },
//   dataText: {
//     fontSize: 16,
//     color: '#2B2D42',
//   },
//   scanAgainButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     borderColor: '#EF233C',
//     borderWidth: 1.5,
//     backgroundColor: '#fff',
//     alignSelf: 'flex-start',
//     marginLeft: 20,
//     marginBottom: 20,
//   },
//   scanAgainButtonPressed: {
//     backgroundColor: '#F8F8F8',
//   },
//   scanAgainButtonText: {
//     color: '#EF233C',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   icon: {
//     marginRight: 5,
//   },
// });
