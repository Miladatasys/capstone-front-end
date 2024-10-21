// File: client/recommendations/RecommendationsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import SearchBar from '../../../components/CustomInput/SearchBar';
import BarCard from '../../../components/Bar/BarCard';
import BottomNavBar from '../../../components/Navigation/BottomNavBar';
import { useRouter } from 'expo-router';
import axios from 'axios'; // Asegúrate de tener axios instalado

const RecommendationsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [barData, setBarData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/api/bars');
        console.log("Datos de bares recibidos:", response.data);
        setBarData(response.data);
      } catch (error) {
        console.error('Error al obtener los bares:', error);
      }
    };

    fetchBarData();
  }, []);

  const onSelectBar = (bar_id: string) => {
    router.push(`/client/scan?barId=${bar_id}`);
    console.log("Navegando a escanear código QR para bar:", bar_id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <Text style={styles.title}>Recomendados</Text>
      <FlatList
        data={barData}
        renderItem={({ item }) => (
          <BarCard
            name={item.business_name || 'Nombre no disponible'}
            address={item.address || 'Dirección no disponible'}
            rating={typeof item.rating === 'number' ? item.rating : 0}  // Pasamos 0 si no hay rating
            image={item.image || 'https://via.placeholder.com/80'}
            onSelect={() => onSelectBar(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <BottomNavBar />
    </SafeAreaView>
  );
  
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    color: '#2B2D42',
  },
  list: {
    paddingBottom: 80,
    paddingTop: 10,
  },
});

export default RecommendationsScreen;
