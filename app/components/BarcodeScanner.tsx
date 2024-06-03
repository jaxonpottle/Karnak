// app/components/BarcodeScanner.tsx
import React, { useState } from 'react';
import { RNCamera } from 'react-native-camera';
import { View, Text, StyleSheet } from 'react-native';

const BarcodeScanner = ({ onScan }) => {
  const [barcode, setBarcode] = useState('');

  const handleBarCodeRead = ({ data }) => {
    setBarcode(data);
    onScan(data);
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

export default BarcodeScanner;
