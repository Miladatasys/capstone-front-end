import React, { useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

interface CustomButtonProps {
  onPress: () => void;
  text: string;
  type?: "PRIMARY" | "SECONDARY" | "TERTIARY";
}

const ClientCustomButton: React.FC<CustomButtonProps> = ({ onPress, text, type = "PRIMARY" }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.container,
        styles[`container_${type}`],
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          pressed && styles.textPressed,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  container_PRIMARY: {
    backgroundColor: '#EF233C',
  },
  container_TERTIARY: {
    backgroundColor: 'transparent',
  },
  container_SECONDARY: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EF233C',
    borderWidth: 0,
  },
  pressed: {
    backgroundColor: '#D92D3C',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  text_PRIMARY: {
    color: 'white',
  },
  text_TERTIARY: {
    color: '#EF233C',
    textDecorationLine: 'underline',
  },
  text_SECONDARY: {
    color: '#EF233C',
  },
  textPressed: {
    color: 'white',
  },
});

export default ClientCustomButton;
