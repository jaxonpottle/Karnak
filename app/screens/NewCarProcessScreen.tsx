// app/screens/NewCarProcessScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function NewCarProcessScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [vin, setVin] = useState('');

  useEffect(() => {
    if (route.params?.vin) {
      setVin(route.params.vin);
    }
  }, [route.params?.vin]);

  return (
    <View style={styles.container}>
      <Text>Enter VIN Number:</Text>
      <TextInput
        style={styles.input}
        value={vin}
        onChangeText={setVin}
      />
      <TouchableOpacity onPress={() => navigation.navigate('BarcodeScanner')} style={styles.scanButton}>
        <Text style={styles.buttonText}>Scan VIN</Text>
      </TouchableOpacity>
      {/* Add the rest of the input fields here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
  },
  scanButton: {
    backgroundColor: 'gold',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});





/*
// app/screens/NewCarProcessScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type RootStackParamList = {
  CarDetail: { carId: string };
  // other routes...
};

export default function NewCarProcessScreen() {
  const [vehicleName, setVehicleName] = useState('');
  const [stockNumber, setStockNumber] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleStartProcess = async () => {
    try {
      const docRef = await addDoc(collection(db, 'cars'), {
        vehicleName,
        stockNumber,
        dealerFolder: '',
        titleStatus: '',
        keyTag: '',
        pricing: '',
        websiteUpload: '',
        bodyRepairStatus: '',
        repairCost: '',
        inspectionStatus: '',
        carLotStatus: '',
      });
      navigation.navigate('CarDetail', { carId: docRef.id });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Vehicle Name"
        value={vehicleName}
        onChangeText={setVehicleName}
      />
      <TextInput
        style={styles.input}
        placeholder="Stock Number"
        value={stockNumber}
        onChangeText={setStockNumber}
      />
      <Button title="Start Process" onPress={handleStartProcess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Adjust according to theme
  },
  input: {
    height: 40,
    borderColor: 'gold',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
    color: 'white', // Adjust according to theme
  },
});
*/
