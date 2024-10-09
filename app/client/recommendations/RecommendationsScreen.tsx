import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import SearchBar from '../../../components/CustomInput/SearchBar';
import BarCard from '../../../components/Bar/BarCard';
import BottomNavBar from '../../../components/Navigation/BottomNavBar';
import { useRouter } from 'expo-router';

const RecommendationsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [barData, setBarData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Datos simulados mientras no esté disponible el backend
    setBarData([
      { id: '1', name: 'Bar A', address: 'Av. Vitacura 3520', rating: 4.5, image: 'https://via.placeholder.com/80' },
      { id: '2', name: 'Bar B', address: 'Av. Providencia 2120', rating: 4.0, image: 'https://via.placeholder.com/80' },
      { id: '3', name: 'Bar C', address: 'Av. Los Leones 1010', rating: 4.8, image: 'https://via.placeholder.com/80' },
    ]);
  }, []);

  const onSelectBar = (barId: string) => {
    router.push(`/client/scan?barId=${barId}`);
    console.log("Navegando a escanear código QR para bar:", barId);
  };
  
  
  

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <Text style={styles.title}>Recomendados</Text>
      <FlatList
        data={barData}
        renderItem={({ item }) => (
          <BarCard
            name={item.name}
            address={item.address}
            rating={item.rating}
            image={item.image}
            onSelect={() => onSelectBar(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
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
