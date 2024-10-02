import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface CustomInputProps {
  value: string;
  setvalue: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
}

const ClientCustomInput: React.FC<CustomInputProps> = ({ value, setvalue, placeholder, secureTextEntry }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.focusedContainer]}>
      <TextInput
        value={value}
        onChangeText={setvalue}
        placeholder={placeholder}
        placeholderTextColor="#A9A9A9"
        style={styles.input}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    width: '100%',
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  focusedContainer: {
    borderColor: '#EF233C',
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
});

export default ClientCustomInput;
