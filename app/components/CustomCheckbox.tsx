// app/components/CustomCheckbox.tsx
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CustomCheckboxProps = {
  value: boolean;
  onValueChange: () => void;
};

export default function CustomCheckbox({ value, onValueChange }: CustomCheckboxProps) {
  return (
    <TouchableOpacity onPress={onValueChange} style={styles.checkbox}>
      {value && <Ionicons name="checkmark" size={24} color="gold" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
