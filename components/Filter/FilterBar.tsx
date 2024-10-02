import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const FilterBar: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');

  const filters = ['Todos', 'Distancia', 'Calificación', 'Tipo de Comida'];

  return (
    <View style={styles.filterBar}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            selectedFilter === filter && styles.selectedFilterButton,
          ]}
          onPress={() => setSelectedFilter(filter)}
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
  );
};

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedFilterButton: {
    backgroundColor: '#EF233C',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  selectedFilterButtonText: {
    color: '#fff',
  },
});

export default FilterBar;
