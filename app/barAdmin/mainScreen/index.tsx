import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Product {
  product_id: number;
  bar_id: number;
  name: string;
  price: number;
  category: 'DRINK' | 'FOOD';
}

const ITEMS_PER_PAGE = 10;

const BarAdminScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'product_id' | 'bar_id'>>({ name: '', price: 0, category: 'DRINK' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const adminBarId = 1; // Simulando bar_id para el inicio de sesion del admin

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    // simulando la llamada a la api
    const mockProducts: Product[] = Array.from({ length: 25 }, (_, i) => ({
      product_id: i + 1,
      bar_id: adminBarId,
      name: `Producto ${i + 1}`,
      price: Math.floor(Math.random() * 10000) + 1000,
      category: Math.random() > 0.5 ? 'DRINK' : 'FOOD',
    }));
    setProducts(mockProducts);
  };

  const handleInputChange = (field: keyof Omit<Product, 'product_id' | 'bar_id'>, value: string | number) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = () => {
    if (isValidProduct(newProduct)) {
      confirmAction(
        'Confirmar Adición',
        `¿Estás seguro de que quieres añadir "${newProduct.name}" a la lista de productos?`,
        () => {
          const newProductWithId: Product = {
            ...newProduct,
            product_id: Math.max(0, ...products.map(p => p.product_id)) + 1,
            bar_id: adminBarId
          };
          setProducts([...products, newProductWithId]);
          setNewProduct({ name: '', price: 0, category: 'DRINK' });
          showAlert('Éxito', 'El producto ha sido añadido correctamente.');
        }
      );
    } else {
      showAlert('Error', 'Por favor, complete todos los campos correctamente.');
    }
  };

  const handleEditProduct = (id: number) => setEditingId(id);

  const handleSaveEdit = (id: number) => {
    const editedProduct = products.find(p => p.product_id === id);
    if (editedProduct) {
      confirmAction(
        'Confirmar Edición',
        `¿Estás seguro de que quieres guardar los cambios para "${editedProduct.name}"?`,
        () => {
          setEditingId(null);
          // aqui deberia enviar el producto actualizado
          console.log('Saving edited product', editedProduct);
          showAlert('Éxito', 'Los cambios han sido guardados correctamente.');
        }
      );
    }
  };

  const handleDeleteProduct = (id: number) => {
    const productToDelete = products.find(p => p.product_id === id);
    if (productToDelete) {
      confirmAction(
        'Confirmar Eliminación',
        `¿Estás seguro de que quieres eliminar "${productToDelete.name}" de la lista de productos?`,
        () => {
          setProducts(products.filter(product => product.product_id !== id));
          showAlert('Éxito', 'El producto ha sido eliminado correctamente.');
        }
      );
    }
  };

  const handleDigitizeMenu = () => {
    confirmAction(
      'Digitalizar Menú',
      '¿Estás seguro de que quieres digitalizar el menú? Este proceso puede tomar unos minutos.',
      () => {
        simulateDigitization();
      }
    );
  };

  const simulateDigitization = () => {
    showAlert('Procesando', 'Digitalizando menú con IA...', () => {
      const newDigitizedProducts: Product[] = [
        { product_id: products.length + 1, bar_id: adminBarId, name: 'Margarita', price: 4500, category: 'DRINK' },
        { product_id: products.length + 2, bar_id: adminBarId, name: 'Alitas de Pollo', price: 7000, category: 'FOOD' },
      ];
      setProducts([...products, ...newDigitizedProducts]);
      showAlert('Éxito', 'El menú ha sido digitalizado correctamente. Se han añadido nuevos productos.');
    });
  };

  const toggleCategory = (product: Product) => {
    const newCategory = product.category === 'DRINK' ? 'FOOD' : 'DRINK';
    setProducts(products.map(p => p.product_id === product.product_id ? {...p, category: newCategory} : p));
  };

  const isValidProduct = (product: Omit<Product, 'product_id' | 'bar_id'>): boolean => {
    return !!product.name && product.price > 0 && (product.category === 'DRINK' || product.category === 'FOOD');
  };

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: onConfirm }
    ]);
  };

  const showAlert = (title: string, message: string, onPress?: () => void) => {
    Alert.alert(title, message, [{ text: 'OK', onPress }]);
  };

  const handleLogout = () => {
    confirmAction(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      () => {
        router.push('/bar/auth/BarSignInScreen');
      }
    );
  };

  const renderProductForm = () => (
    <View style={styles.addProductForm}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={newProduct.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={newProduct.price.toString()}
        onChangeText={(text) => handleInputChange('price', parseInt(text) || 0)}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.categoryButton, newProduct.category === 'DRINK' ? styles.categoryButtonActive : {}]}
        onPress={() => handleInputChange('category', newProduct.category === 'DRINK' ? 'FOOD' : 'DRINK')}
      >
        <Text style={styles.categoryButtonText}>{newProduct.category}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAddProduct} style={styles.addButton}>
        <Text style={styles.addButtonText}>Agregar Producto</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductItem = (product: Product) => (
    <View key={product.product_id} style={styles.productItem}>
      {editingId === product.product_id ? renderEditingProduct(product) : renderDisplayProduct(product)}
    </View>
  );

  const renderEditingProduct = (product: Product) => (
    <>
      <TextInput
        style={styles.editInput}
        value={product.name}
        onChangeText={(text) => setProducts(products.map(p => p.product_id === product.product_id ? {...p, name: text} : p))}
      />
      <TextInput
        style={styles.editInput}
        value={product.price.toString()}
        onChangeText={(text) => setProducts(products.map(p => p.product_id === product.product_id ? {...p, price: parseInt(text) || p.price} : p))}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.categoryButton, styles.editCategoryButton]}
        onPress={() => toggleCategory(product)}
      >
        <Text style={styles.categoryButtonText}>{product.category}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSaveEdit(product.product_id)} style={styles.saveButton}>
        <Ionicons name="checkmark" size={24} color="green" />
      </TouchableOpacity>
    </>
  );

  const renderDisplayProduct = (product: Product) => (
    <>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price.toLocaleString()} </Text>
      <Text style={styles.productCategory}>{product.category}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleEditProduct(product.product_id)}>
          <Ionicons name="create" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(product.product_id)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
        >
          <Ionicons name="chevron-back" size={24} color={currentPage === 1 ? "#ccc" : "#2B2D42"} />
        </TouchableOpacity>
        <Text style={styles.paginationText}>{currentPage} / {totalPages}</Text>
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
        >
          <Ionicons name="chevron-forward" size={24} color={currentPage === totalPages ? "#ccc" : "#2B2D42"} />
        </TouchableOpacity>
      </View>
    );
  };

  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Gestión de Productos</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.content}>
          {renderProductForm()}

          <View style={styles.productList}>
            {paginatedProducts.map(renderProductItem)}
          </View>

          {renderPagination()}

          <TouchableOpacity onPress={handleDigitizeMenu} style={styles.digitizeButton}>
            <Ionicons name="document-text" size={24} color="white" />
            <Text style={styles.digitizeButtonText}>Digitalizar Menú</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2B2D42',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  digitizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginTop: 16,
  },
  digitizeButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  addProductForm: {
    backgroundColor: '#EDF2F4',
    padding: 16,
    borderRadius: 5,
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#8D99AE',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#2B2D42',
  },
  categoryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2B2D42',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productList: {
    marginTop: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F4',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 8,
  },
  productName: {
    flex: 2,
    fontSize: 16,
  },
  productPrice: {
    flex: 1,
    fontSize: 16,
    textAlign: 
'right',
  },
  productCategory: {
    flex: 1,
    fontSize: 14,
    color: '#8D99AE',
  },
  actionButtons: {
    flexDirection: 'row',
    width: 80,
    justifyContent: 'space-between',
  },
  editInput: {
    flex: 1,
    backgroundColor: '#EDF2F4',
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  editCategoryButton: {
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    padding: 5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationButton: {
    padding: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BarAdminScreen;

