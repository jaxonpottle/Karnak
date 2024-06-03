// app/screens/BarcodeScannerScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';

const BarcodeScannerScreen = () => {
  const [barcode, setBarcode] = useState('');
  const navigation = useNavigation();

  const handleBarCodeRead = ({ data }) => {
    setBarcode(data);
    navigation.navigate('NewCarProcess', { vin: data });
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={handleBarCodeRead}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>Scan a VIN Barcode</Text>
        </View>
      </RNCamera>
      {barcode ? <Text style={styles.barcodeText}>{barcode}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: 'white', fontSize: 18 },
  barcodeText: { fontSize: 16, padding: 10 },
});

export default BarcodeScannerScreen;

