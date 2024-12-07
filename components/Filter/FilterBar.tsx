import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';

interface FilterBarProps {
  onSearch: (text: string) => void;
  onSortChange: (sortBy: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch, onSortChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const filters = ['Todos', 'Calificación'];

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'Calificación') {
      onSortChange('rating');
    } else {
      onSortChange('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchField}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Buscar bares" 
              onChangeText={onSearch}
            />
          </View>
        </View>
        <View style={styles.filterBar}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.selectedFilterButton,
              ]}
              onPress={() => handleFilterPress(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.selectedFilterButtonText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#333',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedFilterButton: {
    backgroundColor: '#EF233C',
    borderColor: '#EF233C',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 12,
  },
  selectedFilterButtonText: {
    color: '#fff',
  },
});

export default FilterBar;

