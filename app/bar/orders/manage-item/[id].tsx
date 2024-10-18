import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Order {
  id: string;
  table: string;
  items: string[];
  total: number;
  status: string;
  unavailableItem: string;
}

const ManageItemScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Simulación de datos del pedido (luego conectarlo con el backend)
  const order: Order = {
    id: id as string,
    table: '3',
    items: ['Bebida 1', 'Bebida 2', 'Bebida 3', 'Bebida 4'],
    total: 13180,
    status: 'Pendiente',
    unavailableItem: 'Bebida 1', // Producto no disponible
  };

  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Manejar la opción seleccionada del menú
  const handleOptionSelect = (option: string) => {
    setSelectedAction(option);
  };

  // Notificar al cliente sobre el producto no disponible
  const handleNotifyClient = () => {
    // Aquí puedes implementar la lógica de envío de la notificación al cliente vía backend
    Alert.alert('Notificación enviada', 'El cliente será notificado sobre el estado del producto.');
    router.push(`/bar/orders/${id}`);
  };

  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>Anterior</Text>
      </TouchableOpacity>

      {/* Etiqueta de producto no disponible */}
      <Text style={styles.unavailableLabel}>❌ Item no Disponible</Text>

      {/* Menú desplegable para gestionar el ítem */}
      <View style={styles.dropdown}>
        <TouchableOpacity onPress={() => handleOptionSelect('Sustituir')}>
          <Text style={selectedAction === 'Sustituir' ? styles.selectedOption : styles.option}>
            Sustituir Item
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOptionSelect('Eliminar')}>
          <Text style={selectedAction === 'Eliminar' ? styles.selectedOption : styles.option}>
            Eliminar Item
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notas adicionales */}
      <TextInput
        style={styles.input}
        placeholder="Comentario"
        value={additionalNotes}
        onChangeText={setAdditionalNotes}
      />

      {/* Botón para notificar al cliente */}
      <TouchableOpacity style={styles.notifyButton} onPress={handleNotifyClient}>
        <Text style={styles.notifyButtonText}>Notificar a Cliente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
  },
  unavailableLabel: {
    color: '#EF233C',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dropdown: {
    marginBottom: 16,
  },
  option: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  selectedOption: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#EF233C',
    borderRadius: 8,
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
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
