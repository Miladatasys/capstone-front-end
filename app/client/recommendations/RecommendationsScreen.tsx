import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@env';
import FilterBar from '../../../components/Filter/FilterBar';
import BottomNavBar from '../../../components/Navigation/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const barImages = [
  'https://media.traveler.es/photos/633d897b51effea580f7528b/16:9/w_2580,c_limit/Paradiso_photo_bar4.jpg',
  'https://th.bing.com/th/id/R.aa73c7a3964704e842b4be96e91afa8f?rik=G8aLeU3PIM7Tng&riu=http%3a%2f%2fwww.guiadasemana.com.br%2fcontentFiles%2fsystem%2fpictures%2f2016%2f2%2f152390%2foriginal%2fbanana-cafe.jpg&ehk=Jx%2bjTAMZQJnIKcLh1XSPmbeL%2fIX9Ln2uCcVOhQCgXbY%3d&risl=&pid=ImgRaw&r=0',
  'https://th.bing.com/th/id/R.b925b57690e40a9130a465baed768650?rik=XTO%2bgtAXBGLODQ&pid=ImgRaw&r=0',
  'https://i0.wp.com/thehappening.com/wp-content/uploads/2018/10/barestoronto7.jpg?resize=1024%2C694&ssl=1',
  'https://vejasp.abril.com.br/wp-content/uploads/2018/09/ax2a46541.jpg?resize=420',
  'https://th.bing.com/th/id/OIP.rUAKIMhwM3IZGfX-Z0RbKwHaE8?rs=1&pid=ImgDetMain',
  'https://i.pinimg.com/originals/c8/fe/47/c8fe474ba451f04e28bada1d4c5bb162.jpg',
  'https://cdn.forbes.com.mx/2023/10/pexels-rachel-claire-5490965.webp'
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.starContainer}>
      {[...Array(fullStars)].map((_, i) => (
        <Text key={`full-${i}`} style={styles.starFull}>★</Text>
      ))}
      {halfStar && <Text style={styles.starHalf}>★</Text>}
      {[...Array(emptyStars)].map((_, i) => (
        <Text key={`empty-${i}`} style={styles.starEmpty}>★</Text>
      ))}
    </View>
  );
};

const RecommendationsScreen: React.FC = () => {
  const [barData, setBarData] = useState<any[]>([]);
  const [filteredBarData, setFilteredBarData] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const router = useRouter();
  const { user_id, user_type_id } = useLocalSearchParams();

  useEffect(() => {
    console.log('user_id:', user_id, 'user_type_id:', user_type_id);
  }, [user_id, user_type_id]);

  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bars`);
        // console.log("Datos de bares recibidos:", response.data);
        const barsWithImages = response.data.map((bar: any, index: number) => ({
          ...bar,
          image: barImages[index % barImages.length],
          rating: bar.rating || Math.random() * 5 // Use actual rating or generate a random one if not available
        }));
        setBarData(barsWithImages);
        setFilteredBarData(barsWithImages);
      } catch (error) {
        console.error('Error al obtener los bares:', error);
      }
    };

    fetchBarData();
  }, []);

  const onSelectBar = async (bar_id: string, barName: string) => {
    try {
      await AsyncStorage.setItem('selectedBarName', barName);
      router.push(`/client/scan?bar_id=${bar_id}&user_id=${user_id}&user_type_id=${user_type_id}`);
      console.log("Navegando a escanear código QR para bar:", bar_id);
    } catch (error) {
      console.error('Error al guardar el nombre del bar:', error);
    }
  };

  const handleSearch = (text: string) => {
    const filtered = barData.filter(bar => 
      bar.business_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBarData(filtered);
    setSortBy(''); // Reset sort when searching
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    if (newSortBy === 'rating') {
      const sorted = [...barData].sort((a, b) => b.rating - a.rating);
      setFilteredBarData(sorted); // Show all bars sorted by rating
    } else {
      setFilteredBarData([...barData]);
    }
  };

  const renderBarCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => onSelectBar(item.id, item.business_name)}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/120' }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.business_name || 'Nombre no disponible'}</Text>
        <Text style={styles.cardAddress}>{item.address || 'Dirección no disponible'}</Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FilterBar onSearch={handleSearch} onSortChange={handleSortChange} />
      <View style={styles.header}>
        <Text style={styles.title}>Bares</Text>
      </View>
      <FlatList
        data={filteredBarData}
        renderItem={renderBarCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        horizontal={false}
        showsVerticalScrollIndicator={false}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 4,
  },
  cardAddress: {
    fontSize: 14,
    color: '#8D99AE',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF233C',
    marginLeft: 4,
  },
  starContainer: {
    flexDirection: 'row',
  },
  starFull: {
    color: '#FFD700',
    fontSize: 16,
  },
  starHalf: {
    color: '#FFD700',
    fontSize: 16,
    opacity: 0.5,
  },
  starEmpty: {
    color: '#D3D3D3',
    fontSize: 16,
  },
});

export default RecommendationsScreen;

