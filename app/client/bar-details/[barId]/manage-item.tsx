import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

const ManageItemScreen: React.FC = () => {
  const router = useRouter();
  const { barId, itemId, tableNumber } = useLocalSearchParams(); // Ahora obtenemos el barId, itemId y número de mesa
  const [comment, setComment] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null); // Para manejar la acción seleccionada

  // Función para notificar al bar con la acción seleccionada
  const handleNotifyBar = () => {
    if (!selectedAction) {
      Toast.show({
        type: 'error',
        text1: 'Acción no seleccionada',
        text2: 'Por favor selecciona una opción para continuar.',
        position: 'bottom',
      });
      return;
    }

    // Simulación de notificación exitosa
    Toast.show({
      type: 'success',
      text1: 'Notificación enviada',
      text2: 'La acción ha sido notificada al bar.',
      position: 'bottom',
    });

    // Aquí iría la integración con el backend para notificar la acción seleccionada
    // Ejemplo de código para la integración con el backend:
    /*
    fetch(`https://backend-url.com/api/bars/${barId}/items/${itemId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: selectedAction,
        comment,
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Lógica cuando la notificación se ha enviado exitosamente
      console.log(data);
    })
    .catch(error => {
      console.error('Error al notificar al bar:', error);
    });
    */
    setTimeout(() => {
        router.push(`/client/bar-details/${barId}`);
      }, 1500);
      
    // Redirigir a la pantalla de detalles del bar después de 1.5 segundos
    //setTimeout(() => {
      //router.push(`/client/bar-details/${barId}/index?tableNumber=${tableNumber}`);
    //}, 1500); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>Anterior</Text>
      </TouchableOpacity>

      <Text style={styles.unavailableLabel}>❌ Item no Disponible</Text>

      {/* Mostrar el número de mesa */}
      <Text style={styles.tableNumberText}>Número de Mesa: {tableNumber}</Text>

      {/* Gestión de Ítem */}
      <View style={styles.dropdown}>
        <TouchableOpacity
          onPress={() => setSelectedAction('sustituir')}
          style={[
            styles.dropdownOption,
            selectedAction === 'sustituir' && styles.selectedOption,
          ]}
        >
          <Text style={styles.dropdownText}>Sustituir Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedAction('eliminar')}
          style={[
            styles.dropdownOption,
            selectedAction === 'eliminar' && styles.selectedOption,
          ]}
        >
          <Text style={styles.dropdownText}>Eliminar Item</Text>
        </TouchableOpacity>
      </View>

      {/* Campo de Comentario */}
      <View style={styles.commentContainer}>
        <Text style={styles.commentLabel}>Notas Adicionales (Opcional)</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Comentario"
          value={comment}
          onChangeText={setComment}
          multiline
        />
      </View>

      {/* Botón para Notificar al Bar */}
      <TouchableOpacity style={styles.notifyButton} onPress={handleNotifyBar}>
        <Text style={styles.notifyButtonText}>Notificar a Bar</Text>
      </TouchableOpacity>

      {/* Mostrar Toast para feedback visual */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 18,
    color: '#EF233C',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
  },
  unavailableLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF233C',
    marginBottom: 16,
  },
  tableNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  dropdown: {
    marginBottom: 20,
  },
  dropdownOption: {
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedOption: {
    backgroundColor: '#D3D3D3',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 60,
    textAlignVertical: 'top',
  },
  notifyButton: {
    backgroundColor: '#EF233C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  notifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageItemScreen;
